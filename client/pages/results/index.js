import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  chakra,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon, ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getPublishedResultsList } from "../../action/results";

// Known event metadata for visual flair
const EVENT_META = {
  hacknova: {
    name: "HackNova",
    tagline: "Hackathon",
    accentColor: "#22D3EE",
    glowColor: "rgba(34, 211, 238, 0.4)",
    badgeText: "HACKATHON",
  },
  innowave: {
    name: "InnoWave",
    tagline: "Innovation & Idea Pitching",
    accentColor: "#38D9A9",
    glowColor: "rgba(56, 217, 169, 0.4)",
    badgeText: "INNOVATION",
  },
  freeze: {
    name: "Freeze The Second",
    tagline: "Photography",
    accentColor: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.4)",
    badgeText: "PHOTOGRAPHY",
  },
  rootcause: {
    name: "Root Cause",
    tagline: "Debugging & Problem Solving",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeText: "DEBUGGING",
  },
};

const ResultsIndexPage = () => {
  const router = useRouter();
  const [resultsList, setResultsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await getPublishedResultsList();
        if (isMounted) {
          if (data && Array.isArray(data.results)) {
            setResultsList(data.results);
          } else {
            setResultsList([]);
          }
        }
      } catch (err) {
        console.error("Error fetching results list:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
    };
  }, []);

  // Group published results by event_slug
  const eventGroupMap = resultsList.reduce((acc, curr) => {
    const slug = curr.event_slug.toLowerCase();
    if (!acc[slug]) {
      acc[slug] = [];
    }
    acc[slug].push(curr);
    return acc;
  }, {});

  // Pre-seed known events so users always see cards even if results are pending
  const defaultEvents = ["hacknova", "innowave", "freeze", "rootcause"];
  const allEventSlugs = Array.from(new Set([...defaultEvents, ...Object.keys(eventGroupMap)]));

  const filteredEvents = allEventSlugs.filter((slug) => {
    const meta = EVENT_META[slug] || { name: slug };
    const query = searchQuery.toLowerCase().trim();
    return (
      slug.includes(query) ||
      meta.name.toLowerCase().includes(query) ||
      (eventGroupMap[slug] &&
        eventGroupMap[slug].some((r) => r.round_name.toLowerCase().includes(query)))
    );
  });

  return (
    <Layout>
      <Box w="full" px={{ base: 3, sm: 6, md: 10, lg: 16 }} py={{ base: 4, sm: 6, md: 12 }}>
        {/* Top Navigation Bar: Back, DashBoard */}
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
              fontSize={{ base: "xs", sm: "xs" }}
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
                fontSize={{ base: "xs", sm: "xs" }}
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
        </Flex>

        {/* Header / Hero */}
        <Flex direction="column" align="center" textAlign="center" mb={{ base: 6, md: 10 }}>
          <Badge
            px={{ base: 2.5, sm: 3 }}
            py={1}
            mb={3}
            rounded="full"
            bg="rgba(56, 217, 169, 0.12)"
            border="1px solid rgba(56, 217, 169, 0.4)"
            color="#38D9A9"
            fontFamily="'Orbitron', sans-serif"
            fontSize={{ base: "10px", sm: "2xs", md: "xs" }}
            letterSpacing={{ base: "0.1em", sm: "0.15em" }}
            textTransform="uppercase"
            boxShadow="0 0 12px rgba(56, 217, 169, 0.2)"
          >
            Pulzion &apos;26 • Public Broadcast
          </Badge>

          <Text
            as="h1"
            fontFamily="'Orbitron', sans-serif !important"
            fontSize={{ base: "2xl", sm: "3xl", md: "5xl" }}
            fontWeight="black"
            letterSpacing={{ base: "0.04em", sm: "0.06em" }}
            color="#FFFFFF"
            textTransform="uppercase"
            textShadow="0 0 25px rgba(56, 217, 169, 0.35)"
            mb={2}
          >
            OFFICIAL <chakra.span color="#38D9A9">RESULTS</chakra.span>
          </Text>

          <Text
            fontFamily="'Inter', sans-serif"
            fontSize={{ base: "9px", sm: "sm", md: "md" }}
            color="#94A3B8"
            maxW="650px"
            lineHeight="tall"
            px={{ base: 2, sm: 0 }}
          >
            Check qualified teams and shortlisted participants for each round of Pulzion &apos;26
            events. Shortlisted candidates are displayed in alphabetical order of name.
          </Text>

          <Badge
            mt={2.5}
            px={2.5}
            py={0.8}
            rounded="full"
            bg="rgba(56, 217, 169, 0.12)"
            border="1px solid rgba(56, 217, 169, 0.4)"
            color="#38D9A9"
            fontFamily="'Inter', sans-serif"
            fontSize={{ base: "10px", sm: "2xs" }}
            fontWeight="semibold"
            letterSpacing="0.05em"
          >
            Results are sorted in alphabetical order of name
          </Badge>

          {/* Search Bar */}
          <Box mt={{ base: 4, md: 6 }} w="full" maxW="460px">
            <InputGroup size={{ base: "md", sm: "md" }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="#38D9A9" boxSize={2} mt={1.5} ml={1.5} />
              </InputLeftElement>
              <Input
                placeholder="    Search event or round (e.g. HackNova, Round 1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="rgba(7, 17, 38, 0.85)"
                border="1px solid rgba(56, 217, 169, 0.3)"
                color="#F8FAFC"
                fontSize={{ base: "xs", sm: "sm" }}
                focusBorderColor="#38D9A9"
                rounded="lg"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
                _hover={{ borderColor: "rgba(56, 217, 169, 0.5)" }}
                _placeholder={{ color: "rgba(148, 163, 184, 0.7)" }}
              />
            </InputGroup>
          </Box>
        </Flex>

        {/* Loading Spinner */}
        {loading ? (
          <Flex direction="column" align="center" justify="center" py={16}>
            <Spinner size="lg" color="#38D9A9" thickness="3px" speed="0.8s" />
            <Text
              mt={4}
              fontFamily="'Orbitron', sans-serif"
              fontSize={{ base: "xs", sm: "sm" }}
              color="#38D9A9"
              letterSpacing="0.1em"
            >
              RETRIEVING LATEST RESULTS...
            </Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={{ base: 4, sm: 6, md: 8 }} maxW="1100px" mx="auto">
            {filteredEvents.map((slug) => {
              const meta = EVENT_META[slug] || {
                name: slug.toUpperCase(),
                tagline: "Event Results",
                accentColor: "#38D9A9",
                glowColor: "rgba(56, 217, 169, 0.4)",
                badgeText: "EVENT",
              };
              const rounds = eventGroupMap[slug] || [];
              const hasPublishedResults = rounds.length > 0;

              return (
                <Box
                  key={slug}
                  position="relative"
                  bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)"
                  backdropFilter="blur(16px)"
                  border={`1px solid ${hasPublishedResults ? meta.accentColor : "rgba(255, 255, 255, 0.12)"}`}
                  boxShadow={
                    hasPublishedResults
                      ? `0 0 25px ${meta.glowColor}, 0 12px 32px rgba(0, 0, 0, 0.85)`
                      : "0 8px 24px rgba(0, 0, 0, 0.6)"
                  }
                  p={{ base: 4, sm: 6, md: 8 }}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: `0 0 35px ${meta.glowColor}, 0 16px 40px rgba(0, 0, 0, 0.9)`,
                    borderColor: meta.accentColor,
                  }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  minH={{ base: "auto", md: "260px" }}
                >
                  {/* HUD Corner Accents */}
                  <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft={`2px solid ${meta.accentColor}`} borderTop={`2px solid ${meta.accentColor}`} pointerEvents="none" />
                  <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight={`2px solid ${meta.accentColor}`} borderTop={`2px solid ${meta.accentColor}`} pointerEvents="none" />
                  <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft={`2px solid ${meta.accentColor}`} borderBottom={`2px solid ${meta.accentColor}`} pointerEvents="none" />
                  <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight={`2px solid ${meta.accentColor}`} borderBottom={`2px solid ${meta.accentColor}`} pointerEvents="none" />

                  {/* Card Top: Header & Badges */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={2}>
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

                      {hasPublishedResults ? (
                        <Badge
                          px={2}
                          py={0.5}
                          rounded="full"
                          bg="rgba(56, 217, 169, 0.15)"
                          border="1px solid #38D9A9"
                          color="#38D9A9"
                          fontSize="2xs"
                          fontWeight="bold"
                          letterSpacing="0.06em"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Box w="5px" h="5px" rounded="full" bg="#38D9A9" />
                          RESULTS OUT
                        </Badge>
                      ) : (
                        <Badge
                          px={2}
                          py={0.5}
                          rounded="full"
                          bg="rgba(148, 163, 184, 0.1)"
                          border="1px solid rgba(148, 163, 184, 0.3)"
                          color="#94A3B8"
                          fontSize="2xs"
                          letterSpacing="0.06em"
                        >
                          PENDING
                        </Badge>
                      )}
                    </Flex>

                    {/* Title */}
                    <Text
                      fontFamily="'Orbitron', sans-serif !important"
                      fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                      fontWeight="bold"
                      color="#FFFFFF"
                      letterSpacing="0.05em"
                      textTransform="uppercase"
                      mt={1}
                    >
                      {meta.name}
                    </Text>

                    <Text
                      fontFamily="'Inter', sans-serif"
                      fontSize="xs"
                      color="#94A3B8"
                      mt={0.5}
                      mb={3}
                    >
                      {meta.tagline}
                    </Text>

                    {/* Published Rounds Tags */}
                    {hasPublishedResults ? (
                      <Box mb={4}>
                        <Text
                          fontSize="2xs"
                          fontFamily="'Orbitron', sans-serif"
                          color="#94A3B8"
                          letterSpacing="0.06em"
                          textTransform="uppercase"
                          mb={1.5}
                        >
                          Available Rounds:
                        </Text>
                        <Flex wrap="wrap" gap={1.5}>
                          {rounds.map((r, i) => (
                            <Badge
                              key={i}
                              px={2}
                              py={0.5}
                              rounded="md"
                              bg="rgba(56, 217, 169, 0.1)"
                              border="1px solid rgba(56, 217, 169, 0.3)"
                              color="#38D9A9"
                              fontSize={{ base: "2xs", sm: "xs" }}
                              fontFamily="'Inter', sans-serif"
                              fontWeight="semibold"
                            >
                              ✓ {r.round_name}
                            </Badge>
                          ))}
                        </Flex>
                      </Box>
                    ) : (
                      <Box mb={4} p={2.5} rounded="md" bg="rgba(0,0,0,0.25)" border="1px dashed rgba(255,255,255,0.1)">
                        <Text fontSize="xs" color="#64748B" fontStyle="italic">
                          Results will be released after evaluation completes.
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {/* Card Bottom CTA */}
                  <Link href={`/results/${slug}`} passHref>
                    <Button
                      as="a"
                      w="full"
                      h={{ base: "38px", sm: "42px" }}
                      bg={
                        hasPublishedResults
                          ? `linear-gradient(90deg, ${meta.accentColor} 0%, #22D3EE 100%)`
                          : "rgba(15, 23, 42, 0.8)"
                      }
                      color={hasPublishedResults ? "#030512" : "#CBD5E1"}
                      border={hasPublishedResults ? "none" : "1px solid rgba(255,255,255,0.15)"}
                      fontFamily="'Inter', sans-serif"
                      fontSize={{ base: "2xs", sm: "xs" }}
                      fontWeight="bold"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      rounded="md"
                      rightIcon={<ArrowForwardIcon />}
                      _hover={{
                        bg: hasPublishedResults
                          ? `linear-gradient(90deg, #22D3EE 0%, ${meta.accentColor} 100%)`
                          : "rgba(30, 41, 59, 0.9)",
                        transform: "translateY(-1px)",
                      }}
                      _active={{ transform: "scale(0.99)" }}
                      cursor="pointer"
                    >
                      {hasPublishedResults ? `View ${meta.name} Results` : "Check Status"}
                    </Button>
                  </Link>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
    </Layout>
  );
};

export default ResultsIndexPage;
