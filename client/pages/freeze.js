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
  Image,
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
  DownloadIcon,
} from "@chakra-ui/icons";

const Freeze = () => {
  // Use theme tokens
  const theme = useTheme();
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const tabBg = useColorModeValue("background.200", "background.200");
  const primaryColor = theme.colors.primary[400];
  const primaryGlow = theme.colors.primary[200];

  const [submission, setSubmission] = useState(null);
  const [isSubmissionActive, setIsSubmissionActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("INITIALIZING FREEZE THE SECOND...");
  const [tabIndex, setTabIndex] = useState(0);

  const initialFormValues = {
    photo_title: "",
    camera_device: "",
    description: "",
    file: {},
  };

  const validationSchema = Yup.object().shape({
    photo_title: Yup.string().trim().required("Photo title is required"),
    camera_device: Yup.string().trim().required("Camera/device name is required"),
    description: Yup.string().trim(),
  });

  const handleSubmit = async (values) => {
    if (!isSubmissionActive) {
      toast.error("Submissions for Freeze the Second are currently closed. Entries cannot be submitted or stored in the database.");
      return;
    }

    if (!values?.photo_title?.trim()) {
      toast.error("Please enter your Photo Title");
      return;
    }
    if (!values?.camera_device?.trim()) {
      toast.error("Please enter the Camera or Device used");
      return;
    }
    if (!values?.file?.name) {
      toast.error("Please select a photograph to upload");
      return;
    }

    if (values?.file?.size && values.file.size > 35 * 1024 * 1024) {
      toast.error("Photograph exceeds 35MB size limit");
      return;
    }

    try {
      setLoadingText("UPLOADING PHOTOGRAPH & SUBMITTING ENTRY...");
      setLoading(true);
      toast.info("Uploading photograph to S3...");
      const photoData = await uploadFile(values.file);
      if (photoData?.error || !photoData?.submission) {
        toast.error("Failed to upload photograph. Please try again.");
        setLoading(false);
        return;
      }

      const payload = {
        submission: photoData.submission,
        photo_url: photoData.submission,
        photo_title: values.photo_title.trim(),
        camera_device: values.camera_device.trim(),
        description: values.description?.trim() || "",
      };

      toast.info("Submitting photo entry...");
      const entryData = await submitEntries(payload, "freeze");
      if (entryData?.error) {
        toast.error(entryData.error);
        setLoading(false);
        return;
      }

      setSubmission(entryData.submission || payload);
      toast.success("Photograph Submitted Successfully! 📸");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while submitting. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries("freeze");
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
      <Box pt={10} width="full" pb="40px" px={{ base: 4, sm: 6, md: 12, lg: 16 }}>
        <NextLink href="/dashboard">
          <chakra.h3
            fontWeight="bold"
            fontSize={{ base: 'sm', md: 'md' }}
            fontFamily="'Inter', sans-serif"
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
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
          fontFamily="'Orbitron', sans-serif !important"
          letterSpacing="0.05em"
          textTransform="uppercase"
          fontWeight="bold"
          color={textColor}
          textShadow={`0 0 4px ${primaryGlow}, 0 0 6px ${primaryGlow}`}
        >
          Freeze the Second
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10}>
          {/* Left Column: Theme and Instructions */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={{ base: 'sm', sm: 'md' }} fontFamily="'Inter', sans-serif">Theme</Tab>
                <Tab fontSize={{ base: 'sm', sm: 'md' }} fontFamily="'Inter', sans-serif">Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg}>
                {/* Tab 1: Theme Details */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      Theme: Candid Canvas
                    </Text>
                    <Text fontSize="md" lineHeight="tall">
                      Capture human emotions, expressions, and interactions through candid photography of campus life.
                    </Text>
                    <Box mt={2}>
                      <Text fontSize="md" fontWeight="semibold" color={primaryColor} mb={1}>
                        Category Guidelines:
                      </Text>
                      <Stack spacing={1.5} pl={4}>
                        <Text fontSize="sm">• Human Emotions & Expressions</Text>
                        <Text fontSize="sm">• Candid Campus Interactions</Text>
                        <Text fontSize="sm">• Everyday Moments & Stories</Text>
                      </Stack>
                    </Box>
                    <Box mt={2}>
                      <Text fontSize="md" fontWeight="semibold" color={primaryColor} mb={1}>
                        Photography Guidelines:
                      </Text>
                      <Stack spacing={1.5} pl={4}>
                        <Text fontSize="sm">• One original photograph captured on campus.</Text>
                        <Text fontSize="sm">• Genuine, unposed moments encouraged.</Text>
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>

                {/* Tab 2: Submission Rules */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor} mb={1}>
                      Freeze the Second — Submission Rules
                    </Text>

                    <Stack spacing={2.5} fontSize="md">
                      <Text>
                        1. <chakra.span fontWeight="bold" color={primaryColor}>Strictly only one photograph</chakra.span> per participant is permitted.
                      </Text>
                      <Text>
                        2. The photograph must be in <chakra.span fontWeight="bold" color={primaryColor}>JPG, JPEG, or PNG</chakra.span> format (max 35MB).
                      </Text>
                      <Text>
                        3. Obtain consent from any recognizable individuals in your photograph.
                      </Text>
                      <Text>
                        4. Minor color correction and crop adjustments are permitted; AI-generated images or heavy digital composites will be disqualified.
                      </Text>
                      <Text>
                        5. <chakra.span fontWeight="bold" color={primaryColor}>Submissions once made cannot be replaced or re-submitted.</chakra.span> Please review your photograph carefully before final confirmation.
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
                        All the best, photographers! Capture the extraordinary.
                      </Text>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Right Column: Submission Form OR Submission Record */}
          {submission?.id || submission?.submission ? (
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
                    fontFamily="'Orbitron', sans-serif !important"
                    fontSize={{ base: "xl", sm: "2xl" }}
                    fontWeight="bold"
                    color="#FFFFFF"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    PHOTO SUBMITTED SUCCESSFULLY
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Inter', sans-serif"
                    fontSize="xs"
                    color="gray.400"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    FREEZE THE SECOND &bull; RECORD LOCKED
                  </chakra.p>
                </Flex>

                {/* Submission Details from Backend Controller */}
                <Stack spacing={4} fontFamily="'Inter', sans-serif">
                  {/* Photo Preview */}
                  {submission.submission && (
                    <Box
                      p={2}
                      rounded="md"
                      bg="rgba(7, 16, 36, 0.7)"
                      border="1px solid rgba(56, 217, 169, 0.35)"
                      textAlign="center"
                    >
                      <Image
                        src={submission.submission}
                        alt={submission.photo_title || "Submitted Photograph"}
                        maxH="280px"
                        w="auto"
                        mx="auto"
                        rounded="md"
                        objectFit="contain"
                      />
                    </Box>
                  )}

                  {submission.photo_title && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Photo Title / Caption
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.photo_title}
                      </Text>
                    </Box>
                  )}

                  {/* {submission.camera_device && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Camera / Device Used
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.camera_device}
                      </Text>
                    </Box>
                  )} */}

                  {submission.description && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Story & Technical Description
                      </Text>
                      <Text fontSize="sm" color="gray.300" mt={0.5} whiteSpace="pre-wrap">
                        {submission.description}
                      </Text>
                    </Box>
                  )}

                  {submission.submission && (
                    <Box pt={2}>
                      <Link
                        href={submission.submission}
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
                        <DownloadIcon /> Download Original Photograph
                      </Link>
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
                      Strictly only one photograph per participant is permitted. If you require any updates, please contact the Freeze the Second event coordinators.
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </GridItem>
          ) : !isSubmissionActive ? (
            /* Submissions Closed Notice */
            <GridItem>
              <SubmissionClosedNotice eventName="Freeze the Second" />
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
                    fontFamily="'Orbitron', sans-serif !important"
                    fontSize={{ base: "xl", sm: "2xl" }}
                    fontWeight="bold"
                    color="#FFFFFF"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    PHOTO SUBMISSION PORTAL
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Inter', sans-serif"
                    fontSize="xs"
                    color="#22D3EE"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mt={1}
                  >
                    PHOTOGRAPHY CONTEST &bull; VERIFIED PARTICIPANT
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
                            label="Photo Title / Caption (If Not Applicable Enter NA)"
                            name="photo_title"
                            placeholder="e.g. celebration"
                            value={values.photo_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {/* <FormField
                            label="Camera / Device Used *"
                            name="camera_device"
                            placeholder="e.g. Sony A7 IV / iPhone 15 Pro"
                            value={values.camera_device}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          /> */}
                        </SimpleGrid>

                        <FileInput
                          accept="image/jpeg,image/png,image/jpg"
                          label="Upload Photograph (JPG, JPEG, PNG upto 35MB) *"
                          name="file"
                          onBlur={handleBlur}
                        />

                        <FormControl id="description">
                          <FormLabel
                            fontFamily="'Inter', sans-serif"
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            color="#38D9A9"
                            mb={1.5}
                          >
                            Description (Optional)
                          </FormLabel>
                          <Textarea
                            name="description"
                            placeholder="Story behind the shot, Camera settings (ISO, Shutter speed, Aperture), or lighting notes"
                            rows={3}
                            fontFamily="'Inter', sans-serif"
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
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormControl>

                        <Box pt={2}>
                          <ButtonWithModal
                            handleSubmit={() => handleSubmit(values)}
                            isLoading={loading}
                            loadingText="Submitting Photo..."
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

export default privateUserRoute(Freeze, "freeze");
