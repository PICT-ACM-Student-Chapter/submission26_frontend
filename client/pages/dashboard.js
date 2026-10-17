import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import EventCard from "../components/EventCard";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import privateUserRoute from "../routers/privateUserRoute";

const Dashboard = () => {
  const { contEvents } = useContext(AppContext);

  const cardBg = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");

  const safeContEvents = Array.isArray(contEvents) ? contEvents : [];

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
            fontFamily="'Oxanium', sans-serif"
            boxShadow="0 0 15px rgba(56, 217, 169, 0.2)"
          >
            <Box w="6px" h="6px" rounded="full" bg="#38D9A9" boxShadow="0 0 8px #38D9A9" />
            MISSION CONTROL
          </Box>

          {/* Heading with United Colony Font */}
          <Flex align="center" justify="center" gap={{ base: 2, sm: 4 }} w="full">
            <Box
              h="2px"
              w={{ base: "30px", sm: "60px", md: "100px" }}
              bgGradient="linear(to-l, rgba(56, 217, 169, 0.8), transparent)"
            />
            <chakra.h1
              fontFamily="'United Colony', sans-serif !important"
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

          {/* Subtitle with Oxanium Font */}
          <chakra.p
            fontFamily="'Oxanium', sans-serif"
            fontSize={{ base: "xs", sm: "sm" }}
            color="gray.400"
            letterSpacing="0.25em"
            textTransform="uppercase"
          >
            SELECT YOUR MISSION &bull; COMPETE &bull; SUBMIT
          </chakra.p>
        </Flex>

        {safeContEvents.length === 0 && (
          <Box textAlign="center" py={12}>
            <Text
              fontFamily="'Oxanium', sans-serif"
              fontSize={{ base: "lg", md: "2xl" }}
              color="gray.400"
              letterSpacing="0.1em"
              mt={6}
            >
              You haven&lsquo;t registered for any event
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