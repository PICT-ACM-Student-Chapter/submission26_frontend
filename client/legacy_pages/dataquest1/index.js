// import { Box, Button, chakra, Flex, Grid, GridItem, Link, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
// import React, { useContext, useEffect, useState } from 'react';
// import Layout from '../../components/Layout';
// import privateUserRoute from '../../routers/privateUserRoute';
// import { Formik } from "formik";
// import { toast } from 'react-toastify';
// import FileInput from '../../components/FileInput';
// import NextLink from 'next/link';
// import { uploadFile } from '../../action/uploadFile';
// import ButtonWithModal from '../../components/ButtonWithModal';
// import { getEntries, submitEntries } from '../../action/entries';
// import ContentLoader from '../../components/ContentLoader';
// import { ChevronLeftIcon, DownloadIcon } from '@chakra-ui/icons';
// import { dateString } from '../../utils/dateString';
// import AppContext from '../../context/AppContext';

// const Dataquest = () => {
//     const textColor = useColorModeValue("white", "white");
//     const [submissions, setSubmissions] = useState();
//     const [loading, setLoading] = useState(true);
//     const cardBg = useColorModeValue("white.100", "secondaries.800");
//     const { user } = useContext(AppContext);
//     const senior = user.year === 'TE' || user.year === 'BE';
//     const handleSubmit = async (values) => {
//         if (!values?.file_csv?.name) {
//             toast.error('Please Select a CSV file')
//             return;
//         }
//         if (!values?.file_python?.name) {
//             toast.error('Please Select a python or notebook file')
//             return;
//         }
//         if (values.file_csv.size > 5000000) {
//             toast.error('File Size of CSV Exceeded');
//             return;
//         }
//         if (values.file_python.size > 5000000) {
//             toast.error('File Size of pyhon/notebook file Exceeded');
//             return;
//         }
//         try {
//             setLoading(true);
//             const data = await uploadFile(values.file_csv)
//             if (data?.error) {
//                 toast.error('Someting Went Wrong')
//                 setLoading(false);
//                 return
//             }
//             const data_python = await uploadFile(values.file_python)
//             if (data_python?.error) {
//                 toast.error('Someting Went Wrong')
//                 setLoading(false);
//                 return
//             }
//             const entryData = await submitEntries({
//                 submission_csv: data.submission,
//                 submission_python: data_python.submission
//             }, 'dataquest');
//             console.log(entryData);
//             if (entryData?.error) {
//                 toast.error(entryData?.error);
//                 setLoading(false);
//                 return;
//             }
//             setSubmissions(
//                 submissions?.length > 0 ? [...submissions, entryData.submission] : [entryData.submission]
//             );
//             toast.success('Entry Submitted Successfully');
//         } catch (e) {
//             console.log(e)
//             toast.error('Someting Went Wrong')
//         }
//         setLoading(false);
//     }
//     useEffect(() => {
//         const fetchSubmission = async () => {
//             try {
//                 const entryData = await getEntries('dataquest');
//                 if (entryData?.error) {
//                     console.log(entryData?.error);
//                 }
//                 setSubmissions(entryData?.submissions);
//             } catch (e) {
//                 console.log(e);
//             }
//             setLoading(false);
//         }
//         fetchSubmission();
//     }, [setSubmissions])
//     const [tabIndex, setTabIndex] = useState(0)
//     return !loading ? (
//         <Layout>
//             <Box
//                 pt={10}
//                 width={"full"}
//                 pb={"20px"}
//                 px={{
//                     base: '16px',
//                     md: '48px',
//                     lg: '64px'
//                 }}
//             >
//                 <NextLink href='/dashboard'>
//                     <chakra.h3
//                         fontWeight={"bold"}
//                         fontSize={24}
//                         textTransform={"uppercase"}
//                         color={"#5FAB63"}
//                         cursor="pointer"
//                         display={'flex'}
//                         alignItems={'center'}
//                     >
//                         <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
//                     </chakra.h3>
//                 </NextLink>
//                 <Box py={5}>
//                     <chakra.h1
//                         fontSize={40}
//                         fontWeight={"bold"}
//                         color={textColor}
//                     >
//                         DataQuest Round 1 {senior ? "( TE-BE )" : "( FE-SE )"}
//                     </chakra.h1>
//                     <NextLink href='/dataquest1/leaderboard'>
//                         <chakra.span
//                             fontWeight={"bold"}
//                             fontSize={20}
//                             textTransform={"uppercase"}
//                             color={"#5FAB63"}
//                             cursor="pointer"
//                         >
//                             <span>View Leaderboard</span>
//                         </chakra.span>
//                     </NextLink>
//                 </Box>
//                 <SimpleGrid
//                     columns={{ base: 1, md: 2 }}
//                     gap={10}
//                 >
//                     <GridItem>
//                         <Tabs onChange={(index) => setTabIndex(index)}>
//                             <TabList color={textColor}>
//                                 <Tab fontSize={20}>
//                                     Problem
//                                 </Tab>
//                                 <Tab fontSize={20}>Rules</Tab>
//                                 <Tab fontSize={20}>My Submissions</Tab>
//                             </TabList>
//                             <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
//                                 <TabPanel>
//                                     <Stack spacing={3}>
//                                         <Text fontSize='2xl'>
//                                             Problem Statement
//                                         </Text>
//                                         <Text fontSize='lg'>
//                                             click <Link href={senior ? 'https://drive.google.com/drive/folders/1xFdaJY7xOyAmANreTbqyz_0HTOWYYcBj?usp=sharing' : 'https://drive.google.com/drive/folders/11DW1H4CEcjthJB5LG2pgVK8kgtO1Xbsa'} target={"_blank"} color={"blue.500"}>here</Link> to view the problem statement and dataset.
//                                         </Text>
//                                         <Text fontSize='lg'>
//                                             - Participants are given 3 csv files namely train.csv, test.csv and sample_submission.csv
//                                         </Text>
//                                         <Text fontSize='lg'>
//                                             - Participants have to use train and test files and build a model based on it and by referring to the sample submission they would have to submit a submisssion.csv file and a .ipynb/.py file on our submission platform.
//                                         </Text>
//                                     </Stack>
//                                 </TabPanel>
//                                 <TabPanel>
//                                     <Stack spacing={3}>
//                                         <Text fontSize='2xl'>
//                                             Rules
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                             1. The problem statement along with the dataset will be released on the platform.
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                             2. The link for the contest will be shared with the participants through email.
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                            3.  Participants are expected to submit their CSV files along with .ipynb/.py files.
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                             4. You can view the public leaderboard to compete against the best of the best solutions and achieve better results.
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                             5. The right to decide the optimization metric will rest with the judges and it will be final and binding (example: RMSE, MAE, or R² for regression problems; Accuracy, Precision, F1-Score, or AUC-ROC for classification problems).
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                            6.  Any unfair means will lead to immediate disqualification.
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                             7. Every round is an elimination round.
//                                         </Text>
//                                         <Text fontSize='xl'>
//                                             8. The right to decide the optimization metric will rest with the judges and it will be final and binding.
//                                         </Text>
//                                     </Stack>
//                                 </TabPanel>
//                                 <TabPanel>
//                                     <Stack spacing={3}>
//                                         {
//                                             submissions?.map((submission) => {
//                                                 const acc = submission.public_accuracy
//                                                 return (
//                                                     <Flex
//                                                         justifyContent={'space-between'}
//                                                         alignItems={"center"}
//                                                         p={6}
//                                                         rounded={"lg"}
//                                                         bg={cardBg}
//                                                         gap={5}
//                                                         key={submission?.id?.toString()}
//                                                         boxShadow={"md"}
//                                                     >
//                                                         <Flex
//                                                             flexDirection={"column"}
//                                                             gap={5}
//                                                         >
//                                                             <Text fontSize='xl'>{dateString(submission.created_at)}</Text>
//                                                             <Text fontSize='xl'>{senior ? "F1 Score: " : "Mean Square Error : "} {acc.toPrecision(5)}</Text>
//                                                         </Flex>
//                                                         <Link href={submission.submission_csv}>
//                                                             <DownloadIcon fontSize={'xl'} />
//                                                         </Link>
//                                                     </Flex>
//                                                 )
//                                             })
//                                         }
//                                     </Stack>
//                                 </TabPanel>
//                             </TabPanels>
//                         </Tabs>
//                     </GridItem>
//                     <GridItem>
//                         <Formik
//                             initialValues={{
//                                 file_csv: {},
//                                 file_python: {},
//                             }}
//                             onSubmit={handleSubmit}
//                         >
//                             {({ handleBlur, handleChange, values, handleSubmit }) => (
//                                 <form onSubmit={handleSubmit}>
//                                     <Stack
//                                         spacing={5}
//                                     >
//                                         <Box>
//                                             <chakra.h3
//                                                 color={textColor}
//                                                 fontSize={'3xl'}
//                                                 fontWeight={'bold'}
//                                             >
//                                                 Submit your Entry
//                                             </chakra.h3>
//                                             <Text fontSize={'lg'} color={textColor}>maximum 3 entries per day</Text>
//                                         </Box>
//                                         <FileInput
//                                             accept={'.csv'}
//                                             label='Upload Your CSV ( .csv upto 5mb )'
//                                             name='file_csv'
//                                             onBlur={handleBlur}
//                                             bg={"rgba(165, 151, 39, 0.7)"}
//                                         />
//                                         <FileInput
//                                             accept={'.py,.ipynb'}
//                                             label='Upload Your python or notebook file ( .py, .ipynb upto 5mb )'
//                                             name='file_python'
//                                             onBlur={handleBlur}
//                                             bg={"rgba(165, 151, 39, 0.7)"}
//                                         />
//                                         <ButtonWithModal handleSubmit={() => handleSubmit(values)} />
//                                     </Stack>
//                                 </form>
//                             )}
//                         </Formik>
//                     </GridItem>
//                 </SimpleGrid>
//             </Box>
//         </Layout>
//     ) : (
//         <ContentLoader />
//     )
// }

// export default privateUserRoute(Dataquest)

import {
  Box,
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
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import privateUserRoute from "../../routers/privateUserRoute";
import { Formik } from "formik";
import { toast } from "react-toastify";
import FileInput from "../../components/FileInput";
import NextLink from "next/link";
import { uploadFile } from "../../action/uploadFile";
import ButtonWithModal from "../../components/ButtonWithModal";
import { getEntries, submitEntries } from "../../action/entries";
import ContentLoader from "../../components/ContentLoader";
import { ChevronLeftIcon, DownloadIcon } from "@chakra-ui/icons";
import { dateString } from "../../utils/dateString";
import AppContext from "../../context/AppContext";

const Dataquest = () => {
  const theme = useTheme();
  const textColor = theme.colors.gray[100];
  const cardBg = theme.colors.gray[800];
  const accentColor = theme.colors.primary[400];
  const highlight = theme.colors.primary[200];

  const [submissions, setSubmissions] = useState();
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);
  const senior = user.year === "TE" || user.year === "BE";

  const handleSubmit = async (values) => {
    if (!values?.file_csv?.name) return toast.error("Please Select a CSV file");
    if (!values?.file_python?.name)
      return toast.error("Please Select a Python/Notebook file");

    if (values.file_csv.size > 5000000)
      return toast.error("CSV file size exceeded 5MB");
    if (values.file_python.size > 5000000)
      return toast.error("Python/Notebook file size exceeded 5MB");

    try {
      setLoading(true);
      const data = await uploadFile(values.file_csv);
      if (data?.error) throw new Error();

      const data_python = await uploadFile(values.file_python);
      if (data_python?.error) throw new Error();

      const entryData = await submitEntries(
        {
          submission_csv: data.submission,
          submission_python: data_python.submission,
        },
        "dataquest"
      );

      if (entryData?.error) throw new Error(entryData?.error);

      setSubmissions((prev) =>
        prev?.length > 0
          ? [...prev, entryData.submission]
          : [entryData.submission]
      );
      toast.success("Entry Submitted Successfully");
    } catch (e) {
      toast.error(e?.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries("dataquest");
        setSubmissions(entryData?.submissions);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, []);

  const [tabIndex, setTabIndex] = useState(0);

  return !loading ? (
    <Layout>
      <Box
        pt={10}
        width="full"
        pb="20px"
        px={{ base: "16px", md: "48px", lg: "64px" }}
      >
        <NextLink href="/dashboard">
          <chakra.h3
            fontWeight="bold"
            fontSize={24}
            textTransform="uppercase"
            color={accentColor}
            cursor="pointer"
            display="flex"
            alignItems="center"
          >
            <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>

        <Box py={5}>
          <chakra.h1
            fontSize={40}
            fontWeight="bold"
            color={textColor}
            textShadow={`0 0 4px ${highlight}, 0 0 8px ${accentColor}`}
          >
            DataQuest Round 1 {senior ? "( TE-BE )" : "( FE-SE )"}
          </chakra.h1>

          <NextLink href="/dataquest1/leaderboard">
            <chakra.span
              fontWeight="bold"
              fontSize={20}
              textTransform="uppercase"
              color={accentColor}
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              View Leaderboard
            </chakra.span>
          </NextLink>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
          {/* Left Side Tabs */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)} variant="enclosed">
              <TabList color={textColor} borderBottom={`2px solid ${accentColor}`}>
                <Tab fontSize={18}>Problem</Tab>
                <Tab fontSize={18}>Rules</Tab>
                <Tab fontSize={18}>My Submissions</Tab>
              </TabList>

              <TabPanels bg={cardBg} p={4} rounded="md" boxShadow="md">
                <TabPanel>
  <Stack spacing={3}>
    <Text fontSize="2xl" fontWeight="bold" color="white">
      Problem Statement
    </Text>

    <Text fontSize="lg" color="white">
      Click{" "}
      <Link
        href={
           "https://drive.google.com/drive/folders/16Oa8dsCFE4BCVdo5DGRj_azv5x4OwpRz?usp=sharing"
        }
        target="_blank"
        color="#00FFFF"  // ✅ bright neon cyan
        fontWeight="bold"
        textDecoration="underline"
        _hover={{
          color: "#7DF9FF", // lighter glow on hover
          textShadow: "0 0 10px #00FFFF", // ✅ glowing hover effect
        }}
      >
        here
      </Link>{" "}
      to view the problem statement and dataset.
    </Text>

    <Text fontSize="lg" color="white">
      - You’ll receive train.csv, test.csv, and sample_submission.csv
    </Text>

    <Text fontSize="lg" color="white">
      - Use the train/test files to build your model and submit both the output
      CSV and your code file (.ipynb or .py).
    </Text>
  </Stack>
</TabPanel>


                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize="2xl" fontWeight="bold" color="hsl(210, 40%, 100%)">
                      Rules
                    </Text>
                    {[
                      "The problem statement and dataset will be released on the platform.",
                      "You’ll receive contest details via email.",
                      "Submit both your CSV and Python/Notebook files.",
                      "You can view the public leaderboard for comparison.",
                      "Judges will decide the metric (RMSE, F1, Accuracy, etc.) — it’s final.",
                      "Unfair means lead to disqualification.",
                      "Every round is an elimination round.",
                    ].map((rule, i) => (
                      <Text key={i} fontSize="lg" color="hsl(210, 40%, 100%)">
                        {i + 1}. {rule}
                      </Text>
                    ))}
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack spacing={4}>
                    {submissions?.length ? (
                      submissions.map((submission) => (
                        <Flex
                          key={submission?.id}
                          justifyContent="space-between"
                          alignItems="center"
                          p={5}
                          rounded="md"
                          bg={theme.colors.gray[700]}
                          boxShadow="md"
                          _hover={{
                            transform: "scale(1.02)",
                            transition: "0.2s",
                          }}
                        >
                          <Flex flexDirection="column" gap={2}>
                            <Text fontSize="lg" fontWeight="medium">
                              {dateString(submission.created_at)}
                            </Text>
                            <Text fontSize="lg">
                              {senior ? "F1 Score:" : "Mean Square Error:"}{" "}
                              {submission.public_accuracy?.toPrecision(5)}
                            </Text>
                          </Flex>
                          <Link href={submission.submission_csv}>
                            <DownloadIcon fontSize="xl" color={accentColor} />
                          </Link>
                        </Flex>
                      ))
                    ) : (
                      <Text fontSize="lg" color="gray.400">
                        No submissions yet.
                      </Text>
                    )}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right Side Form */}
          <GridItem>
            <Formik
              initialValues={{ file_csv: {}, file_python: {} }}
              onSubmit={handleSubmit}
            >
              {({ handleBlur, values, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={5}>
                    <Box>
                      <chakra.h3
                        color={textColor}
                        fontSize="2xl"
                        fontWeight="bold"
                      >
                        Submit your Entry
                      </chakra.h3>
                      <Text fontSize="md" color="gray.300">
                        Maximum 5 entries per day
                      </Text>
                    </Box>
                    <FileInput
                      accept=".csv"
                      label="Upload CSV (Max 5MB)"
                      name="file_csv"
                      onBlur={handleBlur}
                      bg={cardBg}
                    />
                    <FileInput
                      accept=".py,.ipynb"
                      label="Upload Python/Notebook (Max 5MB)"
                      name="file_python"
                      onBlur={handleBlur}
                      bg={cardBg}
                    />
                    <ButtonWithModal handleSubmit={() => handleSubmit(values)} />
                  </Stack>
                </form>
              )}
            </Formik>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  );
};

export default privateUserRoute(Dataquest);
