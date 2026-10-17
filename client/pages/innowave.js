// import { Box, Button, chakra, Flex, Grid, GridItem, Link, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
// import React, { useEffect, useState } from 'react';
// import Layout from '../components/Layout';
// import privateUserRoute from '../routers/privateUserRoute';
// import { Formik } from "formik";
// import { toast } from 'react-toastify';
// import FileInput from '../components/FileInput';
// import NextLink from 'next/link';
// import { uploadFile } from '../action/uploadFile';
// import ButtonWithModal from '../components/ButtonWithModal';
// import { getEntries, submitEntries } from '../action/entries';
// import ContentLoader from '../components/ContentLoader';
// import { ChevronLeftIcon } from '@chakra-ui/icons';
// import SelectField from '../components/SelectField';
// import FormField from '../components/FormField';


// const Inowave1 = () => {
//   const textColor = useColorModeValue("white", "white");
//   const [submission, setSubmission] = useState()
//   const [loading, setLoading] = useState(true);
//   const handleSubmit = async (values) => {
   
//         if (!values?.ppt?.name) {
//           toast.error('Please Select a file')
//           return;
//         }
//         if (values?.ppt?.size > 5000000) {
//           toast.error('File Size Exceeded');
//           return;
//         }

//         try {
//           setLoading(true);
//           const data = await uploadFile(values.ppt)
//           console.log(data);
//           if (data?.error) {
//             toast.error('Someting Went Wrong')
//             setLoading(false);
//             return
//           }
//           const entryData = await submitEntries({
//             submission:data.submission
//           }, 'innowave');
    
//           if (entryData?.error) {
//             toast.error(entryData?.error);
//             setLoading(false);
//             return;
//           }
//           setSubmission(entryData.submission);
//           toast.success('Entry Submitted Successfully');
//         } catch (e) {
//           console.log(e)
//           toast.error('Someting Went Wrong')
//         }
//         setLoading(false);
//       }
    
//   useEffect(() => {
//     const fetchSubmission = async () => {
//       try {
//         const entryData = await getEntries('innowave');
//         if (entryData?.error) {
//           console.log(entryData?.error);
//         }
//         setSubmission(entryData?.submission);
//       } catch (e) {
//         console.log(e);
//       }
//       setLoading(false);
//     }
//     fetchSubmission();
//   }, [setSubmission])
//   const [tabIndex, setTabIndex] = useState(0)
//   return !loading ? (
//     <Layout>
//       <Box
//         pt={10}
//         width={"full"}
//         pb={"20px"}
//         px={{
//           base: '16px',
//           md: '48px',
//           lg: '64px'
//         }}
//       >
//         <NextLink href='/dashboard'>
//           <chakra.h3
//             fontWeight={"bold"}
//             fontSize={24}
//             textTransform={"uppercase"}
//             color={"#5FAB63"}
//             cursor="pointer"
//             display={"flex"}
//             alignItems={"center"}
//           >
//             <ChevronLeftIcon w={6} h={6}/> <span>Back to all events</span>
//           </chakra.h3>
//         </NextLink>
//         <chakra.h1
//           py={5} fontSize={40} fontWeight={"bold"} color={textColor}
//         >
//           Inowave
//         </chakra.h1>
//         <SimpleGrid
//           columns={{ base: 1, md: 2 }}
//           gap={10}
//         >
//           <GridItem
//           >
//             <Tabs onChange={(index) => setTabIndex(index)}>
//               <TabList color={"white"}>
//                 <Tab fontSize={20}>
//                   Topics
//                 </Tab>
//                 <Tab fontSize={20}>Instructions</Tab>
//               </TabList>
//               <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
//                 <TabPanel>
//                   <Stack spacing={3}>
//                     <Text fontSize='3xl'>
//                       Topics
//                     </Text>
//                     <Text fontSize='xl'>
//                       - Application for an NGO to display its work + accept donations
//                     </Text>
//                     <Text fontSize='xl'>
//                       - Travelogue Application
//                     </Text>
//                     <Text fontSize='xl'>
//                       - Application for Health and Fitness
//                     </Text>
//                     <Text fontSize='xl'>
//                       - Website/App for selling sports goods
//                     </Text>
//                     <Text fontSize='xl'>
//                       - Smart hiring platform for recruiters
//                     </Text>
//                   </Stack>
//                 </TabPanel>
//                 <TabPanel>
//                   <Stack spacing={3}>
//                     <Text fontSize='3xl'>
//                       Instructions
//                     </Text>
//                     <Text fontSize='xl'>
//                       1. All team members must be from the same organization or institute, but they can be from different academic years.
//                     </Text>
//                     <Text fontSize='xl'>
//                       2. Interdisciplinary teams can participate.
//                     </Text>
//                     <Text fontSize='xl'>
//                       3. Modification of team post registration will not be allowed.
//                     </Text>
//                     <Text fontSize='xl'>
//                       4. All the team members must be present during the final presentation; otherwise, their entry will be disqualified.
//                     </Text>
//                     <Text fontSize='xl'>
//                       5. Any unfair means will lead to immediate disqualification.
//                     </Text>
//                     <Text fontSize='xl'>
//                       6. The decision of the judges will be considered final and binding on all the participants.
//                     </Text>
//                   </Stack>
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
//           </GridItem>
//           {
//             submission?.id ?
//               (
//                 <GridItem>
//                   <Flex
//                     minH={"200px"}
//                     border={'2px solid primaries.100'}
//                     alignItems={"center"}
//                     justifyContent={"center"}
//                     flexDirection={'column'}
//                     gap={5}
//                   >
//                     <Text fontSize={'2xl'} textAlign={"center"} color={textColor}>You have already submitted your entry</Text>
//                     <Link
//                       href={submission.submission}
//                       bg={"#203449"}
//                       px={4}
//                       py={1}
//                       color={"white"}
//                       _hover={{
//                         bg: "#88B788",
//                       }}
//                       borderRadius={'md'}
//                       fontSize={20}
//                     >
//                       Download ppt
//                     </Link>
                    
//                   </Flex>
//                 </GridItem>
//               ) : (
//                 <GridItem>
//                   <Formik
//                     initialValues={{ ppt: {}}}
//                     onSubmit={handleSubmit}
//                   >
//                     {({ handleBlur, handleChange, values, handleSubmit }) => (
//                       <form onSubmit={handleSubmit}>
//                         <Stack
//                           spacing={8}
//                         >
                        
                      
//                          <FileInput
//                               accept={'.ppt,.pptx'}
//                               label='Upload Your PPT ( .ppt, .pptx upto 5mb )'
//                               name='ppt'
//                               onBlur={handleBlur}
//                               bg={"rgba(165, 151, 39, 0.7)"}
//                             />
                        
//                           <ButtonWithModal
//                             handleSubmit={() => handleSubmit(values)}
//                           />
//                         </Stack>
//                       </form>
//                     )}
//                   </Formik>
//                 </GridItem>
//               )
//           }
//         </SimpleGrid>
//       </Box>
//     </Layout>
//   ) : (
//     <ContentLoader />
//   )
// }

// export default privateUserRoute(Inowave1)


import {
  Box,
  Button,
  chakra,
  Flex,
  GridItem,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Link,
  useTheme,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import privateUserRoute from "../routers/privateUserRoute";
import { Formik } from "formik";
import { toast } from "react-toastify";
import FileInput from "../components/FileInput";
import ButtonWithModal from "../components/ButtonWithModal";
import { getEntries, submitEntries } from "../action/entries";
import { uploadFile } from "../action/uploadFile";
import ContentLoader from "../components/ContentLoader";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const Inowave1 = () => {
  const theme = useTheme();
  const textColor = theme.colors.foreground[100];
  const bgCard = theme.colors.background[200];
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];
  const borderColor = theme.colors.border[100];

  const [submission, setSubmission] = useState();
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const handleSubmit = async (values) => {
    if (!values?.ppt?.name) {
      toast.error("Please Select a file");
      return;
    }
    if (values?.ppt?.size > 5000000) {
      toast.error("File Size Exceeded");
      return;
    }

    try {
      setLoading(true);
      const data = await uploadFile(values.ppt);
      if (data?.error) {
        toast.error("Something Went Wrong");
        setLoading(false);
        return;
      }
      const entryData = await submitEntries({ submission: data.submission }, "innowave");
      if (entryData?.error) {
        toast.error(entryData?.error);
        setLoading(false);
        return;
      }
      setSubmission(entryData.submission);
      toast.success("Entry Submitted Successfully");
    } catch (e) {
      console.log(e);
      toast.error("Something Went Wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries("innowave");
        setSubmission(entryData?.submission);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchSubmission();
  }, [setSubmission]);

  return !loading ? (
    <Layout>
      <Box pt={10} width="full" pb="20px" px={{ base: "16px", md: "48px", lg: "64px" }}>
        <chakra.h3
          as="a"
          href="/dashboard"
          fontWeight="bold"
          fontSize={24}
          textTransform="uppercase"
          color={primaryColor}
          cursor="pointer"
          display="flex"
          alignItems="center"
        >
          <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
        </chakra.h3>

        <chakra.h1
          py={5}
          fontSize={40}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}
        >
          Innowave
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
          {/* Left side: Tabs */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>Topics</Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={bgCard}>
                <TabPanel color = "hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="3xl">Event Tracks</Text>
                    <Text fontSize="xl">- Open Innovation (General Track)</Text>
                    <Text fontSize="xl">- Climate Change Mitigation & Sustainability</Text>
                    <Text fontSize="xl">- Healthcare & Wellbeing</Text>
                    <Text fontSize="xl">- Trust in the Age of AI</Text>
                  </Stack>
                </TabPanel>
                <TabPanel color = "hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="3xl">Instructions</Text>
                    <Text fontSize="xl">
                      1. All team members must be from the same organization or institute, but they can be from different academic years.
                    </Text>
                    <Text fontSize="xl">2. Interdisciplinary teams can participate.</Text>
                    <Text fontSize="xl">3. Modification of team post registration will not be allowed.</Text>
                    <Text fontSize="xl">
                      4. All the team members must be present during the final presentation; otherwise, their entry will be disqualified.
                    </Text>
                    <Text fontSize="xl">5. Any unfair means will lead to immediate disqualification.</Text>
                    <Text fontSize="xl">6. The decision of the judges will be considered final and binding on all the participants.</Text>
                    <Text fontSize="xl">7. ⁠Each team must pick a single track to present their idea in.</Text>
                    <Text fontSize="xl">8. only team leader must register for the team.</Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right side: Submission */}
          {submission?.id ? (
            <GridItem>
              <Flex
                minH="200px"
                border={`2px solid ${primaryColor}`}
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap={5}
                bg={bgCard}
                rounded="md"
              >
                <Text fontSize="2xl" textAlign="center" color={textColor}>
                  You have already submitted your entry
                </Text>
                <Link
                  href={submission.submission}
                  bg={primaryColor}
                  px={4}
                  py={1}
                  color={theme.colors.background[100]}
                  _hover={{
                    bg: primaryGlow,
                    boxShadow: `0 0 12px ${primaryGlow}`,
                  }}
                  borderRadius="md"
                  fontSize={20}
                >
                  Download PPT
                </Link>
              </Flex>
            </GridItem>
          ) : (
            <GridItem>
              <Formik initialValues={{ ppt: {} }} onSubmit={handleSubmit}>
                {({ handleBlur, handleChange, values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={8}>
                      <FileInput
                        accept=".ppt,.pptx"
                        label="Upload Your PPT ( .ppt, .pptx upto 5mb )"
                        name="ppt"
                        onBlur={handleBlur}
                        bg={bgCard}
                        color={textColor}
                      />
                      <ButtonWithModal
                        handleSubmit={() => handleSubmit(values)}
                        bg={primaryColor}
                        hoverBg={primaryGlow}
                        textColor={theme.colors.background[100]}
                      />
                    </Stack>
                  </form>
                )}
              </Formik>
            </GridItem>
          )}
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  );
};

export default privateUserRoute(Inowave1);
