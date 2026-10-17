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

// const Webapp = () => {
//   const textColor = useColorModeValue("white", "white");
//   const [submission, setSubmission] = useState()
//   const [loading, setLoading] = useState(true);
//   const handleSubmit = async (values) => {
//     console.log(values);
//     if (!values?.file?.name) {
//       toast.error('Please Select a file')
//       return;
//     }
//     console.log(values.file.size)
//     if (values.file.size > 5000000) {
//       toast.error('File Size Exceeded');
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await uploadFile(values.file)
//       if (data?.error) {
//         toast.error('Someting Went Wrong')
//         setLoading(false);
//         return
//       }
//       const entryData = await submitEntries(data, 'webapp');
//       if (entryData?.error) {
//         toast.error(entryData?.error);
//         setLoading(false);
//         return;
//       }
//       setSubmission(entryData.submission);
//       toast.success('Entry Submitted Successfully');
//     } catch (e) {
//       console.log(e)
//       toast.error('Someting Went Wrong')
//     }
//     setLoading(false);
//   }
//   useEffect(() => {
//     const fetchSubmission = async () => {
//       try {
//         const entryData = await getEntries('webapp');
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
//              fontWeight={"bold"}
//              fontSize={24}
//              textTransform={"uppercase"}
//              color={"#5FAB63"}
//              cursor="pointer"
//              display={"flex"}
//              alignItems={"center"}
//           >
//             <ChevronLeftIcon w={6} h={6}/> <span>Back to all events</span>
//           </chakra.h3>
//         </NextLink>
//         <chakra.h1
//          py={5} fontSize={40} fontWeight={"bold"} color={textColor}
//         >
//           Web N App
//         </chakra.h1>
//         <SimpleGrid
//           columns={{ base: 1, md: 2 }}
//           gap={10}
//         >
//           <GridItem
//           >
//             <Tabs onChange={(index) => setTabIndex(index)}>
//               <TabList color={textColor}>
//                 <Tab fontSize={20}>
//                   Topics
//                 </Tab>
//                 <Tab fontSize={20}>Instructions</Tab>
//               </TabList>
//               <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
//                 <TabPanel>
//                   <Stack spacing={3}>
//                     {/* <Text fontSize='3xl'>
//                       Topics
//                     </Text> */}
//                     {/* <Text fontSize='xl'>
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
//                     </Text> */}
//                   </Stack>
//                 </TabPanel>
//                 <TabPanel>
//                   <Stack spacing={3}>
//                     {/* <Text fontSize='3xl'>
//                       Instructions
//                     </Text> */}
//                     <Text fontSize='xl'>
//                       1. Each team can submit an entry for only one problem statement.
//                     </Text>
//                     <Text fontSize='xl'>
//                       2. Participants are expected to submit a PPT of the proposed solution and idea on the submission platform for round 1. Adding the link of the Figma prototype or GitHub repository in the PPT is optional but preferred.
//                     </Text>
//                     <Text fontSize='xl'>
//                       3. Use of web frameworks and any suitable tech stack is allowed, but the use of ready-made templates is prohibited.
//                     </Text>
//                     <Text fontSize='xl'>
//                       4. The decision of the organizers and judges will be final and binding on all participants.
//                     </Text>
//                     <Text fontSize='xl' textDecor={"underline"}>
//                       Team Distribution:
//                     </Text>
//                     <Text fontSize='xl'>
//                       1. FE-SE: Groups of a maximum of 3 participants.
//                     </Text>
//                     <Text fontSize='xl'>
//                       2. TE-BE: Groups of a maximum of 4 participants.
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
//                     minH={"100px"}
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
//                       Download
//                     </Link>
//                   </Flex>
//                 </GridItem>
//               ) : (
//                 <GridItem>
//                   <Formik
//                     initialValues={{ file: {} }}
//                     onSubmit={handleSubmit}
//                   >
//                     {({ handleBlur, handleChange, values, handleSubmit }) => (
//                       <form onSubmit={handleSubmit}>
//                         <Stack
//                           spacing={10}
                          
//                         >
//                           <FileInput
//                             accept={'.ppt,.pptx'}
//                             label='Upload Your PPT ( .ppt, .pptx upto 5mb )'
//                             name='file'
//                             onBlur={handleBlur}
//                            bg={"rgba(165, 151, 39, 0.7)"}
//                           />
//                           <ButtonWithModal handleSubmit={() => handleSubmit(values)} />
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

// export default privateUserRoute(Webapp)

import {
  Box,
  Flex,
  GridItem,
  Link,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  chakra,
  useTheme,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import privateUserRoute from "../routers/privateUserRoute";
import { Formik } from "formik";
import { toast } from "react-toastify";
import NextLink from "next/link";
import FileInput from "../components/FileInput";
import { uploadFile } from "../action/uploadFile";
import ButtonWithModal from "../components/ButtonWithModal";
import { getEntries, submitEntries } from "../action/entries";
import ContentLoader from "../components/ContentLoader";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const Webapp = () => {
  // Use theme tokens
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const cardBg = useColorModeValue("background.200", "background.200");
  const tabBg = useColorModeValue("background.200", "background.200");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];

  const [submission, setSubmission] = useState();
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (values) => {
    if (!values?.file?.name) {
      toast.error("Please Select a file");
      return;
    }
    if (values.file.size > 5000000) {
      toast.error("File Size Exceeded");
      return;
    }
    try {
      setLoading(true);
      const data = await uploadFile(values.file);
      if (data?.error) {
        toast.error("Something Went Wrong");
        setLoading(false);
        return;
      }
      const entryData = await submitEntries(data, "webapp");
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
        const entryData = await getEntries("webapp");
        if (entryData?.error) console.log(entryData?.error);
        setSubmission(entryData?.submission);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchSubmission();
  }, [setSubmission]);

  const [tabIndex, setTabIndex] = useState(0);

  return !loading ? (
    <Layout>
      <Box pt={10} width="full" pb="20px" px={{ base: "16px", md: "48px", lg: "64px" }}>
        <NextLink href="/dashboard">
          <chakra.h3
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
        </NextLink>

        <chakra.h1 py={5} fontSize={40} fontWeight="bold" color={textColor} textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}>
          Web N App
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
          {/* Tabs Section */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>Topics</Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg}>
                <TabPanel color = "hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      Problem Statements:
                    </Text>
                    
                    {/* FE-SE Category */}
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" color={primaryColor} mb={2}>
                        FE-SE Category:
                      </Text>
                      <Stack spacing={2} pl={4}>
                        <Text fontSize="md">1. Weather Storyboard – Dynamic Weather Visualization App</Text>
                        <Text fontSize="md">2. NewsPulse – Trending Headlines Analyzer</Text>
                        <Text fontSize="md">3. YouTube Trend Analyzer</Text>
                        <Text fontSize="md">4. FocusFlow – Smart Pomodoro Timer for Productivity</Text>
                      </Stack>
                    </Box>

                    {/* TE-BE Category */}
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" color={primaryColor} mb={2}>
                        TE-BE Category:
                      </Text>
                      <Stack spacing={2} pl={4}>
                        <Text fontSize="md">• Notification System as a SaaS</Text>
                        <Text fontSize="md">• End-to-End AI SQL Assistant</Text>
                        <Text fontSize="md">• Live Code Collaboration Platform</Text>
                        <Text fontSize="md">• KnowledgeGraphX – AI-Powered Knowledge Insights SaaS</Text>
                      </Stack>
                    </Box>

                    <Text fontSize="sm" color="gray.400" mt={2}>
                      Note: You can choose any one problem statement from your respective category
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl">
                      1. Each team can submit an entry for only one problem statement for their category.
                    </Text>
                    <Text fontSize="xl">
                      2. Participants are expected to submit a PPT of the proposed solution and idea on the submission platform for round 1. Adding the link of the Figma prototype or GitHub repository in the PPT is optional but preferred.
                    </Text>
                    <Text fontSize="xl">
                      3. The decision of the organizers and judges will be final and binding on all participants.
                    </Text>
                    <Text fontSize="xl" textDecor="underline">
                      Team Distribution:
                    </Text>
                    <Text fontSize="xl">1. FE-SE: Groups of a maximum of 4 participants.</Text>
                    <Text fontSize="xl">2. TE-BE: Groups of a maximum of 4 participants.</Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Submission Section */}
          {submission?.id ? (
            <GridItem>
              <Flex minH="100px" alignItems="center" justifyContent="center" flexDirection="column" gap={5}>
                <Text fontSize="2xl" textAlign="center" color={textColor}>
                  You have already submitted your entry
                </Text>
                <Link
                  href={submission.submission}
                  bg={primaryColor}
                  px={4}
                  py={1}
                  color="white"
                  _hover={{ bg: primaryGlow }}
                  borderRadius="md"
                  fontSize={20}
                >
                  Download
                </Link>
              </Flex>
            </GridItem>
          ) : (
            <GridItem>
              <Formik initialValues={{ file: {} }} onSubmit={handleSubmit}>
                {({ handleBlur, handleChange, values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={10}>
                      <FileInput
                        accept=".ppt,.pptx"
                        label="Upload Your PPT ( .ppt, .pptx upto 5mb )"
                        name="file"
                        onBlur={handleBlur}
                        bg={cardBg}
                        color={textColor}
                      />
                      <ButtonWithModal handleSubmit={() => handleSubmit(values)} bg={primaryColor} hoverBg={primaryGlow} />
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

export default privateUserRoute(Webapp);
