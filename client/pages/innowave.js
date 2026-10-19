import {
  Box,
  Button,
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
import * as Yup from "yup";
import { toast } from "react-toastify";
import NextLink from "next/link";
import FileInput from "../components/FileInput";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import { uploadFile } from "../action/uploadFile";
import ButtonWithModal from "../components/ButtonWithModal";
import { getEntries, submitEntries } from "../action/entries";
import ContentLoader from "../components/ContentLoader";
import SubmissionClosedNotice from "../components/SubmissionClosedNotice";
import { getInnoWaveTeamMe, getInnoWaveTeamRegistrationStatus } from "../action/innowaveTeam";
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

const Innowave = () => {
  // Use theme tokens
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const tabBg = useColorModeValue("background.200", "background.200");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];

  const [submission, setSubmission] = useState(null);
  const [isSubmissionActive, setIsSubmissionActive] = useState(true);
  const [isTeamRegistrationActive, setIsTeamRegistrationActive] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("INITIALIZING INNOWAVE PORTAL...");
  const [tabIndex, setTabIndex] = useState(0);

   const trackOptions = [
    { label: "Open Innovation (General Track)", value: "Open Innovation" },
    {
      label: " Future Tech (2026 Edition)",
      value: "Future Tech (2026 Edition)",
    },
    { label: "Industry & Enterprise", value: "Industry & Enterprise" },
    { label: "Social Impact", value: "Social Impact" },
  ];

  const initialFormValues = {
    team_name: "",
    track: "Open Innovation",
    ppt: {},
  };

  const validationSchema = Yup.object().shape({
    team_name: Yup.string().trim().required("Team name is required"),
    track: Yup.string().trim().required("Track selection is required"),
    // video_pitch_url: Yup.string()
    //   .trim()
    //   .url("Enter a valid URL (e.g. https://youtu.be/... or Loom link)")
    //   .nullable(),
  });

  const handleSubmit = async (values) => {
    if (!isSubmissionActive) {
      toast.error("Submissions for Innowave are currently closed. Entries cannot be submitted or stored in the database.");
      return;
    }

    if (!values?.team_name?.trim()) {
      toast.error("Please enter your Team Name");
      return;
    }
    if (!values?.track?.trim()) {
      toast.error("Please select an Event Track");
      return;
    }
    if (!values?.ppt?.name) {
      toast.error("Please select your Presentation Pitch Deck (PPT/PPTX/PDF)");
      return;
    }

    if (values?.ppt?.size && values.ppt.size > 50 * 1024 * 1024) {
      toast.error("Presentation deck exceeds 50MB limit");
      return;
    }

    try {
      setLoadingText("UPLOADING PITCH DECK & SUBMITTING ENTRY...");
      setLoading(true);
      toast.info("Uploading pitch deck to S3...");
      const deckData = await uploadFile(values.ppt);
      if (deckData?.error || !deckData?.submission) {
        toast.error("Failed to upload pitch deck. Please try again.");
        setLoading(false);
        return;
      }

      const payload = {
        submission: deckData.submission,
        deck_url: deckData.submission,
        team_name: values.team_name.trim(),
        track: values.track || "Open Innovation",
        Innowave_type: values.track || "Open Innovation",
        // video_pitch_url: values.video_pitch_url?.trim() || "",
      };

      toast.info("Submitting Innowave entry...");
      const entryData = await submitEntries(payload, "innowave");
      if (entryData?.error) {
        toast.error(entryData.error);
        setLoading(false);
        return;
      }

      setSubmission(entryData.submission || payload);
      toast.success("Innowave Idea Deck Submitted Successfully! 💡");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while submitting. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entryData = await getEntries("innowave");
        if (entryData?.error) console.log(entryData?.error);
        setSubmission(entryData?.submission);
        if (entryData?.submission_active !== undefined) {
          setIsSubmissionActive(Boolean(entryData.submission_active));
        } else if (entryData?.event_status !== undefined) {
          setIsSubmissionActive(Boolean(entryData.event_status));
        }

        // Fetch team registration info quietly to prefill team name if available
        const teamData = await getInnoWaveTeamMe();
        if (teamData?.team) {
          setRegisteredTeam(teamData.team);
        }

        // Fetch InnoWave team registration portal status (Event ID 201, route /innowave-team)
        const teamRegStatus = await getInnoWaveTeamRegistrationStatus();
        setIsTeamRegistrationActive(Boolean(teamRegStatus.status || teamRegStatus.is_active));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return !loading ? (
    <Layout>
      <Box pt={10} width="full" pb="40px" px={{ base: 4, sm: 6, md: 12, lg: 16 }}>
        {/* Top Header Navigation */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={3} mb={2}>
          <NextLink href="/dashboard" passHref>
            <chakra.h3
              fontWeight="bold"
              fontSize={{ base: 18, sm: 22 }}
              textTransform="uppercase"
              color={primaryColor}
              cursor="pointer"
              display="flex"
              alignItems="center"
              fontFamily="'Oxanium', sans-serif"
            >
              <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
            </chakra.h3>
          </NextLink>
        </Flex>

        <chakra.h1
          py={4}
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}
          fontFamily="'United Colony', sans-serif !important"
          letterSpacing="0.05em"
          textTransform="uppercase"
        >
          Innowave
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} alignItems="start">
          {/* Left Column: Tracks and Instructions */}
          <GridItem>
            {/* Squad Status Banner */}
            {registeredTeam ? (
              <Box
                mb={4}
                p={3.5}
                bg="rgba(56, 217, 169, 0.08)"
                border="1px solid rgba(56, 217, 169, 0.4)"
                borderRadius="md"
              >
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Flex align="center" gap={2}>
                    <CheckCircleIcon color="#38D9A9" />
                    <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="#CBD5E1">
                      Registered Team:{" "}
                      <chakra.span fontWeight="bold" color="#38D9A9">
                        {registeredTeam.team_name}
                      </chakra.span>
                    </Text>
                  </Flex>
                  <NextLink href="/innowave-team" passHref>
                    <Button
                      as="a"
                      size="xs"
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
            ) : isTeamRegistrationActive ? (
              <Box
                mb={4}
                p={3.5}
                bg="rgba(34, 211, 238, 0.08)"
                border="1px solid rgba(34, 211, 238, 0.35)"
                borderRadius="md"
              >
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Text fontFamily="'Oxanium', sans-serif" fontSize="s" color="#ebf1f2">
                    Need to register or verify your team?
                  </Text>
                  <NextLink href="/innowave-team" passHref>
                    <Button
                      as="a"
                      size="sm"
                      bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                      color="#030512"
                      fontFamily="'Oxanium', sans-serif"
                      fontSize="xs"
                      fontWeight="bold"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      _hover={{
                        bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                      }}
                      whiteSpace="nowrap"
                    >
                      Register Team →
                    </Button>
                  </NextLink>
                </Flex>
              </Box>
            ) : null}

            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={{ base: 'sm', sm: 'md' }} fontFamily="'Oxanium', sans-serif">Tracks</Tab>
                <Tab fontSize={{ base: 'sm', sm: 'md' }} fontFamily="'Oxanium', sans-serif">Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg}>
                {/* Tab 1: Tracks */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      Tracks:
                    </Text>
                    <Stack spacing={2} pl={4}>
                      <Text fontSize="md">
                        1.  Future Tech (2026 Edition):
                      </Text>
                      <Text fontSize="sm" color="gray.300" pl={4}>
                        Ideas where an emerging technology is central to the innovation, including AI agents, multimodal and on-device AI, robotics, AI + hardware, AR/VR, drones and other frontier technologies.
                      </Text>

                      <Text fontSize="md">2. Industry & Enterprise:</Text>
                      <Text fontSize="sm" color="gray.300" pl={4}>
                        Solutions built for businesses rather than individuals - B2B SaaS, enterprise software, manufacturing, logistics, supply chain, cybersecurity, FinTech and business automation. 
                      </Text>

                      <Text fontSize="md">3. Social Impact:</Text>
                      <Text fontSize="sm" color="gray.300" pl={4}>
                        Solutions addressing human, societal or environmental problems, healthcare, agriculture, sustainability, accessibility, education, climate, public welfare and NGOs.
                      </Text>

                      <Text fontSize="md">4. Open Innovation:</Text>
                      <Text fontSize="sm" color="gray.300" pl={4}>
                        Anything that does not fit neatly elsewhere, consumer apps, gaming, the creator economy, sports, entertainment, travel, lifestyle and genuinely unusual ideas.
                      </Text>
                    </Stack>
                    <Text fontSize="sm" color="gray.400" mt={2}>
                      Note: Each team must pick a single track to present their idea in.
                    </Text>
                  </Stack>
                </TabPanel>

                {/* Tab 2: Submission Rules */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor} mb={1}>
                      Innowave — Round 1 Submission Rules
                    </Text>

                    <Stack spacing={2.5} fontSize="md">
                      <Text>
                        1. Team members can be from different academic years and branches.
                      </Text>
                      <Text>
                        2. Team composition cannot be changed after registration. 
                      </Text>
                      <Text>
                        3. Only the Team Leader submits on behalf of the team. One submission per team. 
                      </Text>
                      <Text>
                        4. Your deck must use the <chakra.span fontWeight="bold" color={primaryColor}>official Innowave template</chakra.span> — 10 slides maximum, including the title slide. Submissions in other formats may not be evaluated. 
                      </Text>
                      <Text>
                        5. Upload the deck as PPT, PPTX or PDF (max 50MB).
                      </Text>
                      <Text>
                        6. All the team members must be present during the final presentation; otherwise, their entry will be disqualified. 
                      </Text>
                      <Text>
                        7. Late or incomplete submissions will not be considered. 
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
                        All the best, Innowave innovators! 💡
                      </Text>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right Column: Submission Form OR Submission Record */}
          {submission?.id || submission?.submission || submission?.team_name ? (
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
                    IDEA DECK SUBMITTED SUCCESSFULLY
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
                    fontSize="xs"
                    color="gray.400"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    INNOWAVE &bull; RECORD LOCKED
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

                  {(submission.track || submission.innowave_type) && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Selected Track
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.track || submission.innowave_type}
                      </Text>
                    </Box>
                  )}

                  {submission.submission && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Uploaded Pitch Deck
                      </Text>
                      <Link
                        href={submission.submission}
                        isExternal
                        color="#38D9A9"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1.5}
                        mt={0.5}
                        _hover={{ textDecoration: "underline" }}
                      >
                        <DownloadIcon /> Download Pitch Deck File
                      </Link>
                    </Box>
                  )}

                  {/* {submission.video_pitch_url && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Video Pitch Link
                      </Text>
                      <Link
                        href={submission.video_pitch_url}
                        isExternal
                        color="#22D3EE"
                        fontSize="sm"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                        mt={0.5}
                        _hover={{ textDecoration: "underline", color: "#38D9A9" }}
                      >
                        {submission.video_pitch_url} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                  )} */}

                  {submission.changelog && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Changelog / Updates
                      </Text>
                      <Text fontSize="sm" color="gray.300" mt={0.5} whiteSpace="pre-wrap">
                        {submission.changelog}
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
                      Only one submission per team is permitted. If you require any updates, please contact the Innowave event coordinators.
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </GridItem>
          ) : !isSubmissionActive ? (
            /* Submissions Closed Notice */
            <GridItem>
              <SubmissionClosedNotice eventName="Innowave" />
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
                    IDEA DECK SUBMISSION PORTAL
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
                    fontSize="xs"
                    color="#22D3EE"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    INNOWAVE &apos;26 &bull; ROUND 1 DELIVERABLES
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
                            placeholder="e.g. InnoVision"
                            value={values.team_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <SelectField
                            label="Event Track *"
                            name="track"
                            options={trackOptions}
                            value={values.track}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </SimpleGrid>

                        {/* <FormField
                          label="Video Pitch Link (Optional)"
                          name="video_pitch_url"
                          placeholder="https://youtu.be/... or Loom URL"
                          value={values.video_pitch_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        /> */}

                        <FileInput
                          accept=".ppt,.pptx,.pdf"
                          label="Presentation Pitch Deck (PPTX/PDF upto 50MB) *"
                          name="ppt"
                          onBlur={handleBlur}
                        />

                        <Box pt={2}>
                          <ButtonWithModal
                            handleSubmit={() => handleSubmit(values)}
                            isLoading={loading}
                            loadingText="Submitting Entry..."
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
    <ContentLoader text={loadingText} />
  );
};

export default privateUserRoute(Innowave, "innowave");