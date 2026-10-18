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
  Textarea,
  FormControl,
  FormLabel,
  chakra,
  useTheme,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import privateUserRoute from "../routers/privateUserRoute";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import NextLink from "next/link";
import FileInput from "../components/FileInput";
import FormField from "../components/FormField";
import { uploadFile } from "../action/uploadFile";
import ButtonWithModal from "../components/ButtonWithModal";
import { getEntries, submitEntries } from "../action/entries";
import ContentLoader from "../components/ContentLoader";
import SubmissionClosedNotice from "../components/SubmissionClosedNotice";
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

const Rootcause = () => {
  // Use theme tokens
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const tabBg = useColorModeValue("background.200", "background.200");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];

  const [submission, setSubmission] = useState(null);
  const [isSubmissionActive, setIsSubmissionActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const initialFormValues = {
    team_name: "",
    github_repo_url: "",
    github_pr_url: "",
    file: {},
    notes: "",
  };

  const validationSchema = Yup.object().shape({
    team_name: Yup.string().trim().required("Team name is required"),
    github_repo_url: Yup.string()
      .trim()
      .url("Enter a valid URL (e.g. https://github.com/...)")
      .required("GitHub repository or fork link is required"),
    github_pr_url: Yup.string()
      .trim()
      .url("Enter a valid URL (e.g. https://github.com/.../pull/...)")
      .required("Pull Request or branch link is required"),
    notes: Yup.string().trim(),
  });

  const handleSubmit = async (values) => {
    if (!isSubmissionActive) {
      toast.error("Submissions for Root Cause are currently closed. Entries cannot be submitted or stored in the database.");
      return;
    }
    if (!values?.team_name?.trim()) {
      toast.error("Please enter your Team Name");
      return;
    }
    if (!values?.github_repo_url?.trim()) {
      toast.error("Please enter your GitHub repository/fork link");
      return;
    }
    if (!values?.github_pr_url?.trim()) {
      toast.error("Please enter your Pull Request or branch link");
      return;
    }

    if (values?.file?.size && values.file.size > 50 * 1024 * 1024) {
      toast.error("Patch / Archive file exceeds 50MB limit");
      return;
    }

    try {
      setLoading(true);
      let submission_file_url = null;

      // Upload patch/diff/zip file if selected
      if (values?.file?.name) {
        toast.info("Uploading patch file to S3...");
        const pData = await uploadFile(values.file);
        if (pData?.error || !pData?.submission) {
          toast.error("Failed to upload patch file. Please try again.");
          setLoading(false);
          return;
        }
        submission_file_url = pData.submission;
      }

      const payload = {
        team_name: values.team_name.trim(),
        github_repo_url: values.github_repo_url.trim(),
        github_pr_url: values.github_pr_url.trim(),
        submission_file_url,
        submission: submission_file_url,
        notes: values.notes?.trim() || "",
      };

      toast.info("Submitting Root Cause fix...");
      const entryData = await submitEntries(payload, "rootcause");
      if (entryData?.error) {
        toast.error(entryData.error);
        setLoading(false);
        return;
      }

      setSubmission(entryData.submission || payload);
      toast.success("Root Cause Fix Submitted Successfully! 🚀");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while submitting. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries("rootcause");
        if (entryData?.error) console.log(entryData?.error);
        setSubmission(entryData?.submission);
        if (entryData?.submission_active !== undefined) {
          setIsSubmissionActive(Boolean(entryData.submission_active));
        } else if (entryData?.event_status !== undefined) {
          setIsSubmissionActive(Boolean(entryData.event_status));
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchSubmission();
  }, [setSubmission]);

  return !loading ? (
    <Layout>
      <Box pt={10} width="full" pb="40px" px={{ base: "16px", md: "48px", lg: "64px" }}>
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

        <chakra.h1
          py={5}
          fontSize={40}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}
        >
          Root Cause
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10}>
          {/* Left Column: Topics and Instructions */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>Topics</Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg}>
                {/* Tab 1: Problem Statements */}
                <TabPanel color="hsl(210, 40%, 100%)">
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

                {/* Tab 2: Submission Rules */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor} mb={1}>
                      🚀 Root Cause &apos;26 — Submission Rules
                    </Text>

                    <Stack spacing={2.5} fontSize="md">
                      <Text>
                        1. <chakra.span fontWeight="bold" color={primaryColor}>Only the Team Leader</chakra.span> or registered participant is allowed to submit the bug fix.
                      </Text>
                      <Text>
                        2. The participant must be registered for Root Cause.
                      </Text>
                      <Text>
                        3. Provide the <chakra.span fontWeight="bold" color={primaryColor}>GitHub Repository or Fork link</chakra.span> and the relevant <chakra.span fontWeight="bold" color={primaryColor}>Pull Request (PR) or branch link</chakra.span>.
                      </Text>
                      <Text>
                        4. Uploading a patch, diff, or archive file (.diff, .patch, .zip, .pdf) is optional but recommended.
                      </Text>
                      <Text>
                        5. Provide concise fix notes explaining the root cause diagnosis and resolution.
                      </Text>
                      <Text>
                        6. <chakra.span fontWeight="bold" color={primaryColor}>Only one submission per participant/team is allowed.</chakra.span> Review all details carefully before submitting.
                      </Text>
                      <Text>
                        7. Ensure your repository and pull request are public and accessible to evaluators.
                      </Text>
                    </Stack>

                    <Box
                      mt={3}
                      p={3}
                      rounded="md"
                      border="1px solid rgba(56, 217, 169, 0.3)"
                      bg="rgba(56, 217, 169, 0.08)"
                      textAlign="center"
                    >
                      <Text fontSize="md" fontWeight="bold" color={primaryColor} letterSpacing="0.05em">
                        All the best, Root Cause participants! 🚀
                      </Text>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right Column: Submission Form OR Submission Record */}
          {submission?.id || submission?.github_repo_url || submission?.github_pr_url ? (
            <GridItem>
              <Box
                position="relative"
                p={{ base: 6, md: 8 }}
                bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 100%)"
                border="1px solid rgba(56, 217, 169, 0.5)"
                boxShadow="0 0 35px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
                borderRadius="md"
                overflow="hidden"
              >
                {/* 4 Corner HUD Brackets */}
                <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

                {/* Header */}
                <Flex direction="column" align="center" textAlign="center" mb={6}>
                  <Flex
                    align="center"
                    justify="center"
                    w="52px"
                    h="52px"
                    rounded="full"
                    bg="rgba(56, 217, 169, 0.15)"
                    border="1px solid #38D9A9"
                    color="#38D9A9"
                    mb={3}
                    boxShadow="0 0 20px rgba(56, 217, 169, 0.4)"
                  >
                    <CheckCircleIcon w={6} h={6} />
                  </Flex>
                  <chakra.h2
                    fontFamily="'United Colony', sans-serif !important"
                    fontSize={{ base: "xl", sm: "2xl" }}
                    fontWeight="bold"
                    color="#FFFFFF"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    ENTRY SUBMITTED SUCCESSFULLY
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
                    fontSize="xs"
                    color="gray.400"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    ROOT CAUSE &bull; RECORD LOCKED
                  </chakra.p>
                </Flex>

                {/* Submission Details from Backend Controller */}
                <Stack spacing={4} fontFamily="'Oxanium', sans-serif">
                  {submission.team_name && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Team Name
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.team_name}
                      </Text>
                    </Box>
                  )}

                  {submission.github_repo_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        GitHub Repository / Fork
                      </Text>
                      <Link
                        href={submission.github_repo_url}
                        isExternal
                        color="#22D3EE"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1.5}
                        wordBreak="break-all"
                        _hover={{ textDecoration: "underline" }}
                        mt={0.5}
                      >
                        {submission.github_repo_url} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                  )}

                  {submission.github_pr_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Pull Request / Branch
                      </Text>
                      <Link
                        href={submission.github_pr_url}
                        isExternal
                        color="#22D3EE"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1.5}
                        wordBreak="break-all"
                        _hover={{ textDecoration: "underline" }}
                        mt={0.5}
                      >
                        {submission.github_pr_url} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                  )}

                  {/* Download Patch / Fix File */}
                  {(submission.submission_file_url || submission.submission) && (
                    <Box pt={2}>
                      <Link
                        href={submission.submission_file_url || submission.submission}
                        isExternal
                        bg="rgba(56, 217, 169, 0.15)"
                        border="1px solid rgba(56, 217, 169, 0.5)"
                        color="#38D9A9"
                        p={3}
                        rounded="md"
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="bold"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        transition="all 0.2s"
                        _hover={{
                          bg: "rgba(56, 217, 169, 0.25)",
                          borderColor: "#38D9A9",
                          boxShadow: "0 0 15px rgba(56, 217, 169, 0.3)",
                          transform: "translateY(-1px)",
                        }}
                      >
                        <DownloadIcon /> Download Patch / Fix File
                      </Link>
                    </Box>
                  )}

                  {submission.notes && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Fix Notes / Root Cause Analysis
                      </Text>
                      <Text fontSize="sm" color="gray.300" mt={0.5} whiteSpace="pre-wrap">
                        {submission.notes}
                      </Text>
                    </Box>
                  )}

                  <Box
                    p={3}
                    rounded="md"
                    bg="rgba(248, 208, 146, 0.08)"
                    border="1px solid rgba(248, 208, 146, 0.3)"
                    textAlign="center"
                    mt={3}
                  >
                    <Text fontSize="xs" color="#F8D092" letterSpacing="0.05em">
                      Only one submission per participant/team is permitted. If you require any updates, please contact the Root Cause event coordinators.
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </GridItem>
          ) : !isSubmissionActive ? (
            /* Submissions Closed Notice */
            <GridItem>
              <SubmissionClosedNotice eventName="Root Cause" />
            </GridItem>
          ) : (
            /* Submission Form */
            <GridItem>
              <Box
                position="relative"
                p={{ base: 5, md: 7 }}
                bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 100%)"
                border="1px solid rgba(56, 217, 169, 0.35)"
                boxShadow="0 12px 32px rgba(0, 0, 0, 0.85)"
                borderRadius="md"
                overflow="hidden"
              >
                {/* 4 Corner HUD Brackets */}
                <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

                <Box mb={5}>
                  <chakra.h2
                    fontFamily="'United Colony', sans-serif !important"
                    fontSize={{ base: "xl", sm: "2xl" }}
                    fontWeight="bold"
                    color="#FFFFFF"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    BUG FIX SUBMISSION PORTAL
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
                    fontSize="xs"
                    color="#22D3EE"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    PICT OSS BUGATHON &bull; ROUND 1 DELIVERABLES
                  </chakra.p>
                </Box>

                <Formik
                  initialValues={initialFormValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ handleBlur, handleChange, values, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                        <FormField
                          label="Team Name *"
                          name="team_name"
                          placeholder="e.g. RootBusters"
                          value={values.team_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <FormField
                          label="GitHub Repository / Fork Link *"
                          name="github_repo_url"
                          placeholder="https://github.com/username/rootcause-fork"
                          value={values.github_repo_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <FormField
                          label="Branch / Pull Request (PR) Link *"
                          name="github_pr_url"
                          placeholder="https://github.com/pict-oss/bugathon/pull/101"
                          value={values.github_pr_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <FileInput
                          accept=".diff,.patch,.zip,.tar,.gz,.pdf"
                          label="Upload Bug Fix / Patch File (.diff, .patch, .zip, .pdf upto 50MB) (Optional)"
                          name="file"
                          onBlur={handleBlur}
                        />

                        <FormControl id="notes">
                          <FormLabel
                            fontFamily="'Oxanium', sans-serif"
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            color="#38D9A9"
                            mb={1.5}
                          >
                            Root Cause Diagnosis & Fix Notes (Optional)
                          </FormLabel>
                          <Textarea
                            name="notes"
                            placeholder="Detailed explanation of the root cause identified, performance improvements, and fix summary"
                            rows={3}
                            fontFamily="'Oxanium', sans-serif"
                            fontSize="sm"
                            color="#FFFFFF"
                            bg="rgba(7, 16, 36, 0.85)"
                            border="1px solid rgba(56, 217, 169, 0.35)"
                            borderRadius="md"
                            _hover={{ borderColor: "rgba(56, 217, 169, 0.6)" }}
                            _focus={{
                              borderColor: "#38D9A9",
                              boxShadow: "0 0 12px rgba(56, 217, 169, 0.35)",
                            }}
                            _placeholder={{
                              color: "rgba(203, 213, 225, 0.45)",
                              fontSize: "sm",
                            }}
                            value={values.notes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormControl>

                        <Box pt={2}>
                          <ButtonWithModal
                            handleSubmit={() => handleSubmit(values)}
                            bg={primaryColor}
                            hoverBg={primaryGlow}
                          />
                        </Box>
                      </Stack>
                    </form>
                  )}
                </Formik>
              </Box>
            </GridItem>
          )}
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  );
};

export default privateUserRoute(Rootcause, "rootcause");