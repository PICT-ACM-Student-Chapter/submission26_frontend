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
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const trackOptions = [
    { label: "Open Innovation (General Track)", value: "Open Innovation" },
    {
      label: "Climate Change Mitigation & Sustainability",
      value: "Climate Change Mitigation & Sustainability",
    },
    { label: "Healthcare & Wellbeing", value: "Healthcare & Wellbeing" },
    { label: "Trust in the Age of AI", value: "Trust in the Age of AI" },
  ];

  const initialFormValues = {
    team_name: "",
    track: "Open Innovation",
    video_pitch_url: "",
    ppt: {},
  };

  const validationSchema = Yup.object().shape({
    team_name: Yup.string().trim().required("Team name is required"),
    track: Yup.string().trim().required("Track selection is required"),
    video_pitch_url: Yup.string()
      .trim()
      .url("Enter a valid URL (e.g. https://youtu.be/... or Loom link)")
      .nullable(),
  });

  const handleSubmit = async (values) => {
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
        video_pitch_url: values.video_pitch_url?.trim() || "",
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
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries("innowave");
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
          Innowave
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10}>
          {/* Left Column: Tracks and Instructions */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>Tracks</Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg}>
                {/* Tab 1: Event Tracks */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      Event Tracks:
                    </Text>
                    <Box pl={2}>
                      <Stack spacing={3}>
                        <Box>
                          <Text fontSize="md" fontWeight="bold" color={primaryColor}>
                            1. Open Innovation (General Track)
                          </Text>
                          <Text fontSize="sm" color="gray.300">
                            Disruptive, cross-industry solutions addressing emerging challenges.
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="md" fontWeight="bold" color={primaryColor}>
                            2. Climate Change Mitigation & Sustainability
                          </Text>
                          <Text fontSize="sm" color="gray.300">
                            Clean energy, circular economy, waste reduction, and carbon capture initiatives.
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="md" fontWeight="bold" color={primaryColor}>
                            3. Healthcare & Wellbeing
                          </Text>
                          <Text fontSize="sm" color="gray.300">
                            Digital health platforms, predictive diagnostics, and accessibility innovations.
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="md" fontWeight="bold" color={primaryColor}>
                            4. Trust in the Age of AI
                          </Text>
                          <Text fontSize="sm" color="gray.300">
                            AI governance, ethical tech, fraud detection, and explainable models.
                          </Text>
                        </Box>
                      </Stack>
                    </Box>

                    <Text fontSize="sm" color="gray.400" mt={2}>
                      Note: Each team must pick a single track to present their idea in.
                    </Text>
                  </Stack>
                </TabPanel>

                {/* Tab 2: Submission Rules */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor} mb={1}>
                      💡 Innowave &apos;26 — Submission Rules
                    </Text>

                    <Stack spacing={2.5} fontSize="md">
                      <Text>
                        1. All team members must be from the same organization or institute, but they can be from different academic years.
                      </Text>
                      <Text>
                        2. Interdisciplinary teams can participate.
                      </Text>
                      <Text>
                        3. Modification of team post registration will not be allowed.
                      </Text>
                      <Text>
                        4. Submit presentation pitch deck strictly in <chakra.span fontWeight="bold" color={primaryColor}>PPT, PPTX, or PDF</chakra.span> format (max 50MB).
                      </Text>
                      <Text>
                        5. Each team must pick a single track to present their idea in.
                      </Text>
                      <Text>
                        6. <chakra.span fontWeight="bold" color={primaryColor}>Only the Team Leader</chakra.span> must submit for the team.
                      </Text>
                      <Text>
                        7. Unlisted video pitch link (YouTube / Loom / Google Drive) is optional but recommended.
                      </Text>
                      <Text>
                        8. The decision of the judges will be considered final and binding on all participants.
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

                  {(submission.Innowave_type || submission.track) && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Event Track
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.Innowave_type || submission.track}
                      </Text>
                    </Box>
                  )}

                  {submission.video_pitch_url && (
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
                        gap={1.5}
                        wordBreak="break-all"
                        _hover={{ textDecoration: "underline" }}
                        mt={0.5}
                      >
                        {submission.video_pitch_url} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                  )}

                  {/* Download Pitch Deck Link */}
                  {(submission.submission || submission.deck_url) && (
                    <Box pt={2}>
                      <Link
                        href={submission.submission || submission.deck_url}
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
                        <DownloadIcon /> Download Pitch Deck (PPT / PDF)
                      </Link>
                    </Box>
                  )}

                  {submission.changelog && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Round 2 Changelog
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

                        <FormField
                          label="Video Pitch Link (Optional)"
                          name="video_pitch_url"
                          placeholder="https://youtu.be/... or Loom URL"
                          value={values.video_pitch_url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <FileInput
                          accept=".ppt,.pptx,.pdf"
                          label="Presentation Pitch Deck (PPT, PPTX, PDF upto 50MB) *"
                          name="ppt"
                          onBlur={handleBlur}
                        />

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

export default privateUserRoute(Innowave);
