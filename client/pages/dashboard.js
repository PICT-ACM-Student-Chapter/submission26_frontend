import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Badge,
  Button,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import NextLink from "next/link";
import EventCard from "../components/EventCard";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import privateUserRoute from "../routers/privateUserRoute";
import { getHackNovaSquadRegistrationStatus } from "../action/hacknovaTeam";
import { getInnoWaveTeamRegistrationStatus } from "../action/innowaveTeam";

const Dashboard = () => {
  const { contEvents } = useContext(AppContext);
  const [squadRegistrationActive, setSquadRegistrationActive] = useState(false);
  const [innoWaveTeamRegistrationActive, setInnoWaveTeamRegistrationActive] = useState(false);

  const cardBg = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");

  const safeContEvents = Array.isArray(contEvents) ? contEvents : [];

  // Check if user is registered for HackNova (Event ID 20 in Pulzion EMS)
  const hacknovaEvent = safeContEvents.find((event) => {
    const eventId = Number(event?.event_id || event?.id);
    const eventName = String(event?.event_name || event?.name || "").toLowerCase();
    const eventRoute = String(event?.event_route || event?.page || "").toLowerCase();
    return eventId === 20 || eventName.includes("hacknova") || eventRoute.includes("hacknova");
  });

  // Check if user is registered for InnoWave (Event ID 12 in Pulzion EMS)
  const innowaveEvent = safeContEvents.find((event) => {
    const eventId = Number(event?.event_id || event?.id);
    const eventName = String(event?.event_name || event?.name || "").toLowerCase();
    const eventRoute = String(event?.event_route || event?.page || "").toLowerCase();
    return eventId === 12 || eventName.includes("innowave") || eventRoute.includes("innowave");
  });

  // Check live status for HackNova Squad Registrations (Event ID 200, table hacknova_teams, route /hacknova-team)
  // and InnoWave Team Registrations (Event ID 201, table innowave_teams, route /innowave-team)
  useEffect(() => {
    let isMounted = true;
    const fetchStatuses = async () => {
      if (hacknovaEvent) {
        try {
          const res = await getHackNovaSquadRegistrationStatus();
          if (isMounted) {
            setSquadRegistrationActive(Boolean(res.status || res.is_active));
          }
        } catch (e) {
          console.error("Failed to fetch squad registration status:", e);
        }
      }
      if (innowaveEvent) {
        try {
          const res = await getInnoWaveTeamRegistrationStatus();
          if (isMounted) {
            setInnoWaveTeamRegistrationActive(Boolean(res.status || res.is_active));
          }
        } catch (e) {
          console.error("Failed to fetch InnoWave team registration status:", e);
        }
      }
    };
    fetchStatuses();
    return () => {
      isMounted = false;
    };
  }, [hacknovaEvent, innowaveEvent]);

  return (
    <Layout>
      <Flex
        pt={{ base: 6, md: 10 }}
        pb={20}
        direction="column"
        width="full"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        {/* Pulzion 26 Mission Control Header */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          pt={2}
          pb={{ base: 6, sm: 10 }}
          gap={3}
        >
          {/* Mission Badge */}
          <Box
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={4}
            py={1}
            rounded="full"
            border="1px solid rgba(56, 217, 169, 0.4)"
            bg="rgba(5, 11, 29, 0.8)"
            color="#38D9A9"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.2em"
            fontFamily="'Inter', sans-serif"
            boxShadow="0 0 15px rgba(56, 217, 169, 0.2)"
          >
            <Box w="6px" h="6px" rounded="full" bg="#38D9A9" boxShadow="0 0 8px #38D9A9" />
            MISSION CONTROL
          </Box>

          {/* Heading with Orbitron Font */}
          <Flex align="center" justify="center" gap={{ base: 2, sm: 4 }} w="full">
            <Box
              h="2px"
              w={{ base: "30px", sm: "60px", md: "100px" }}
              bgGradient="linear(to-l, rgba(56, 217, 169, 0.8), transparent)"
            />
            <chakra.h1
              fontFamily="'Orbitron', sans-serif !important"
              fontSize={{ base: "2xl", sm: "4xl", md: "5xl" }}
              fontWeight="black"
              color="#FFFFFF"
              letterSpacing="0.08em"
              textTransform="uppercase"
              lineHeight="tight"
              dropShadow="0 10px 35px rgba(11, 16, 33, 0.9)"
            >
              REGISTERED{" "}
              <chakra.span
                color="#38D9A9"
                textShadow="0 0 20px rgba(56, 217, 169, 0.5)"
              >
                EVENTS
              </chakra.span>
            </chakra.h1>
            <Box
              h="2px"
              w={{ base: "30px", sm: "60px", md: "100px" }}
              bgGradient="linear(to-r, rgba(56, 217, 169, 0.8), transparent)"
            />
          </Flex>

          {/* Subtitle with Inter Font */}
          <chakra.p
            fontFamily="'Inter', sans-serif"
            fontSize={{ base: "xs", sm: "sm" }}
            color="gray.400"
            letterSpacing="0.25em"
            textTransform="uppercase"
          >
            SELECT YOUR MISSION &bull; COMPETE &bull; SUBMIT
          </chakra.p>
        </Flex>

        {/* HackNova Team Form Notice Banner: Shown ONLY when HackNova is registered AND HackNova Squad Registrations (Event ID 200, /hacknova-team) is active */}
        {hacknovaEvent && squadRegistrationActive && (
          <Box
            mb={8}
            p={{ base: 4, sm: 5 }}
            bg="linear-gradient(90deg, rgba(56, 217, 169, 0.15) 0%, rgba(34, 211, 238, 0.1) 100%)"
            border="1px solid rgba(56, 217, 169, 0.5)"
            borderRadius="md"
            boxShadow="0 0 25px rgba(56, 217, 169, 0.2)"
            position="relative"
            overflow="hidden"
          >
            {/* 4 Corner HUD Brackets */}
            <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
            <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
            <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
            <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              justify="space-between"
              gap={4}
            >
              <Box>
                <Flex align="center" gap={2} mb={1.5}>
                  <Badge
                    px={2.5}
                    py={0.5}
                    bg="rgba(56, 217, 169, 0.2)"
                    color="#38D9A9"
                    border="1px solid #38D9A9"
                    fontFamily="'Inter', sans-serif"
                    fontSize="xs"
                    letterSpacing="0.1em"
                  >
                    HACKNOVA SQUAD REGISTRATION ACTIVE
                  </Badge>
                </Flex>
                <chakra.h3
                  fontFamily="'Orbitron', sans-serif !important"
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontWeight="bold"
                  color="#FFFFFF"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                >
                  PLEASE FILL HACKNOVA TEAM FORM
                </chakra.h3>
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  color="gray.300"
                  mt={1}
                  maxW="2xl"
                >
                  You are registered for HackNova. Please assemble your squad (2–4 members) and fill the Team Registration Form before project submission.
                </Text>
              </Box>

              <NextLink href="/hacknova-team" passHref>
                <Button
                  as="a"
                  size="md"
                  bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                  color="#030512"
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  boxShadow="0 0 15px rgba(56, 217, 169, 0.35)"
                  _hover={{
                    bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                    boxShadow: "0 0 25px rgba(56, 217, 169, 0.55)",
                  }}
                  whiteSpace="nowrap"
                >
                  Fill Team Form →
                </Button>
              </NextLink>
            </Flex>
          </Box>
        )}

        {/* InnoWave Team Form Notice Banner: Shown ONLY when InnoWave is registered AND InnoWave Team Registration (Event ID 201, /innowave-team) is active */}
        {innowaveEvent && innoWaveTeamRegistrationActive && (
          <Box
            mb={8}
            p={{ base: 4, sm: 5 }}
            bg="linear-gradient(90deg, rgba(56, 217, 169, 0.15) 0%, rgba(34, 211, 238, 0.1) 100%)"
            border="1px solid rgba(56, 217, 169, 0.5)"
            borderRadius="md"
            boxShadow="0 0 25px rgba(56, 217, 169, 0.2)"
            position="relative"
            overflow="hidden"
          >
            {/* 4 Corner HUD Brackets */}
            <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
            <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
            <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
            <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              justify="space-between"
              gap={4}
            >
              <Box>
                <Flex align="center" gap={2} mb={1.5}>
                  <Badge
                    px={2.5}
                    py={0.5}
                    bg="rgba(56, 217, 169, 0.2)"
                    color="#38D9A9"
                    border="1px solid #38D9A9"
                    fontFamily="'Inter', sans-serif"
                    fontSize="xs"
                    letterSpacing="0.1em"
                  >
                    INNOWAVE TEAM REGISTRATION ACTIVE
                  </Badge>
                </Flex>
                <chakra.h3
                  fontFamily="'Orbitron', sans-serif !important"
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontWeight="bold"
                  color="#FFFFFF"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                >
                  PLEASE FILL INNOWAVE TEAM FORM
                </chakra.h3>
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  color="gray.300"
                  mt={1}
                  maxW="2xl"
                >
                  You are registered for InnoWave. Please assemble your team (2–4 members) and fill the Team Registration Form before idea deck submission.
                </Text>
              </Box>

              <NextLink href="/innowave-team" passHref>
                <Button
                  as="a"
                  size="md"
                  bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                  color="#030512"
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  boxShadow="0 0 15px rgba(56, 217, 169, 0.35)"
                  _hover={{
                    bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                    boxShadow: "0 0 25px rgba(56, 217, 169, 0.55)",
                  }}
                  whiteSpace="nowrap"
                >
                  Fill Team Form →
                </Button>
              </NextLink>
            </Flex>
          </Box>
        )}


        {safeContEvents.length === 0 && (
          <Box
            textAlign="center"
            py={16}
            px={4}
            maxW="420px"
            mx="auto"
          >
            <Flex
              align="center"
              justify="center"
              w="64px"
              h="64px"
              rounded="full"
              bg="rgba(56, 217, 169, 0.08)"
              border="1px solid rgba(56, 217, 169, 0.25)"
              color="#38D9A9"
              mx="auto"
              mb={5}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </Flex>
            <chakra.p
              fontFamily="'Orbitron', sans-serif !important"
              fontSize={{ base: "lg", md: "xl" }}
              color="#FFFFFF"
              letterSpacing="0.08em"
              textTransform="uppercase"
              mb={2}
            >
              No Events Registered
            </chakra.p>
            <Text
              fontFamily="'Inter', sans-serif"
              fontSize={{ base: "xs", sm: "sm" }}
              color="gray.400"
              letterSpacing="0.1em"
            >
              You haven&lsquo;t registered for any event yet. Visit Pulzion EMS to register for events.
            </Text>
          </Box>
        )}

        {safeContEvents.length > 0 && (
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={{ base: 4, sm: 6 }}
            w="full"
          >
            {safeContEvents.map((event) => {
              const eventId = event?.event_id || event?.id;
              const eventName = event?.event_name || event?.name || "Unnamed Event";
              const eventPage = event?.event_route || event?.page || "#";
              const eventStatus = event?.event_status;

              if (!eventId) {
                console.warn("Event missing ID:", event);
                return null;
              }

              return (
                <EventCard
                  key={eventId}
                  id={eventId}
                  event={eventName}
                  page={eventPage}
                  status={eventStatus}
                  squadRegistrationActive={squadRegistrationActive}
                  innoWaveTeamRegistrationActive={innoWaveTeamRegistrationActive}
                  bg={cardBg}
                  textColor={textColor}
                  primaryColor={primaryColor}
                />
              );
            })}
          </SimpleGrid>
        )}
      </Flex>
    </Layout>
  );
};

export default privateUserRoute(Dashboard);