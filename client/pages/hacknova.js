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
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

const Hacknova = () => {
  // Use theme tokens
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const tabBg = useColorModeValue("background.200", "background.200");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const initialFormValues = {
    team_name: "",
    project_title: "",
    github_url: "",
    live_demo_url: "",
    presentation_file: {},
    project_zip: {},
    notes: "",
  };

  const validationSchema = Yup.object().shape({
    team_name: Yup.string().trim().required("Team name is required"),
    project_title: Yup.string().trim().required("Project title is required"),
    github_url: Yup.string()
      .trim()
      .url("Enter a valid URL (e.g. https://github.com/...)")
      .required("GitHub repository link is required"),
    live_demo_url: Yup.string()
      .trim()
      .url("Enter a valid URL (e.g. https://...)")
      .nullable(),
    notes: Yup.string().trim(),
  });

  const handleSubmit = async (values) => {
    if (!values?.team_name?.trim()) {
      toast.error("Please enter your Team Name");
      return;
    }
    if (!values?.project_title?.trim()) {
      toast.error("Please enter your Project Title");
      return;
    }
    if (!values?.github_url?.trim()) {
      toast.error("Please enter your GitHub repository link");
      return;
    }

    if (
      values?.presentation_file?.size &&
      values.presentation_file.size > 15 * 1024 * 1024
    ) {
      toast.error("Presentation file exceeds 15MB limit");
      return;
    }

    if (
      values?.project_zip?.size &&
      values.project_zip.size > 50 * 1024 * 1024
    ) {
      toast.error("Project ZIP file exceeds 50MB limit");
      return;
    }

    if (!values?.presentation_file?.name && !values?.project_zip?.name) {
      toast.error(
        "Please upload at least your presentation deck (PPT/PDF) or project ZIP archive"
      );
      return;
    }

    try {
      setLoading(true);
      let presentation_url = null;
      let project_zip_url = null;

      // Upload presentation file if selected
      if (values?.presentation_file?.name) {
        toast.info("Uploading presentation deck to S3...");
        const pData = await uploadFile(values.presentation_file);
        if (pData?.error || !pData?.submission) {
          toast.error("Failed to upload presentation. Please try again.");
          setLoading(false);
          return;
        }
        presentation_url = pData.submission;
      }

      // Upload project zip archive if selected
      if (values?.project_zip?.name) {
        toast.info("Uploading project ZIP archive to S3...");
        const zData = await uploadFile(values.project_zip);
        if (zData?.error || !zData?.submission) {
          toast.error("Failed to upload project ZIP archive. Please try again.");
          setLoading(false);
          return;
        }
        project_zip_url = zData.submission;
      }

      const payload = {
        team_name: values.team_name.trim(),
        project_title: values.project_title.trim(),
        github_url: values.github_url.trim(),
        live_demo_url: values.live_demo_url?.trim() || "",
        presentation_url,
        project_zip_url,
        submission_file_url: project_zip_url || presentation_url || null,
        notes: values.notes?.trim() || "",
      };

      toast.info("Submitting project details...");
      const entryData = await submitEntries(payload, "hacknova");
      if (entryData?.error) {
        toast.error(entryData.error);
        setLoading(false);
        return;
      }

      setSubmission(entryData.submission || payload);
      toast.success("HackNova Project Submitted Successfully! 🚀");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while submitting. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries("hacknova");
        if (entryData?.error) console.log(entryData?.error);
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
          HackNova
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
                      🚀 HackNova &apos;26 — Submission Rules
                    </Text>

                    <Stack spacing={2.5} fontSize="md">
                      <Text>
                        1. <chakra.span fontWeight="bold" color={primaryColor}>Only the Team Leader</chakra.span> is allowed to submit the project.
                      </Text>
                      <Text>
                        2. The Team Leader must be registered for HackNova.
                      </Text>
                      <Box>
                        <Text>3. Submit all of the following:</Text>
                        <Stack spacing={1} pl={6} pt={1}>
                          <Text>• GitHub Repository Link</Text>
                          <Text>• Project ZIP File</Text>
                          <Text>• Presentation (PDF/PPT/PPTX)</Text>
                        </Stack>
                      </Box>
                      <Text>
                        4. Provide the correct project title and team name.
                      </Text>
                      <Text>
                        5. Live Demo Link and additional notes are optional.
                      </Text>
                      <Text>
                        6. <chakra.span fontWeight="bold" color={primaryColor}>Only one submission per user is allowed.</chakra.span> Review all details carefully before submitting.
                      </Text>
                      <Text>
                        7. Ensure all submitted files and links are valid and accessible.
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
                        All the best, HackNova participants! 🚀
                      </Text>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right Column: Submission Form OR Submission Record */}
          {submission?.id || submission?.project_title ? (
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
                    HACKNOVA &bull; RECORD LOCKED
                  </chakra.p>
                </Flex>

                {/* Submission Details */}
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

                  {submission.project_title && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Project Title
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.project_title}
                      </Text>
                    </Box>
                  )}

                  {submission.github_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        GitHub Repository
                      </Text>
                      <Link
                        href={submission.github_url}
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
                        {submission.github_url} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                  )}

                  {submission.live_demo_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Live Demo
                      </Text>
                      <Link
                        href={submission.live_demo_url}
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
                        {submission.live_demo_url} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                  )}

                  {/* Download Action Links */}
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} pt={2}>
                    {(submission.presentation_url || submission.submission) && (
                      <Link
                        href={submission.presentation_url || submission.submission}
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
                        <DownloadIcon /> Presentation Deck
                      </Link>
                    )}

                    {submission.project_zip_url && (
                      <Link
                        href={submission.project_zip_url}
                        isExternal
                        bg="rgba(34, 211, 238, 0.15)"
                        border="1px solid rgba(34, 211, 238, 0.5)"
                        color="#22D3EE"
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
                          bg: "rgba(34, 211, 238, 0.25)",
                          borderColor: "#22D3EE",
                          boxShadow: "0 0 15px rgba(34, 211, 238, 0.3)",
                          transform: "translateY(-1px)",
                        }}
                      >
                        <DownloadIcon /> Project ZIP Archive
                      </Link>
                    )}
                  </SimpleGrid>

                  {submission.notes && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Notes / Instructions
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
                      Only one submission per team is permitted. If you require any updates, please contact the HackNova event coordinators.
                    </Text>
                  </Box>
                </Stack>
              </Box>
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
                    PROJECT SUBMISSION PORTAL
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
                    fontSize="xs"
                    color="#22D3EE"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    TEAM LEADER VERIFIED &bull; ROUND 1 DELIVERABLES
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
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                          <FormField
                            label="Team Name *"
                            name="team_name"
                            placeholder="e.g. CyberNovas"
                            value={values.team_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <FormField
                            label="Project Title *"
                            name="project_title"
                            placeholder="e.g. End-to-End AI SQL Assistant"
                            value={values.project_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </SimpleGrid>

                        <FormField
                          label="GitHub Repository Link *"
                          name="github_url"
                          placeholder="https://github.com/username/project"
                          value={values.github_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <FormField
                          label="Live Demo Link (Optional)"
                          name="live_demo_url"
                          placeholder="https://my-demo-app.vercel.app"
                          value={values.live_demo_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                          <FileInput
                            accept=".ppt,.pptx,.pdf"
                            label="Presentation (PPTX/PDF upto 15MB)"
                            name="presentation_file"
                            onBlur={handleBlur}
                          />
                          <FileInput
                            accept=".zip,.rar,.7z,.tar,.gz"
                            label="Project Archive (ZIP upto 50MB)"
                            name="project_zip"
                            onBlur={handleBlur}
                          />
                        </SimpleGrid>

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
                            Additional Notes / Credentials (Optional)
                          </FormLabel>
                          <Textarea
                            name="notes"
                            placeholder="Any special setup instructions, test credentials, or notes for the evaluators"
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

export default privateUserRoute(Hacknova);