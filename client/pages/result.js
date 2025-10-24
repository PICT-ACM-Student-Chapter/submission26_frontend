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
import { getResults } from "../action/entries.js";
import privateAdminRoute from "../routers/privateAdminRoute";

const submissionEvents = [
  { name: "Insight", route: "insight" },
  { name: "Web N App", route: "webapp" },
  { name: "Freeze", route: "freeze" },
  { name: "Innowave 1", route: "innowave" },
  { name: "Innowave 2", route: "innowave2" },
  { name: "Paper Presentation", route: "paper" },
  { name: "Dataquest 1", route: "dataquest" },
  { name: "Dataquest 2", route: "dataquest2" },
];

const Result = () => {
  const toast = useToast();

  const bgCard = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");
  const primaryHover = useColorModeValue("primary.300", "primary.300");

  const handleSubmit = async (event) => {
    try {
      const res = await getResults(event.route); // Fetch results
      if (!res || res.length === 0) {
        toast({
          title: "No Data",
          description: `No results found for ${event.name}.`,
          status: "info",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      const csvData = convertToCSV(res); // Convert to CSV format
      downloadCSV(csvData, `${event.name}.csv`); // Trigger CSV download
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to get result.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const convertToCSV = (data) => {
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
    <Flex justify="center" maxH="100vh"  bg={useColorModeValue("background.100", "background.100")}>
      <Box
        w="full"
        maxW="1000px"
        p={8}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="xl"
        bg={bgCard}
      >
        <chakra.h1
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          textAlign="center"
          color={textColor}
          mb={4}
        >
          Event Results
        </chakra.h1>
        <Divider borderColor={primaryColor} mb={6} />

        <VStack spacing={6} align="stretch">
          <Table variant="simple" colorScheme="primary" size="md">
            <Thead>
              <Tr>
                <Th color={textColor}>Event Name</Th>
                <Th color={textColor}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {submissionEvents.map((event) => (
                <Tr key={event.name} _hover={{ bg: useColorModeValue("muted.100", "muted.200") }}>
                  <Td color={textColor} fontWeight="medium">
                    {event.name}
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: primaryHover }}
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
  );
};

export default privateAdminRoute(Result);

