import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  chakra,
  useTheme,
  useColorModeValue,
  Button,
  Text,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import privateUserRoute from "../routers/privateUserRoute";
import NextLink from "next/link";
import { ChevronRightIcon, CheckCircleIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import InnoWaveTeamRegistration from "../components/InnoWaveTeamRegistration";
import SubmissionClosedNotice from "../components/SubmissionClosedNotice";
import { getInnoWaveTeamRegistrationStatus } from "../action/innowaveTeam";
import ContentLoader from "../components/ContentLoader";

const InnoWaveTeamPage = () => {
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [teamRegistrationActive, setTeamRegistrationActive] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check live status specifically for InnoWave Team Registrations (Event ID 201, route /innowave-team)
  useEffect(() => {
    let isMounted = true;
    const fetchTeamStatus = async () => {
      try {
        const res = await getInnoWaveTeamRegistrationStatus();
        if (isMounted) {
          setTeamRegistrationActive(Boolean(res.status || res.is_active));
        }
      } catch (e) {
        console.error("Failed to check InnoWave team registration status:", e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchTeamStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  return !loading ? (
    <Layout>
      <Box
        pt={{ base: 6, md: 10 }}
        width="full"
        pb="80px"
        px={{ base: "16px", md: "48px", lg: "64px" }}
        maxW="6xl"
        mx="auto"
      >
        {/* Breadcrumbs & Navigation Header */}
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={3}
          mb={4}
        >
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="#38D9A9" />}
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            color="gray.400"
          >
            <BreadcrumbItem>
              <NextLink href="/dashboard" passHref>
                <BreadcrumbLink color="#38D9A9" _hover={{ color: "#22D3EE" }}>
                  Dashboard
                </BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <NextLink href="/innowave" passHref>
                <BreadcrumbLink color="#38D9A9" _hover={{ color: "#22D3EE" }}>
                  InnoWave
                </BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="#CBD5E1">InnoWave Team Registration</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <NextLink href="/dashboard" passHref>
            <Button
              as="a"
              size="sm"
              variant="outline"
              borderColor="rgba(56, 217, 169, 0.4)"
              color="#38D9A9"
              fontFamily="'Oxanium', sans-serif"
              fontSize="xs"
              letterSpacing="0.1em"
              textTransform="uppercase"
              _hover={{ bg: "rgba(56, 217, 169, 0.15)", borderColor: "#38D9A9" }}
            >
              ← Back to Dashboard
            </Button>
          </NextLink>
        </Flex>

        {/* Page Title & Badging */}
        <Box mb={6}>
          <Flex
            align="flex-start"
            wrap="wrap"
            gap={2}
            mb={2}
            maxW="100%"
          >
            <Badge
              maxW="100%"
              whiteSpace="normal"
              wordBreak="break-word"
              px={3}
              py={1}
              rounded="full"
              border="1px solid rgba(56, 217, 169, 0.4)"
              bg="rgba(5, 11, 29, 0.8)"
              color="#38D9A9"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.2em"
              fontFamily="'Oxanium', sans-serif"
              boxShadow="0 0 15px rgba(56, 217, 169, 0.2)"
            >
              <Box as="span" display="inline-block" w="6px" h="6px" rounded="full" bg="#38D9A9" mr={2} boxShadow="0 0 8px #38D9A9" />
              PULZION &apos;26 &bull; INNOWAVE
            </Badge>

            <Badge
              maxW="100%"
              whiteSpace="normal"
              wordBreak="break-word"
              px={2.5}
              py={1}
              rounded="full"
              border="1px solid rgba(34, 211, 238, 0.4)"
              bg="rgba(34, 211, 238, 0.1)"
              color="#22D3EE"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.15em"
              fontFamily="'Oxanium', sans-serif"
            >
              TEAM REGISTRATION ONLY
            </Badge>
          </Flex>

          <chakra.h1
            fontSize={{ base: 28, sm: 40 }}
            fontWeight="bold"
            color={textColor}
            textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}
            fontFamily="'United Colony', sans-serif !important"
            letterSpacing="0.05em"
            textTransform="uppercase"
            lineHeight="shorter"
          >
            INNOWAVE TEAM REGISTRATION
          </chakra.h1>

          <chakra.p
            fontFamily="'Oxanium', sans-serif"
            fontSize={{ base: "xs", sm: "sm" }}
            color="gray.400"
            letterSpacing="0.15em"
            textTransform="uppercase"
            mt={1}
          >
            OFFICIAL TEAM FORMATION &bull; 2 TO 4 MEMBERS &bull; PERMANENT LOCK
          </chakra.p>
        </Box>

        {/* Post-Registration Status Banner (if team registered) */}
        {registeredTeam && (
          <Box
            mb={6}
            p={4}
            bg="rgba(56, 217, 169, 0.12)"
            border="1px solid rgba(56, 217, 169, 0.5)"
            borderRadius="md"
            boxShadow="0 0 25px rgba(56, 217, 169, 0.2)"
          >
            <Flex direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "center" }} justify="space-between" gap={3}>
              <Flex align="center" gap={3} minW={0} maxW="100%">
                <CheckCircleIcon color="#38D9A9" w={5} h={5} flexShrink={0} />
                <Box minW={0}>
                  <Text fontFamily="'Oxanium', sans-serif" fontSize="sm" color="#FFFFFF" fontWeight="bold" wordBreak="break-word">
                    Team Roster Confirmed: <chakra.span color="#38D9A9">{registeredTeam.team_name}</chakra.span>
                  </Text>
                  <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="gray.300">
                    Your team details are locked and permanently recorded. You can now submit your idea deck.
                  </Text>
                </Box>
              </Flex>

              <NextLink href="/innowave" passHref>
                <Button
                  as="a"
                  size="sm"
                  w={{ base: "full", sm: "auto" }}
                  h="auto"
                  minH="36px"
                  py={{ base: 2, sm: 2 }}
                  px={{ base: 3, sm: 4 }}
                  bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                  color="#030512"
                  fontFamily="'Oxanium', sans-serif"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  boxShadow="0 0 15px rgba(56, 217, 169, 0.35)"
                  _hover={{
                    bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                  }}
                  whiteSpace="normal"
                  textAlign="center"
                  wordBreak="break-word"
                  rightIcon={<ArrowForwardIcon flexShrink={0} />}
                >
                  Proceed to Idea Deck Submission →
                </Button>
              </NextLink>
            </Flex>
          </Box>
        )}

        {/* If InnoWave Team Registration status is false, show SubmissionClosedNotice */}
        {!teamRegistrationActive ? (
          <Box mt={4}>
            <SubmissionClosedNotice eventName="InnoWave Team Registration" />
          </Box>
        ) : (
          /* The InnoWave Team Registration Component */
          <Box>
            <InnoWaveTeamRegistration
              onTeamLoaded={(team) => {
                setRegisteredTeam(team);
              }}
              onTeamRegistered={(team) => {
                setRegisteredTeam(team);
              }}
            />
          </Box>
        )}
      </Box>
    </Layout>
  ) : (
    <ContentLoader text="VERIFYING INNOWAVE REGISTRATION STATUS..." />
  );
};

export default privateUserRoute(InnoWaveTeamPage, "innowave");
