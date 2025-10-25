// import { ArrowRightIcon } from "@chakra-ui/icons";
// import {
//   Box,
//   Flex,
//   SimpleGrid,
//   Text,
//   chakra,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { useContext } from "react";
// import EventCard from "../components/EventCard";
// import Layout from "../components/Layout";
// import AppContext from "../context/AppContext";
// import { masterEvents } from "../model/masterEvents";
// import privateUserRoute from "../routers/privateUserRoute";

// const Dashboard = () => {
//   const { contEvents } = useContext(AppContext);

//   const bg = useColorModeValue("background.100", "background.100");
//   const cardBg = useColorModeValue("background.200", "background.200");
//   const textColor = useColorModeValue("foreground.100", "foreground.100");
//   const primaryColor = useColorModeValue("primary.400", "primary.400");

//   return (
//     <Layout>
//       <Flex
//         textAlign="center"
//         pt={6}
//         justifyContent="center"
//         direction="column"
//         width="full"
//         pb={4}
//         bg={bg}
//       >
//         <Box width={{ base: "full", sm: "lg", lg: "xl" }} margin="auto">
//           <chakra.h1
//             py={2}
//             fontSize={{ base: 28, md: 32 }}
//             fontWeight="bold"
//             color={textColor}
//           >
//             Registered Events
//           </chakra.h1>

//           {contEvents && contEvents.length === 0 && (
//             <Text
//               fontSize={{ base: "2xl", md: "4xl" }}
//               color={textColor}
//               mt={10}
//             >
//               You haven&lsquo;t registered for any event
//             </Text>
//           )}
//         </Box>

//         <SimpleGrid
//           columns={{ base: 1, md: 2, xl: 3 }}
//           spacing={8}
//           mt={8}
//           px={{ base: "16px", md: "48px", lg: "64px" }}
//         >
//           {contEvents.map((event) => {
//             const eve = masterEvents.find(
//               (eve) => eve.ems_id === event.ems_id
//             );

//             return (
//               <EventCard
//                 key={event?.event_id || event?.id}
//                 id={event?.event_id || event?.id}
//                 event={event?.event_name || event?.name}
//                 page={event?.event_route || event?.page}
//                 status={event.event_status}
//                 bg={cardBg}
//                 textColor={textColor}
//                 primaryColor={primaryColor}
//               />
//             );
//           })}
//         </SimpleGrid>
//       </Flex>
//     </Layout>
//   );
// };

// export default privateUserRoute(Dashboard);

import { ArrowRightIcon } from "@chakra-ui/icons";
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
import { masterEvents } from "../model/masterEvents";
import privateUserRoute from "../routers/privateUserRoute";

const Dashboard = () => {
  const { contEvents } = useContext(AppContext);

  const bg = useColorModeValue("background.100", "background.100");
  const cardBg = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");

  // Safe handling of contEvents - ensure it's always an array
  const safeContEvents = Array.isArray(contEvents) ? contEvents : [];

  // console.log('contEvents:', contEvents);
  // console.log('safeContEvents:', safeContEvents);

  return (
    <Layout>
      <Flex
        textAlign="center"
        pt={6}
        justifyContent="center"
        direction="column"
        width="full"
        pb={4}
        bg={bg}
      >
        <Box width={{ base: "full", sm: "lg", lg: "xl" }} margin="auto">
          <chakra.h1
            py={2}
            fontSize={{ base: 28, md: 32 }}
            fontWeight="bold"
            color={textColor}
          >
            Registered Events
          </chakra.h1>

          {safeContEvents.length === 0 && (
            <Text
              fontSize={{ base: "2xl", md: "4xl" }}
              color={textColor}
              mt={10}
            >
              You haven&lsquo;t registered for any event
            </Text>
          )}
        </Box>

        {safeContEvents.length > 0 && (
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={8}
            mt={8}
            px={{ base: "16px", md: "48px", lg: "64px" }}
          >
            {safeContEvents.map((event) => {
              // Safe event data extraction with fallbacks
              const eventId = event?.event_id || event?.id;
              const eventName = event?.event_name || event?.name || 'Unnamed Event';
              const eventPage = event?.event_route || event?.page || '#';
              const eventStatus = event?.event_status || 'unknown';

              // Only render if we have a valid event ID
              if (!eventId) {
                console.warn('Event missing ID:', event);
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