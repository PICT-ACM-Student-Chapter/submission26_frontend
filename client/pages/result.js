// import {
//   Box,
//   Button,
//   Divider,
//   Text,
//   VStack,
//   Table,
//   Thead,
//   Tr,
//   Th,
//   Td,
//   Tbody,   
//   useToast
// } from "@chakra-ui/react";
// import { getResults } from "../action/entries.js";

// const submissionEvents = [
//   {
//     name: "insight",
//     route: "insight"
//   },
//   {
//     name: "web N app",
//     route: "webapp"
//   },
//   {
//     name: "freeze",
//     route: "freeze"
//   },
//   {
//     name: "innowave1",
//     route: "innowave"
//   },
//   {
//     name: "innowave2",
//     route: "innowave2"
//   },
//   {
//     name: "paper presentation",
//     route: "paper"
//   },
//   {
//     name: "Dataquest1",
//     route: "dataquest"
//   },
//   {
//     name: "Dataquest2",
//     route: "dataquest2"
//   }
// ];

// const result = () => {
//   const toast = useToast();

//   const handleSubmit = async (event) => {
//     try {
//       const res = await getResults(event.route);  // Fetch results
//       console.log(res);
//       const csvData = convertToCSV(res);          // Convert to CSV format
//       downloadCSV(csvData, `${event.name}.csv`);  // Trigger CSV download
//     } catch (err) {
//       console.log(err);
//       toast({
//         title: 'Error',
//         description: 'Failed to get result.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   const convertToCSV = (data) => {
//     const headers = Object.keys(data[0]).join(",");  
//     const rows = data.map(row => Object.values(row).join(","));  
//     return [headers, ...rows].join("\n");  
//   };

//   const downloadCSV = (csvData, filename) => {
//     const blob = new Blob([csvData], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.setAttribute("hidden", "");
//     a.setAttribute("href", url);
//     a.setAttribute("download", filename);
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <Box
//       w="100%"
//       maxWidth="800px"
//       p={8}
//       borderWidth="1px"
//       borderRadius="lg"
//       boxShadow="lg"
//       bg="white"
//       m={"auto"}
//     >
//       <Text fontSize="3xl" mb={6} fontWeight="bold" textAlign="center" color="teal.600">
//         Result
//       </Text>
//       <Divider mb={6} />

//       <VStack spacing={8} align="stretch">
//         <Table variant="striped" colorScheme="teal">
//           <Thead>
//             <Tr>
//               <Th>Event Name</Th>
//               <Th>Result</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {submissionEvents.map((event) => (
//               <Tr key={event.name}>
//                 <Td>{event.name}</Td>
//                 <Td>
//                   <Button
//                     colorScheme="teal"
//                     onClick={() => handleSubmit(event)}
//                     loadingText="Saving"
//                   >
//                     getCSV
//                   </Button>
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </VStack>
//     </Box>
//   );
// };

// export default result;


// import {
//   Box,
//   Button,
//   Divider,
//   Text,
//   VStack,
//   Table,
//   Thead,
//   Tr,
//   Th,
//   Td,
//   Tbody,
//   useToast,
//   useColorModeValue,
//   Flex,
//   chakra,
// } from "@chakra-ui/react";
// import { getResults } from "../action/entries.js";
// import privateAdminRoute from "../routers/privateAdminRoute";

// const submissionEvents = [
//   { name: "Insight", route: "insight" },
//   { name: "Web N App", route: "webapp" },
//   { name: "Freeze", route: "freeze" },
//   { name: "Innowave 1", route: "innowave" },
//   { name: "Innowave 2", route: "innowave2" },
//   { name: "Paper Presentation", route: "paper" },
//   { name: "Dataquest 1", route: "dataquest" },
//   { name: "Dataquest 2", route: "dataquest2" },
// ];

// const Result = () => {
//   const toast = useToast();

//   const bgCard = useColorModeValue("background.200", "background.200");
//   const textColor = useColorModeValue("foreground.100", "foreground.100");
//   const primaryColor = useColorModeValue("primary.400", "primary.400");
//   const primaryHover = useColorModeValue("primary.300", "primary.300");

//   const handleSubmit = async (event) => {
//     try {
//       const res = await getResults(event.route); // Fetch results
//       if (!res || res.length === 0) {
//         toast({
//           title: "No Data",
//           description: `No results found for ${event.name}.`,
//           status: "info",
//           duration: 4000,
//           isClosable: true,
//         });
//         return;
//       }
//       const csvData = convertToCSV(res); // Convert to CSV format
//       downloadCSV(csvData, `${event.name}.csv`); // Trigger CSV download
//     } catch (err) {
//       console.log(err);
//       toast({
//         title: "Error",
//         description: "Failed to get result.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   const convertToCSV = (data) => {
//     const headers = Object.keys(data[0]).join(",");
//     const rows = data.map((row) => Object.values(row).join(","));
//     return [headers, ...rows].join("\n");
//   };

//   const downloadCSV = (csvData, filename) => {
//     const blob = new Blob([csvData], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.setAttribute("hidden", "");
//     a.setAttribute("href", url);
//     a.setAttribute("download", filename);
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <Flex justify="center" maxH="100vh"  bg={useColorModeValue("background.100", "background.100")}>
//       <Box
//         w="full"
//         maxW="1000px"
//         p={8}
//         borderWidth="1px"
//         borderRadius="md"
//         boxShadow="xl"
//         bg={bgCard}
//       >
//         <chakra.h1
//           fontSize={{ base: "3xl", md: "4xl" }}
//           fontWeight="bold"
//           textAlign="center"
//           color={textColor}
//           mb={4}
//         >
//           Event Results
//         </chakra.h1>
//         <Divider borderColor={primaryColor} mb={6} />

//         <VStack spacing={6} align="stretch">
//           <Table variant="simple" colorScheme="primary" size="md">
//             <Thead>
//               <Tr>
//                 <Th color={textColor}>Event Name</Th>
//                 <Th color={textColor}>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {submissionEvents.map((event) => (
//                 <Tr key={event.name} _hover={{ bg: useColorModeValue("muted.100", "muted.200") }}>
//                   <Td color={textColor} fontWeight="medium">
//                     {event.name}
//                   </Td>
//                   <Td>
//                     <Button
//                       size="sm"
//                       bg={primaryColor}
//                       color="white"
//                       _hover={{ bg: primaryHover }}
//                       onClick={() => handleSubmit(event)}
//                     >
//                       Download CSV
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default privateAdminRoute(Result);

import {
  Box,
  Button,
  Divider,
  Text,
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useToast,
  useColorModeValue,
  Flex,
  chakra,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { getResults } from "../action/entries.js";
import privateAdminRoute from "../routers/privateAdminRoute";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const submissionEvents = [
  { name: "Freeze The Second", route: "freeze" },
  { name: "Innowave", route: "innowave" },
  { name: "HackNova - Project Deliverables", route: "hacknova" },
  { name: "HackNova - Squad Registrations", route: "hacknova-teams" },
  { name: "Root Cause", route: "rootcause" },
];

const Result = () => {
  const toast = useToast();
  const [downloading, setDownloading] = useState({});

  const bgCard = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");
  const primaryHover = useColorModeValue("primary.300", "primary.300");

  const handleSubmit = async (event) => {
    try {
      setDownloading((prev) => ({ ...prev, [event.route]: true }));
      const res = await getResults(event.route);
    console.log('API Response:', res); // Debug log
    
    // Check if response contains error
    if (res && res.error) {
      toast({
        title: "Error",
        description: res.error || `Failed to get results for ${event.name}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // Extract the submissions array from the response
    const data = res?.submissions || res;
    
    // Check if we have valid array data
    if (!data || !Array.isArray(data) || data.length === 0) {
      toast({
        title: "No Data",
        description: `No results found for ${event.name}.`,
        status: "info",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    
    const csvData = convertToCSV(data);
    downloadCSV(csvData, `${event.name}.csv`);
    
    toast({
      title: "Success",
      description: `CSV downloaded for ${event.name} with ${data.length} records.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to get result.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDownloading((prev) => ({ ...prev, [event.route]: false }));
    }
  };
 
  const convertToCSV = (data) => {
  // Add null/undefined check and ensure it's an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('Invalid data for CSV conversion:', data);
    return '';
  }
  
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  return [headers, ...rows].join("\n");
};

  
  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout>
      <Flex
        justify="center"
        w="100%"
        py={{ base: 6, md: 10 }}
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <Box
          w="full"
          maxW="1000px"
          p={{ base: 6, md: 8 }}
          position="relative"
          border="1px solid rgba(56, 217, 169, 0.4)"
          borderRadius="none"
          boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
          bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)"
          backdropFilter="blur(16px)"
          overflow="hidden"
        >
          {/* 4 Corner HUD Brackets */}
          <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          {/* Back link */}
          <NextLink href="/admin">
            <chakra.h3
              fontFamily="'Oxanium', sans-serif"
              fontWeight="bold"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="#38D9A9"
              cursor="pointer"
              display="inline-flex"
              alignItems="center"
              gap={1}
              mb={4}
              _hover={{ color: "#22D3EE", transform: "translateX(-3px)" }}
              transition="all 0.2s"
            >
              <ChevronLeftIcon w={5} h={5} /> <span>Back to Admin Panel</span>
            </chakra.h3>
          </NextLink>

          <chakra.h1
            fontFamily="'United Colony', sans-serif !important"
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="bold"
            textAlign="center"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
            mb={2}
          >
            EVENT <chakra.span color="#38D9A9" textShadow="0 0 15px rgba(56, 217, 169, 0.5)">RESULTS</chakra.span>
          </chakra.h1>

          <Text
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            color="gray.400"
            letterSpacing="0.2em"
            textTransform="uppercase"
            textAlign="center"
            mb={6}
          >
            DOWNLOAD MISSION SUBMISSIONS DATA
          </Text>

          <Divider borderColor="rgba(56, 217, 169, 0.3)" mb={6} />

          <VStack spacing={6} align="stretch" fontFamily="'Oxanium', sans-serif">
            <Table variant="simple" size="md">
              <Thead bg="rgba(56, 217, 169, 0.1)">
                <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
                  <Th
                    fontFamily="'United Colony', sans-serif !important"
                    color="#38D9A9"
                    fontSize="sm"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    py={3}
                  >
                    Event Name
                  </Th>
                  <Th
                    fontFamily="'United Colony', sans-serif !important"
                    color="#38D9A9"
                    fontSize="sm"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    textAlign="right"
                    py={3}
                  >
                    Action
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {submissionEvents.map((event) => (
                  <Tr
                    key={event.name}
                    borderBottom="1px solid rgba(255, 255, 255, 0.08)"
                    _hover={{ bg: "rgba(56, 217, 169, 0.08)" }}
                  >
                    <Td color="#FFFFFF" fontWeight="semibold" fontSize="sm">
                      {event.name}
                    </Td>
                    <Td textAlign="right">
                      <Button
                        size="sm"
                        bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                        color="#030512"
                        fontFamily="'Oxanium', sans-serif"
                        fontSize="xs"
                        fontWeight="bold"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        rounded="md"
                        boxShadow="0 0 10px rgba(56, 217, 169, 0.25)"
                        _hover={{
                          bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                          boxShadow: "0 0 20px rgba(56, 217, 169, 0.45)",
                        }}
                        isLoading={Boolean(downloading[event.route])}
                        loadingText="Fetching..."
                        onClick={() => handleSubmit(event)}
                      >
                        Download CSV
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </Box>
      </Flex>
    </Layout>
  );
};

export default privateAdminRoute(Result);
