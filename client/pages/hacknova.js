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
  Input,
  Button,
  Badge,
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
import { useRouter } from "next/router";
import FileInput from "../components/FileInput";
import FormField from "../components/FormField";
import { uploadFile } from "../action/uploadFile";
import ButtonWithModal from "../components/ButtonWithModal";
import { getEntries, submitEntries } from "../action/entries";
import { getHackNovaTeamMe, getHackNovaSquadRegistrationStatus } from "../action/hacknovaTeam";
import ContentLoader from "../components/ContentLoader";
import SubmissionClosedNotice from "../components/SubmissionClosedNotice";
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  DownloadIcon,
  LockIcon,
  WarningIcon,
  ArrowForwardIcon,
  RepeatIcon,
} from "@chakra-ui/icons";

const Hacknova = () => {
  // Use theme tokens
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const tabBg = useColorModeValue("background.200", "background.200");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];

  const [submission, setSubmission] = useState(null);
  const [isSubmissionActive, setIsSubmissionActive] = useState(true);
  const [isSquadRegistrationActive, setIsSquadRegistrationActive] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("INITIALIZING HACKNOVA MISSION...");
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

  const handleRefreshStatus = async () => {
    try {
      setRefreshingStatus(true);
      const teamData = await getHackNovaTeamMe();
      if (teamData?.team) {
        setRegisteredTeam(teamData.team);
        toast.success(`Squad detected: "${teamData.team.team_name}". Project submission unlocked! 🚀`);
      } else {
        toast.info("No registered squad found yet. Please complete team registration first.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to re-check squad status. Please try again.");
    } finally {
      setRefreshingStatus(false);
    }
  };

  const initialFormValues = {
    team_name: registeredTeam?.team_name || "",
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
    if (!registeredTeam) {
      toast.error("You must register your squad before submitting your project. Please complete team registration first.");
      router.push("/hacknova-team");
      return;
    }

    if (!isSubmissionActive) {
      toast.error("Submissions for HackNova are currently closed. Entries cannot be submitted or stored in the database.");
      return;
    }
    const finalTeamName = (registeredTeam?.team_name || values?.team_name || "").trim();

    if (!finalTeamName) {
      toast.error("Please register your squad first");
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
      setLoadingText("UPLOADING DELIVERABLES & SUBMITTING PROJECT...");
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
        team_name: finalTeamName,
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
    const fetchData = async () => {
      try {
        const entryData = await getEntries("hacknova");
        if (entryData?.error) console.log(entryData?.error);
        if (entryData?.submission) {
          setSubmission(entryData.submission);
        }
        if (entryData?.submission_active !== undefined) {
          setIsSubmissionActive(Boolean(entryData.submission_active));
        } else if (entryData?.event_status !== undefined) {
          setIsSubmissionActive(Boolean(entryData.event_status));
        }

        // Fetch team registration info quietly to prefill team name if available
        const teamData = await getHackNovaTeamMe();
        if (teamData?.team) {
          setRegisteredTeam(teamData.team);
        }

        // Fetch squad registration portal status specifically (Event ID 200, table hacknova_teams, route /hacknova-team)
        const squadStatus = await getHackNovaSquadRegistrationStatus();
        setIsSquadRegistrationActive(Boolean(squadStatus.status || squadStatus.is_active));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return !loading ? (
    <Layout>
      <Box pt={{ base: 5, md: 10 }} width="full" pb={{ base: "40px", md: "60px" }} px={{ base: 3, sm: 6, md: 10, lg: 16 }}>
        {/* Top Header Navigation */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={3} mb={2}>
          <NextLink href="/dashboard" passHref>
            <chakra.h3
              fontWeight="bold"
              fontSize={{ base: "sm", sm: "md", md: 20 }}
              textTransform="uppercase"
              color={primaryColor}
              cursor="pointer"
              display="flex"
              alignItems="center"
              fontFamily="'Oxanium', sans-serif"
            >
              <ChevronLeftIcon w={5} h={5} /> <span>Back to all events</span>
            </chakra.h3>
          </NextLink>
        </Flex>

        <chakra.h1
          py={{ base: 2, sm: 4 }}
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}
          fontFamily="'United Colony', sans-serif !important"
          letterSpacing="0.05em"
          textTransform="uppercase"
        >
          HackNova
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 10 }} alignItems="start">
          {/* Left Column: Topics and Instructions */}
          <GridItem minW={0}>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor} fontFamily="'Oxanium', sans-serif">
                <Tab fontSize={{ base: 'xs', sm: 'sm', md: 'md' }} px={{ base: 3, sm: 4 }} fontWeight="bold" fontFamily="'Oxanium', sans-serif">Topics</Tab>
                <Tab fontSize={{ base: 'xs', sm: 'sm', md: 'md' }} px={{ base: 3, sm: 4 }} fontWeight="bold" fontFamily="'Oxanium', sans-serif">Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg} borderRadius="md" overflow="hidden">
                {/* Tab 1: Problem Statements */}
                <TabPanel p={{ base: 3, sm: 4, md: 5 }} color="hsl(210, 40%, 100%)">
                  <Stack spacing={3} fontFamily="'Oxanium', sans-serif">
                    <Text fontSize={{ base: "md", sm: "lg", md: "xl" }} fontWeight="bold" color={textColor}>
                      Problem Statements:
                    </Text>

                    {/* FE-SE Category */}
                    <Box>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="semibold" color={primaryColor} mb={1.5}>
                        FE-SE Category:
                      </Text>
                      <Stack spacing={2} pl={{ base: 2, sm: 4 }}>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">1. Weather Storyboard – Dynamic Weather Visualization App</Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">2. NewsPulse – Trending Headlines Analyzer</Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">3. YouTube Trend Analyzer</Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">4. FocusFlow – Smart Pomodoro Timer for Productivity</Text>
                      </Stack>
                    </Box>

                    {/* TE-BE Category */}
                    <Box>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="semibold" color={primaryColor} mb={1.5}>
                        TE-BE Category:
                      </Text>
                      <Stack spacing={2} pl={{ base: 2, sm: 4 }}>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">• Notification System as a SaaS</Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">• End-to-End AI SQL Assistant</Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">• Live Code Collaboration Platform</Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} wordBreak="break-word">• KnowledgeGraphX – AI-Powered Knowledge Insights SaaS</Text>
                      </Stack>
                    </Box>

                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="gray.400" mt={1}>
                      Note: You can choose any one problem statement from your respective category.
                    </Text>
                  </Stack>
                </TabPanel>

                {/* Tab 2: Submission Rules */}
                <TabPanel p={{ base: 3, sm: 4, md: 5 }} color="hsl(210, 40%, 100%)">
                  <Stack spacing={3} fontFamily="'Oxanium', sans-serif">
                    <Text fontSize={{ base: "md", sm: "lg", md: "xl" }} fontWeight="bold" color={textColor} mb={1}>
                      HackNova &apos;26 — Rules & Workflow
                    </Text>

                    <Stack spacing={2.5} fontSize={{ base: "xs", sm: "sm", md: "md" }}>
                      <Text>
                        1. <chakra.span fontWeight="bold" color={primaryColor}>Step 1: Team Registration.</chakra.span> Register your squad (2–4 members) on the{" "}
                        <NextLink href="/hacknova-team" passHref>
                          <chakra.span color="#38D9A9" textDecoration="underline" cursor="pointer">
                            HackNova Team Registration
                          </chakra.span>
                        </NextLink>{" "}
                        before project submission.
                      </Text>
                      <Text>
                        2. <chakra.span fontWeight="bold" color={primaryColor}>Only the Team Leader</chakra.span> (whose payment is accepted on Pulzion EMS) can register the team.
                      </Text>
                      <Text>
                        3. Team details are permanently locked once registered.
                      </Text>
                      <Box>
                        <Text>4. For Step 2 Project Submission, upload all of the following:</Text>
                        <Stack spacing={1} pl={6} pt={1}>
                          <Text>• GitHub Repository Link</Text>
                          <Text>• Project ZIP File (upto 50MB)</Text>
                          <Text>• Presentation (PDF/PPT/PPTX upto 15MB)</Text>
                        </Stack>
                      </Box>
                      <Text>
                        5. Provide the correct project title matching your chosen problem statement.
                      </Text>
                      <Text>
                        6. <chakra.span fontWeight="bold" color={primaryColor}>Only one submission per team is allowed.</chakra.span>
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
                        All the best, HackNova participants!
                      </Text>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right Column: Project Submission Deliverables */}
          <GridItem minW={0} w="full">
            {/* Squad Status Banner (shown when squad is registered) */}
            {registeredTeam && (
              <Box
                mb={4}
                p={{ base: 3, sm: 3.5 }}
                bg="rgba(56, 217, 169, 0.08)"
                border="1px solid rgba(56, 217, 169, 0.4)"
                borderRadius="md"
              >
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", sm: "center" }}
                  wrap="wrap"
                  gap={2.5}
                >
                  <Flex align="center" gap={2} minW={0} maxW="100%">
                    <CheckCircleIcon color="#38D9A9" flexShrink={0} />
                    <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="#CBD5E1" wordBreak="break-word">
                      Registered Squad:{" "}
                      <chakra.span fontWeight="bold" color="#38D9A9">
                        {registeredTeam.team_name}
                      </chakra.span>
                    </Text>
                  </Flex>
                  <NextLink href="/hacknova-team" passHref>
                    <Button
                      as="a"
                      size="xs"
                      w={{ base: "full", sm: "auto" }}
                      variant="outline"
                      borderColor="#38D9A9"
                      color="#38D9A9"
                      fontFamily="'Oxanium', sans-serif"
                      fontSize="2xs"
                      _hover={{ bg: "rgba(56, 217, 169, 0.15)" }}
                    >
                      View Team Dossier →
                    </Button>
                  </NextLink>
                </Flex>
              </Box>
            )}

            {submission?.id || submission?.project_title ? (
              /* Project Already Submitted Card */
              <Box
                position="relative"
                p={{ base: 4, sm: 6, md: 8 }}
                bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 100%)"
                border="1px solid rgba(56, 217, 169, 0.5)"
                boxShadow="0 0 35px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
                borderRadius="md"
                overflow="hidden"
                maxW="100%"
              >
                {/* HUD Brackets */}
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
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5} wordBreak="break-word">
                        {submission.team_name}
                      </Text>
                    </Box>
                  )}

                  {submission.project_title && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Project Title
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5} wordBreak="break-word">
                        {submission.project_title}
                      </Text>
                    </Box>
                  )}

                  {submission.github_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)" maxW="100%">
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
                        mt={0.5}
                        maxW="100%"
                        _hover={{ textDecoration: "underline", color: "#38D9A9" }}
                      >
                        <Text as="span" wordBreak="break-all">
                          {submission.github_url}
                        </Text>
                        <ExternalLinkIcon mx="2px" flexShrink={0} />
                      </Link>
                    </Box>
                  )}

                  {submission.live_demo_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)" maxW="100%">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Live Demo URL
                      </Text>
                      <Link
                        href={submission.live_demo_url}
                        isExternal
                        color="#22D3EE"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1.5}
                        mt={0.5}
                        maxW="100%"
                        _hover={{ textDecoration: "underline", color: "#38D9A9" }}
                      >
                        <Text as="span" wordBreak="break-all">
                          {submission.live_demo_url}
                        </Text>
                        <ExternalLinkIcon mx="2px" flexShrink={0} />
                      </Link>
                    </Box>
                  )}

                  {submission.presentation_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)" maxW="100%">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Presentation Deck
                      </Text>
                      <Link
                        href={submission.presentation_url}
                        isExternal
                        color="#38D9A9"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1.5}
                        mt={0.5}
                        wordBreak="break-all"
                        maxW="100%"
                        _hover={{ textDecoration: "underline" }}
                      >
                        <DownloadIcon flexShrink={0} /> View / Download Presentation
                      </Link>
                    </Box>
                  )}

                  {submission.project_zip_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)" maxW="100%">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Project Archive (ZIP)
                      </Text>
                      <Link
                        href={submission.project_zip_url}
                        isExternal
                        color="#38D9A9"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1.5}
                        mt={0.5}
                        wordBreak="break-all"
                        maxW="100%"
                        _hover={{ textDecoration: "underline" }}
                      >
                        <DownloadIcon flexShrink={0} /> Download Project ZIP Archive
                      </Link>
                    </Box>
                  )}

                  {submission.notes && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Evaluator Notes
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
            ) : !isSubmissionActive ? (
              /* Submissions Closed Notice */
              <SubmissionClosedNotice eventName="HackNova" />
            ) : !registeredTeam ? (
              /* SQUAD REGISTRATION REQUIRED NOTICE */
              <Box
                position="relative"
                p={{ base: 3.5, sm: 6, md: 8 }}
                bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 100%)"
                border="1px solid rgba(245, 158, 11, 0.45)"
                boxShadow="0 0 35px rgba(245, 158, 11, 0.15), 0 12px 32px rgba(0, 0, 0, 0.85)"
                borderRadius="md"
                overflow="hidden"
                maxW="100%"
                boxSizing="border-box"
              >
                {/* 4 Corner HUD Brackets */}
                <Box position="absolute" top={{ base: "4px", sm: "6px" }} left={{ base: "4px", sm: "6px" }} w={{ base: "8px", sm: "10px" }} h={{ base: "8px", sm: "10px" }} borderLeft="2px solid #F59E0B" borderTop="2px solid #F59E0B" pointerEvents="none" />
                <Box position="absolute" top={{ base: "4px", sm: "6px" }} right={{ base: "4px", sm: "6px" }} w={{ base: "8px", sm: "10px" }} h={{ base: "8px", sm: "10px" }} borderRight="2px solid #F59E0B" borderTop="2px solid #F59E0B" pointerEvents="none" />
                <Box position="absolute" bottom={{ base: "4px", sm: "6px" }} left={{ base: "4px", sm: "6px" }} w={{ base: "8px", sm: "10px" }} h={{ base: "8px", sm: "10px" }} borderLeft="2px solid #F59E0B" borderBottom="2px solid #F59E0B" pointerEvents="none" />
                <Box position="absolute" bottom={{ base: "4px", sm: "6px" }} right={{ base: "4px", sm: "6px" }} w={{ base: "8px", sm: "10px" }} h={{ base: "8px", sm: "10px" }} borderRight="2px solid #F59E0B" borderBottom="2px solid #F59E0B" pointerEvents="none" />

                <Flex direction="column" align="center" textAlign="center" mb={{ base: 4, sm: 6 }} px={{ base: 1, sm: 2 }}>
                  <Flex
                    align="center"
                    justify="center"
                    w={{ base: "48px", sm: "56px" }}
                    h={{ base: "48px", sm: "56px" }}
                    rounded="full"
                    bg="rgba(245, 158, 11, 0.15)"
                    border="1px solid #F59E0B"
                    color="#F59E0B"
                    mb={{ base: 2.5, sm: 3.5 }}
                    boxShadow="0 0 25px rgba(245, 158, 11, 0.35)"
                    flexShrink={0}
                  >
                    <LockIcon w={{ base: 5, sm: 6 }} h={{ base: 5, sm: 6 }} />
                  </Flex>

                  <Badge
                    px={{ base: 2.5, sm: 3 }}
                    py={{ base: 0.5, sm: 1 }}
                    bg="rgba(245, 158, 11, 0.2)"
                    color="#F59E0B"
                    border="1px solid rgba(245, 158, 11, 0.5)"
                    fontFamily="'Oxanium', sans-serif"
                    fontSize={{ base: "3xs", sm: "2xs" }}
                    letterSpacing={{ base: "0.06em", sm: "0.15em" }}
                    whiteSpace="normal"
                    textAlign="center"
                    maxW="100%"
                    lineHeight="shorter"
                    mb={{ base: 2, sm: 2.5 }}
                    borderRadius="full"
                  >
                    STEP 1 INCOMPLETE &bull; SQUAD REGISTRATION REQUIRED
                  </Badge>

                  <chakra.h2
                    fontFamily="'United Colony', sans-serif !important"
                    fontSize={{ base: "md", sm: "xl", md: "2xl" }}
                    fontWeight="bold"
                    color="#FFFFFF"
                    letterSpacing={{ base: "0.04em", sm: "0.08em" }}
                    textTransform="uppercase"
                    lineHeight={{ base: "short", sm: "shorter" }}
                    wordBreak="break-word"
                    maxW="100%"
                  >
                    TEAM REGISTRATION REQUIRED
                  </chakra.h2>

                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
                    fontSize={{ base: "2xs", sm: "xs" }}
                    fontWeight="semibold"
                    color="#FCD34D"
                    letterSpacing={{ base: "0.04em", sm: "0.1em" }}
                    textTransform="uppercase"
                    lineHeight={{ base: "short", sm: "normal" }}
                    wordBreak="break-word"
                    maxW="100%"
                    mt={{ base: 1.5, sm: 1 }}
                  >
                    SUBMISSION WILL BE UNLOCKED AFTER SQUAD REGISTRATION
                  </chakra.p>
                </Flex>

                <Stack spacing={{ base: 3, sm: 4 }} fontFamily="'Oxanium', sans-serif">
                  <Box
                    p={{ base: 3, sm: 4 }}
                    rounded="md"
                    bg="rgba(7, 16, 36, 0.75)"
                    border="1px solid rgba(245, 158, 11, 0.25)"
                  >
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="#E2E8F0" lineHeight="tall" wordBreak="break-word">
                      According to HackNova regulations, you must register your team squad (2 to 4 members) before submitting your project deliverables. Submissions are only recorded for verified, registered teams.
                    </Text>
                  </Box>

                  {/* Two-step visual progression */}
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 2.5, sm: 3 }} my={1} w="full">
                    <Box
                      p={{ base: 3, sm: 3.5 }}
                      rounded="md"
                      bg="rgba(245, 158, 11, 0.1)"
                      border="1px solid rgba(245, 158, 11, 0.5)"
                      minW={0}
                      maxW="100%"
                      boxSizing="border-box"
                    >
                      <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                        <Badge bg="#F59E0B" color="#030512" fontSize={{ base: "3xs", sm: "2xs" }} fontWeight="bold" flexShrink={0}>
                          STEP 1
                        </Badge>
                        <Text fontSize={{ base: "2xs", sm: "xs" }} fontWeight="bold" color="#FCD34D" textTransform="uppercase" wordBreak="break-word">
                          Squad Registration
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "2xs", sm: "2xs" }} color="gray.300" lineHeight="tall" wordBreak="break-word">
                        Form your 2–4 member roster on the HackNova Team portal.
                      </Text>
                    </Box>

                    <Box
                      p={{ base: 3, sm: 3.5 }}
                      rounded="md"
                      bg="rgba(255, 255, 255, 0.03)"
                      border="1px dashed rgba(255, 255, 255, 0.2)"
                      opacity={0.7}
                      minW={0}
                      maxW="100%"
                      boxSizing="border-box"
                    >
                      <Flex align="center" gap={2} mb={1.5} wrap="wrap">
                        <Badge bg="gray.600" color="gray.300" fontSize={{ base: "3xs", sm: "2xs" }} fontWeight="bold" flexShrink={0}>
                          STEP 2
                        </Badge>
                        <Text fontSize={{ base: "2xs", sm: "xs" }} fontWeight="bold" color="gray.400" textTransform="uppercase" wordBreak="break-word">
                          Project Submission
                        </Text>
                      </Flex>
                      <Text fontSize={{ base: "2xs", sm: "2xs" }} color="gray.400" lineHeight="tall" wordBreak="break-word">
                        Submit GitHub repo, presentation (PPT/PDF), and ZIP archive.
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Actions */}
                  <Flex direction="column" gap={{ base: 2.5, sm: 3 }} pt={{ base: 1, sm: 2 }}>
                    {isSquadRegistrationActive ? (
                      <NextLink href="/hacknova-team" passHref>
                        <Button
                          as="a"
                          w="full"
                          h="auto"
                          minH={{ base: "44px", sm: "46px" }}
                          py={{ base: 2.5, sm: 3 }}
                          px={{ base: 3, sm: 4 }}
                          bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                          color="#030512"
                          fontFamily="'Oxanium', sans-serif"
                          fontSize={{ base: "xs", sm: "sm" }}
                          fontWeight="bold"
                          letterSpacing={{ base: "0.04em", sm: "0.1em" }}
                          textTransform="uppercase"
                          boxShadow="0 0 20px rgba(56, 217, 169, 0.35)"
                          whiteSpace="normal"
                          textAlign="center"
                          wordBreak="break-word"
                          lineHeight="short"
                          _hover={{
                            bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                            boxShadow: "0 0 30px rgba(56, 217, 169, 0.6)",
                          }}
                          rightIcon={<ArrowForwardIcon flexShrink={0} />}
                        >
                          Register Your Squad Now →
                        </Button>
                      </NextLink>
                    ) : (
                      <Box p={3} rounded="md" bg="rgba(239, 68, 68, 0.1)" border="1px solid rgba(239, 68, 68, 0.4)" textAlign="center">
                        <Text fontSize="xs" color="#FCA5A5">
                          HackNova Squad Registrations are currently closed by event coordinators.
                        </Text>
                      </Box>
                    )}

                    <Button
                      w="full"
                      h="auto"
                      minH={{ base: "40px", sm: "42px" }}
                      py={{ base: 2, sm: 2.5 }}
                      px={{ base: 3, sm: 4 }}
                      variant="outline"
                      borderColor="rgba(245, 158, 11, 0.4)"
                      color="#FCD34D"
                      fontFamily="'Oxanium', sans-serif"
                      fontSize={{ base: "2xs", sm: "xs" }}
                      letterSpacing={{ base: "0.04em", sm: "0.08em" }}
                      textTransform="uppercase"
                      whiteSpace="normal"
                      textAlign="center"
                      wordBreak="break-word"
                      lineHeight="short"
                      _hover={{
                        bg: "rgba(245, 158, 11, 0.15)",
                        borderColor: "#F59E0B",
                      }}
                      onClick={handleRefreshStatus}
                      isLoading={refreshingStatus}
                      leftIcon={<RepeatIcon flexShrink={0} />}
                    >
                      Re-check Squad Registration Status
                    </Button>
                  </Flex>
                </Stack>
              </Box>
            ) : (
              /* Submission Form */
              <Box
                position="relative"
                p={{ base: 4, sm: 5, md: 7 }}
                bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 100%)"
                border="1px solid rgba(56, 217, 169, 0.35)"
                boxShadow="0 12px 32px rgba(0, 0, 0, 0.85)"
                borderRadius="md"
                overflow="hidden"
                maxW="100%"
              >
                {/* 4 Corner HUD Brackets */}
                <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
                <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

                <Box mb={{ base: 3, sm: 5 }}>
                  <chakra.h2
                    fontFamily="'United Colony', sans-serif !important"
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
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
                  initialValues={{
                    ...initialFormValues,
                    team_name: registeredTeam?.team_name || initialFormValues.team_name,
                  }}
                  enableReinitialize
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ handleBlur, handleChange, values, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                          <Box>
                            <FormField
                              label="Squad Name (Locked) *"
                              name="team_name"
                              placeholder="e.g. CyberNovas"
                              value={registeredTeam?.team_name || values.team_name}
                              isReadOnly={true}
                              readOnly={true}
                              cursor="not-allowed"
                              opacity={0.9}
                            />
                            <Text fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#38D9A9" mt={1}>
                              ✓ Locked to registered squad: {registeredTeam.team_name}
                            </Text>
                          </Box>
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
                            isLoading={loading}
                            loadingText="Submitting Project..."
                            bg={primaryColor}
                            hoverBg={primaryGlow}
                          />
                        </Box>
                      </Stack>
                    </form>
                  )}
                </Formik>
              </Box>
            )}
          </GridItem>
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader text={loadingText} />
  );
};

export default privateUserRoute(Hacknova, "hacknova");
