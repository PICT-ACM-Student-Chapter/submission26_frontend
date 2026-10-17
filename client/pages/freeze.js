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
  const [loading, setLoading] = useState(true);
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
          Freeze the Second
        </chakra.h1>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10}>
          {/* Left Column: Theme and Instructions */}
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>Theme</Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={tabBg}>
                {/* Tab 1: Theme Details */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      Theme: Capture What Others Miss
                    </Text>
                    <Text fontSize="md" lineHeight="tall">
                      Freeze the Second is an online photography contest celebrating visual storytelling. Showcase stunning moments, dynamic lighting, and creative perspectives through your lens.
                    </Text>
                    <Box mt={2}>
                      <Text fontSize="md" fontWeight="semibold" color={primaryColor} mb={1}>
                        Evaluation Criteria:
                      </Text>
                      <Stack spacing={1.5} pl={4}>
                        <Text fontSize="sm">• Composition, framing, and visual balance</Text>
                        <Text fontSize="sm">• Creative perspective and originality</Text>
                        <Text fontSize="sm">• Lighting, shadows, and color tonality</Text>
                        <Text fontSize="sm">• Storytelling essence and emotional impact</Text>
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>

                {/* Tab 2: Submission Rules */}
                <TabPanel color="hsl(210, 40%, 100%)">
                  <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor} mb={1}>
                      📸 Freeze the Second &apos;26 — Submission Rules
                    </Text>

                    <Stack spacing={2.5} fontSize="md">
                      <Text>
                        1. <chakra.span fontWeight="bold" color={primaryColor}>Strictly only one photograph</chakra.span> per participant is permitted.
                      </Text>
                      <Text>
                        2. Photographs must be taken by the submitting individual. Images should not be sourced from the internet or captured by others.
                      </Text>
                      <Text>
                        3. Acceptable formats: strictly <chakra.span fontWeight="bold" color={primaryColor}>JPG, JPEG, or PNG</chakra.span> (max size 35MB).
                      </Text>
                      <Text>
                        4. Provide the photo title, camera/device used, and optional EXIF settings or story.
                      </Text>
                      <Text>
                        5. Minor color correction and crop adjustments are permitted; heavy manipulation or AI generation is strictly prohibited.
                      </Text>
                      <Text>
                        6. Any use of unfair means will result in immediate disqualification.
                      </Text>
                      <Text>
                        7. The organizers&apos; decisions are final and binding for all participants.
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
                        All the best, Freeze the Second photographers! 📸
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
                    fontFamily="'United Colony', sans-serif !important"
                    fontSize={{ base: "xl", sm: "2xl" }}
                    fontWeight="bold"
                    color="#FFFFFF"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    PHOTO SUBMITTED SUCCESSFULLY
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
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
                <Stack spacing={4} fontFamily="'Oxanium', sans-serif">
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

                  {submission.camera_device && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Camera / Device Used
                      </Text>
                      <Text fontSize="md" color="#FFFFFF" fontWeight="semibold" mt={0.5}>
                        {submission.camera_device}
                      </Text>
                    </Box>
                  )}

                  {submission.description && (
                    <Box p={3} rounded="md" bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.08)">
                      <Text fontSize="10px" color="#38D9A9" fontWeight="bold" letterSpacing="0.15em" textTransform="uppercase">
                        Description / Story & EXIF Settings
                      </Text>
                      <Text fontSize="sm" color="gray.300" mt={0.5} whiteSpace="pre-wrap">
                        {submission.description}
                      </Text>
                    </Box>
                  )}

                  {/* Download Original Photo Link */}
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
                    PHOTO SUBMISSION PORTAL
                  </chakra.h2>
                  <chakra.p
                    fontFamily="'Oxanium', sans-serif"
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
                            label="Photo Title / Caption *"
                            name="photo_title"
                            placeholder="e.g. Monochrome Reflections"
                            value={values.photo_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <FormField
                            label="Camera / Device Used *"
                            name="camera_device"
                            placeholder="e.g. Sony A7 IV / iPhone 15 Pro"
                            value={values.camera_device}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </SimpleGrid>

                        <FileInput
                          accept="image/jpeg,image/png,image/jpg"
                          label="Upload Photograph (JPG, JPEG, PNG upto 35MB) *"
                          name="file"
                          onBlur={handleBlur}
                        />

                        <FormControl id="description">
                          <FormLabel
                            fontFamily="'Oxanium', sans-serif"
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            color="#38D9A9"
                            mb={1.5}
                          >
                            Description / EXIF Settings & Story (Optional)
                          </FormLabel>
                          <Textarea
                            name="description"
                            placeholder="Camera settings (ISO, Shutter speed, Aperture), story behind the shot, or lighting notes"
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
                            value={values.description}
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

export default privateUserRoute(Freeze);
