import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
  chakra,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ArrowBackIcon,
  CheckCircleIcon,
  CopyIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { getEventResults } from "../../action/results";

// Known event metadata for visual styling
const EVENT_META = {
  hacknova: {
    name: "HackNova",
    subtitle: "Hackathon Shortlist",
    accentColor: "#22D3EE",
    glowColor: "rgba(34, 211, 238, 0.4)",
    badgeText: "HACKATHON",
  },
  innowave: {
    name: "InnoWave",
    subtitle: "Innovation & Idea Pitching Shortlist",
    accentColor: "#38D9A9",
    glowColor: "rgba(56, 217, 169, 0.4)",
    badgeText: "INNOVATION",
  },
  freeze: {
    name: "Freeze",
    subtitle: "Photography Competition Shortlist",
    accentColor: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.4)",
    badgeText: "PHOTOGRAPHY",
  },
  rootcause: {
    name: "Root Cause",
    subtitle: "Debugging Competition Shortlist",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeText: "DEBUGGING",
  },
};

const EventResultPage = () => {
  const router = useRouter();
  const { event } = router.query;
  const toast = useToast();

  const [rounds, setRounds] = useState([]);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const eventSlug = typeof event === "string" ? event.toLowerCase() : "";
  const meta = EVENT_META[eventSlug] || {
    name: eventSlug ? eventSlug.toUpperCase() : "EVENT",
    subtitle: "Shortlisted Participants & Teams",
    accentColor: "#38D9A9",
    glowColor: "rgba(56, 217, 169, 0.4)",
    badgeText: "RESULTS",
  };

  useEffect(() => {
    if (!router.isReady || !eventSlug) return;

    let isMounted = true;
    const fetchEventData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await getEventResults(eventSlug);
        if (!isMounted) return;

        if (res && res.success && Array.isArray(res.rounds) && res.rounds.length > 0) {
          setRounds(res.rounds);
          setSelectedRoundIndex(0);
        } else {
          setRounds([]);
          if (res?.error) {
            setErrorMsg(res.error);
          }
        }
      } catch (err) {
        console.error("Failed to load event results:", err);
        if (isMounted) setErrorMsg("Failed to load results. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEventData();
    return () => {
      isMounted = false;
    };
  }, [router.isReady, eventSlug]);

  const currentRound = rounds[selectedRoundIndex] || null;
  const teamsList = currentRound?.teams || [];
  const showId = currentRound ? currentRound.show_id !== false : true;
  const showLeaderCollege = currentRound ? currentRound.show_leader_college !== false : true;
  const tableColSpan = 2 + (showId ? 1 : 0) + (showLeaderCollege ? 1 : 0);

  const filteredTeams = teamsList.filter((team) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const teamName = String(team.team_name || "").toLowerCase();
    const leaderName = String(team.leader_name || "").toLowerCase();
    const teamId = String(team.team_id || "").toLowerCase();
    return teamName.includes(q) || leaderName.includes(q) || teamId.includes(q);
  });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/results");
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Results URL copied to clipboard.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Box w="full" px={{ base: 3, sm: 6, md: 10, lg: 16 }} py={{ base: 4, sm: 6, md: 10 }}>
        {/* Top Navigation Bar: Back, All Results, HomePage, DashBoard, Copy Link */}
        <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} wrap="wrap" gap={2}>
          <HStack spacing={2} wrap="wrap">
            <Button
              size="sm"
              h="32px"
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              borderColor="rgba(56, 217, 169, 0.4)"
              color="#38D9A9"
              bg="rgba(7, 17, 38, 0.6)"
              rounded="md"
              fontFamily="'Inter', sans-serif"
              fontSize={{ base: "2xs", sm: "xs" }}
              letterSpacing="0.08em"
              textTransform="uppercase"
              onClick={handleBack}
              _hover={{
                bg: "rgba(56, 217, 169, 0.15)",
                borderColor: "#38D9A9",
                transform: "translateX(-2px)",
              }}
              cursor="pointer"
            >
              Back
            </Button>

            <Link href="/results" passHref>
              <Button
                as="a"
                size="sm"
                h="32px"
                variant="outline"
                borderColor="rgba(56, 217, 169, 0.3)"
                color="#38D9A9"
                bg="rgba(7, 17, 38, 0.6)"
                rounded="md"
                fontFamily="'Inter', sans-serif"
                fontSize={{ base: "2xs", sm: "xs" }}
                letterSpacing="0.08em"
                textTransform="uppercase"
                _hover={{
                  bg: "rgba(56, 217, 169, 0.15)",
                  borderColor: "#38D9A9",
                }}
                cursor="pointer"
              >
                All Results
              </Button>
            </Link>

            <Link href="/dashboard" passHref>
              <Button
                as="a"
                size="sm"
                h="32px"
                variant="outline"
                borderColor="rgba(34, 211, 238, 0.35)"
                color="#22D3EE"
                bg="rgba(7, 17, 38, 0.6)"
                rounded="md"
                fontFamily="'Inter', sans-serif"
                fontSize={{ base: "2xs", sm: "xs" }}
                letterSpacing="0.08em"
                textTransform="uppercase"
                _hover={{
                  bg: "rgba(34, 211, 238, 0.15)",
                  borderColor: "#22D3EE",
                }}
                cursor="pointer"
              >
                DashBoard
              </Button>
            </Link>
          </HStack>

          <HStack spacing={2}>
            <IconButton
              aria-label="Copy Results Link"
              icon={<CopyIcon />}
              size="sm"
              h="32px"
              variant="outline"
              borderColor="rgba(255, 255, 255, 0.2)"
              color="#CBD5E1"
              bg="rgba(7, 17, 38, 0.6)"
              rounded="md"
              onClick={handleCopyLink}
              _hover={{ color: "#38D9A9", borderColor: "#38D9A9" }}
            />
          </HStack>
        </Flex>

        {/* Hero Banner */}
        <Box
          position="relative"
          bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)"
          backdropFilter="blur(16px)"
          border={`1px solid ${meta.accentColor}`}
          boxShadow={`0 0 30px ${meta.glowColor}, 0 12px 32px rgba(0, 0, 0, 0.85)`}
          p={{ base: 4, sm: 6, md: 8 }}
          mb={{ base: 5, md: 8 }}
        >
          {/* HUD Corner Accents */}
          <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft={`2px solid ${meta.accentColor}`} borderTop={`2px solid ${meta.accentColor}`} pointerEvents="none" />
          <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight={`2px solid ${meta.accentColor}`} borderTop={`2px solid ${meta.accentColor}`} pointerEvents="none" />
          <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft={`2px solid ${meta.accentColor}`} borderBottom={`2px solid ${meta.accentColor}`} pointerEvents="none" />
          <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight={`2px solid ${meta.accentColor}`} borderBottom={`2px solid ${meta.accentColor}`} pointerEvents="none" />

          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={{ base: 4, md: 6 }}>
            <Box>
              <HStack spacing={2} mb={2} wrap="wrap">
                <Badge
                  px={2}
                  py={0.5}
                  rounded="md"
                  bg="rgba(0, 0, 0, 0.4)"
                  border={`1px solid ${meta.accentColor}`}
                  color={meta.accentColor}
                  fontFamily="'Orbitron', sans-serif"
                  fontSize="2xs"
                  letterSpacing="0.08em"
                >
                  {meta.badgeText}
                </Badge>
                {currentRound && (
                  <Badge
                    px={2}
                    py={0.5}
                    rounded="md"
                    bg="rgba(56, 217, 169, 0.15)"
                    border="1px solid #38D9A9"
                    color="#38D9A9"
                    fontFamily="'Orbitron', sans-serif"
                    fontSize="2xs"
                    letterSpacing="0.08em"
                  >
                    {currentRound.round_name}
                  </Badge>
                )}
              </HStack>

              <Text
                as="h1"
                fontFamily="'Orbitron', sans-serif !important"
                fontSize={{ base: "xl", sm: "2xl", md: "4xl" }}
                fontWeight="black"
                color="#FFFFFF"
                letterSpacing="0.05em"
                textTransform="uppercase"
                textShadow={`0 0 20px ${meta.glowColor}`}
              >
                {meta.name} <chakra.span color={meta.accentColor}>RESULTS</chakra.span>
              </Text>

              <Text fontFamily="'Inter', sans-serif" fontSize={{ base: "xs", sm: "sm" }} color="#94A3B8" mt={1}>
                {meta.subtitle} • Pulzion &apos;26 Official Shortlist
              </Text>
            </Box>

            {/* Quick Stat Counter */}
            {currentRound && (
              <Flex
                direction={{ base: "row", md: "column" }}
                justify={{ base: "space-between", md: "center" }}
                align={{ base: "center", md: "flex-end" }}
                px={{ base: 4, md: 6 }}
                py={{ base: 2.5, md: 3 }}
                rounded="lg"
                bg="rgba(3, 8, 23, 0.75)"
                border="1px solid rgba(56, 217, 169, 0.3)"
                w={{ base: "full", md: "auto" }}
              >
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize={{ base: "2xs", sm: "xs" }}
                  color="#94A3B8"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  order={{ base: 1, md: 2 }}
                >
                  Qualified Candidates
                </Text>
                <Text
                  fontFamily="'Orbitron', sans-serif"
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="#38D9A9"
                  order={{ base: 2, md: 1 }}
                >
                  {teamsList.length}
                </Text>
              </Flex>
            )}
          </Flex>

          {/* Round Selector Tabs (if multiple rounds exist) */}
          {rounds.length > 1 && (
            <Flex mt={{ base: 4, md: 6 }} pt={{ base: 3, md: 4 }} borderTop="1px solid rgba(255, 255, 255, 0.08)" gap={2} wrap="wrap" align="center">
              <Text
                fontFamily="'Orbitron', sans-serif"
                fontSize="xs"
                color="#94A3B8"
                mr={1}
                letterSpacing="0.05em"
              >
                Select Round:
              </Text>
              {rounds.map((r, idx) => (
                <Button
                  key={idx}
                  size="xs"
                  px={3}
                  py={1.5}
                  rounded="md"
                  fontFamily="'Inter', sans-serif"
                  fontSize="2xs"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                  onClick={() => setSelectedRoundIndex(idx)}
                  bg={
                    selectedRoundIndex === idx
                      ? `linear-gradient(90deg, ${meta.accentColor} 0%, #22D3EE 100%)`
                      : "rgba(15, 23, 42, 0.7)"
                  }
                  color={selectedRoundIndex === idx ? "#030512" : "#94A3B8"}
                  border={selectedRoundIndex === idx ? "none" : "1px solid rgba(255, 255, 255, 0.15)"}
                  _hover={{
                    bg: selectedRoundIndex === idx ? undefined : "rgba(30, 41, 59, 0.9)",
                    color: "#FFFFFF",
                  }}
                >
                  {r.round_name}
                </Button>
              ))}
            </Flex>
          )}
        </Box>

        {/* Loading State */}
        {loading ? (
          <Flex direction="column" align="center" justify="center" py={16}>
            <Spinner size="lg" color={meta.accentColor} thickness="3px" speed="0.8s" />
            <Text
              mt={4}
              fontFamily="'Orbitron', sans-serif"
              fontSize={{ base: "xs", sm: "sm" }}
              color={meta.accentColor}
              letterSpacing="0.1em"
            >
              FETCHING SHORTLISTED CANDIDATES...
            </Text>
          </Flex>
        ) : rounds.length === 0 ? (
          /* Empty / No Results State */
          <Box
            p={{ base: 6, sm: 8, md: 12 }}
            textAlign="center"
            rounded="xl"
            bg="rgba(11, 21, 46, 0.6)"
            border="1px dashed rgba(56, 217, 169, 0.3)"
            maxW="700px"
            mx="auto"
          >
            <Text
              fontFamily="'Orbitron', sans-serif"
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              fontWeight="bold"
              color="#F8FAFC"
              mb={2}
            >
              NO RESULTS PUBLISHED YET
            </Text>
            <Text fontFamily="'Inter', sans-serif" fontSize="xs" color="#94A3B8" maxW="480px" mx="auto" mb={6}>
              {errorMsg ||
                `The results for ${meta.name} have not been published by the evaluation committee yet. Please check back later or monitor official announcements.`}
            </Text>
            <Link href="/results" passHref>
              <Button
                as="a"
                size="sm"
                bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                color="#030512"
                fontFamily="'Inter', sans-serif"
                fontWeight="bold"
                fontSize="xs"
                letterSpacing="0.1em"
                textTransform="uppercase"
                rounded="md"
                cursor="pointer"
              >
                Back to Results Hub
              </Button>
            </Link>
          </Box>
        ) : (
          /* Main Results Content */
          <Box>
            {/* Search Filter Bar */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              gap={3}
              mb={3}
            >
              <InputGroup maxW={{ base: "full", sm: "380px" }} size={{ base: "sm", sm: "md" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="#38D9A9" />
                </InputLeftElement>
                <Input
                  placeholder="Search by Team Name, ID, or Leader..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="rgba(7, 17, 38, 0.85)"
                  border="1px solid rgba(56, 217, 169, 0.3)"
                  color="#F8FAFC"
                  fontSize="xs"
                  focusBorderColor="#38D9A9"
                  rounded="lg"
                  _placeholder={{ color: "rgba(148, 163, 184, 0.7)" }}
                />
              </InputGroup>

              <Text fontFamily="'Inter', sans-serif" fontSize="xs" color="#94A3B8" textAlign={{ base: "left", sm: "right" }}>
                Showing <chakra.span color="#38D9A9" fontWeight="bold">{filteredTeams.length}</chakra.span> of {teamsList.length} shortlisted
              </Text>
            </Flex>

            {/* Mobile horizontal scroll hint */}
            <Text display={{ base: "block", md: "none" }} fontSize="2xs" color="#94A3B8" mb={2}>
              👉 Swipe horizontally to view full details
            </Text>

            {/* Results Table */}
            <Box
              position="relative"
              bg="rgba(7, 16, 36, 0.95)"
              backdropFilter="blur(16px)"
              border="1px solid rgba(56, 217, 169, 0.35)"
              boxShadow="0 10px 30px rgba(0, 0, 0, 0.7)"
              overflow="hidden"
            >
              {/* Corner Accents */}
              <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
              <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
              <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
              <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

              <Box
                overflowX="auto"
                sx={{
                  "&::-webkit-scrollbar": { height: "5px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(56, 217, 169, 0.4)",
                    borderRadius: "3px",
                  },
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <Table variant="simple" size={{ base: "sm", md: "md" }} minW="480px">
                  <Thead bg="rgba(56, 217, 169, 0.08)">
                    <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
                      <Th fontFamily="'Orbitron', sans-serif !important" color="#38D9A9" letterSpacing="0.08em" textTransform="uppercase" w={{ base: "45px", md: "60px" }}>
                        #
                      </Th>
                      {showId && (
                        <Th fontFamily="'Orbitron', sans-serif !important" color="#38D9A9" letterSpacing="0.08em" textTransform="uppercase" w={{ base: "85px", md: "110px" }}>
                          ID
                        </Th>
                      )}
                      <Th fontFamily="'Orbitron', sans-serif !important" color="#38D9A9" letterSpacing="0.08em" textTransform="uppercase" minW="140px">
                        Team / Candidate
                      </Th>
                      {showLeaderCollege && (
                        <Th fontFamily="'Orbitron', sans-serif !important" color="#38D9A9" letterSpacing="0.08em" textTransform="uppercase" minW="130px">
                          Leader / College
                        </Th>
                      )}
                      <Th fontFamily="'Orbitron', sans-serif !important" color="#38D9A9" letterSpacing="0.08em" textTransform="uppercase" textAlign="right" w={{ base: "105px", md: "130px" }}>
                        Status
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map((team, index) => (
                        <Tr
                          key={team.team_id || index}
                          borderBottom="1px solid rgba(255, 255, 255, 0.06)"
                          _hover={{ bg: "rgba(56, 217, 169, 0.06)" }}
                          transition="background 0.15s ease"
                        >
                          <Td fontFamily="'Orbitron', sans-serif" fontSize={{ base: "xs", md: "sm" }} color="#94A3B8">
                            {index + 1}
                          </Td>
                          {showId && (
                            <Td>
                              <Badge
                                px={1.5}
                                py={0.5}
                                rounded="md"
                                bg="rgba(34, 211, 238, 0.12)"
                                border="1px solid rgba(34, 211, 238, 0.35)"
                                color="#22D3EE"
                                fontFamily="'Orbitron', sans-serif"
                                fontSize={{ base: "2xs", md: "xs" }}
                              >
                                #{team.team_id}
                              </Badge>
                            </Td>
                          )}
                          <Td>
                            <Text
                              fontFamily="'Inter', sans-serif"
                              fontSize={{ base: "xs", md: "sm" }}
                              fontWeight="bold"
                              color="#FFFFFF"
                            >
                              {team.team_name}
                            </Text>
                          </Td>
                          {showLeaderCollege && (
                            <Td>
                              <Text
                                fontFamily="'Inter', sans-serif"
                                fontSize={{ base: "2xs", md: "xs" }}
                                color="#CBD5E1"
                              >
                                {team.leader_name || "—"}
                              </Text>
                            </Td>
                          )}
                          <Td textAlign="right">
                            <Badge
                              px={{ base: 2, md: 2.5 }}
                              py={{ base: 0.5, md: 1 }}
                              rounded="full"
                              bg="rgba(56, 217, 169, 0.18)"
                              border="1px solid #38D9A9"
                              color="#38D9A9"
                              fontSize={{ base: "3xs", md: "2xs" }}
                              fontWeight="extrabold"
                              letterSpacing="0.08em"
                              display="inline-flex"
                              alignItems="center"
                              gap={1}
                              boxShadow="0 0 10px rgba(56, 217, 169, 0.25)"
                            >
                              <CheckCircleIcon w={{ base: "8px", md: "10px" }} h={{ base: "8px", md: "10px" }} />
                              QUALIFIED
                            </Badge>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={tableColSpan} py={10} textAlign="center">
                          <VStack spacing={2}>
                            <Text fontFamily="'Inter', sans-serif" fontSize="xs" color="#94A3B8">
                              No entries match &quot;{searchQuery}&quot;
                            </Text>
                            <Button
                              size="xs"
                              variant="link"
                              color="#38D9A9"
                              onClick={() => setSearchQuery("")}
                            >
                              Clear filter
                            </Button>
                          </VStack>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default EventResultPage;
