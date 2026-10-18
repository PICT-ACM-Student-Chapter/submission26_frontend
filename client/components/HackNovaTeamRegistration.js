import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  chakra,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import {
  LockIcon,
  CheckCircleIcon,
  AddIcon,
  DeleteIcon,
  WarningIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { getHackNovaTeamMe, postHackNovaTeam } from "../action/hacknovaTeam";
import SubmissionClosedNotice from "./SubmissionClosedNotice";

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && re.test(email.trim());
};

const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

const HackNovaTeamRegistration = ({ onTeamLoaded, onTeamRegistered }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamState, setTeamState] = useState(null);

  // Form State
  const [teamName, setTeamName] = useState("");
  const [member2, setMember2] = useState({ name: "", email: "", phone: "" });
  const [showMember3, setShowMember3] = useState(false);
  const [member3, setMember3] = useState({ name: "", email: "", phone: "" });
  const [showMember4, setShowMember4] = useState(false);
  const [member4, setMember4] = useState({ name: "", email: "", phone: "" });

  const [formErrors, setFormErrors] = useState({});

  // Confirmation Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const data = await getHackNovaTeamMe();
      if (data?.error && !data?.leader) {
        toast.error(data.error);
      }
      setTeamState(data);
      if (data?.team && onTeamLoaded) {
        onTeamLoaded(data.team);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch team information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!teamName.trim()) {
      errors.teamName = "Team name is required.";
    } else if (teamName.trim().length < 2 || teamName.trim().length > 255) {
      errors.teamName = "Team name must be between 2 and 255 characters.";
    }

    // Member 2
    if (!member2.name.trim()) errors.m2Name = "Member 2 name is required.";
    if (!member2.email.trim()) {
      errors.m2Email = "Member 2 email is required.";
    } else if (!isValidEmail(member2.email)) {
      errors.m2Email = "Enter a valid email address.";
    }
    if (!member2.phone.trim()) {
      errors.m2Phone = "Member 2 phone is required.";
    } else if (!isValidPhone(member2.phone)) {
      errors.m2Phone = "Enter a valid 7-15 digit phone number.";
    }

    // Member 3 (if active)
    if (showMember3) {
      if (!member3.name.trim()) errors.m3Name = "Member 3 name is required.";
      if (!member3.email.trim()) {
        errors.m3Email = "Member 3 email is required.";
      } else if (!isValidEmail(member3.email)) {
        errors.m3Email = "Enter a valid email address.";
      }
      if (!member3.phone.trim()) {
        errors.m3Phone = "Member 3 phone is required.";
      } else if (!isValidPhone(member3.phone)) {
        errors.m3Phone = "Enter a valid 7-15 digit phone number.";
      }
    }

    // Member 4 (if active)
    if (showMember4) {
      if (!showMember3 || !member3.name.trim()) {
        errors.m4General = "Member 4 cannot be added without Member 3.";
      }
      if (!member4.name.trim()) errors.m4Name = "Member 4 name is required.";
      if (!member4.email.trim()) {
        errors.m4Email = "Member 4 email is required.";
      } else if (!isValidEmail(member4.email)) {
        errors.m4Email = "Enter a valid email address.";
      }
      if (!member4.phone.trim()) {
        errors.m4Phone = "Member 4 phone is required.";
      } else if (!isValidPhone(member4.phone)) {
        errors.m4Phone = "Enter a valid 7-15 digit phone number.";
      }
    }

    // Duplicate email verification across all members
    const leaderEmail = (teamState?.leader?.email || "").trim().toLowerCase();
    const collectedEmails = [leaderEmail];

    if (member2.email.trim()) collectedEmails.push(member2.email.trim().toLowerCase());
    if (showMember3 && member3.email.trim()) collectedEmails.push(member3.email.trim().toLowerCase());
    if (showMember4 && member4.email.trim()) collectedEmails.push(member4.email.trim().toLowerCase());

    const seen = new Set();
    const duplicates = new Set();
    for (const e of collectedEmails) {
      if (seen.has(e)) {
        duplicates.add(e);
      }
      seen.add(e);
    }

    if (duplicates.size > 0) {
      errors.duplicateEmail = "Duplicate email detected! Each team member and the leader must have a unique email address.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
    if (teamState?.submission_active === false) {
      toast.error("HackNova registrations are currently closed. Team registrations cannot be accepted.");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fix all form validation errors before proceeding.");
      return;
    }
    onOpen();
  };

  const handleConfirmSubmit = async () => {
    onClose();
    if (teamState?.submission_active === false) {
      toast.error("HackNova registrations are currently closed. Team registrations cannot be accepted.");
      return;
    }

    const membersPayload = [
      {
        name: member2.name.trim(),
        email: member2.email.trim().toLowerCase(),
        phone: member2.phone.trim(),
        role: "member",
      },
    ];

    if (showMember3 && member3.name.trim()) {
      membersPayload.push({
        name: member3.name.trim(),
        email: member3.email.trim().toLowerCase(),
        phone: member3.phone.trim(),
        role: "member",
      });
    }

    if (showMember4 && member4.name.trim()) {
      membersPayload.push({
        name: member4.name.trim(),
        email: member4.email.trim().toLowerCase(),
        phone: member4.phone.trim(),
        role: "member",
      });
    }

    const payload = {
      team_name: teamName.trim(),
      members: membersPayload,
    };

    try {
      setSubmitting(true);
      toast.info("Registering HackNova Team...");
      const res = await postHackNovaTeam(payload);

      if (res?.error) {
        toast.error(res.error);
        setSubmitting(false);
        return;
      }

      toast.success("HackNova Team Registered & Permanently Locked! 🚀");
      setTeamState((prev) => ({
        ...prev,
        is_team_registered: true,
        is_locked: true,
        team: res.team,
      }));

      if (onTeamRegistered) {
        onTeamRegistered(res.team);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while registering your team.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg="rgba(11, 21, 46, 0.85)"
        border="1px solid rgba(56, 217, 169, 0.25)"
        borderRadius="md"
      >
        <Spinner size="lg" color="#38D9A9" thickness="3px" mb={3} />
        <Text fontFamily="'Oxanium', sans-serif" fontSize="sm" color="#22D3EE" letterSpacing="0.1em">
          VERIFYING HACKNOVA REGISTRATION & CREDENTIALS...
        </Text>
      </Box>
    );
  }

  // 1. Check if user is registered for HackNova and payment is accepted
  const isRegisteredAndPaid = teamState?.is_registered_for_event || teamState?.payment_accepted;
  if (!isRegisteredAndPaid) {
    return (
      <Box
        position="relative"
        p={{ base: 6, md: 8 }}
        bg="linear-gradient(180deg, rgba(20, 10, 25, 0.95) 0%, rgba(12, 6, 18, 0.95) 100%)"
        border="1px solid rgba(239, 68, 68, 0.45)"
        boxShadow="0 0 30px rgba(239, 68, 68, 0.2)"
        borderRadius="md"
        overflow="hidden"
      >
        {/* HUD Brackets */}
        <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #EF4444" borderTop="2px solid #EF4444" pointerEvents="none" />
        <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #EF4444" borderTop="2px solid #EF4444" pointerEvents="none" />
        <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #EF4444" borderBottom="2px solid #EF4444" pointerEvents="none" />
        <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #EF4444" borderBottom="2px solid #EF4444" pointerEvents="none" />

        <Stack spacing={4} align="center" textAlign="center">
          <Badge
            px={3}
            py={1}
            bg="rgba(239, 68, 68, 0.15)"
            color="#EF4444"
            border="1px solid rgba(239, 68, 68, 0.4)"
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            letterSpacing="0.15em"
          >
            RESTRICTED ACCESS
          </Badge>

          <chakra.h3
            fontFamily="'United Colony', sans-serif !important"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            REGISTRATION & PAYMENT REQUIRED
          </chakra.h3>

          <Text fontFamily="'Oxanium', sans-serif" fontSize="sm" color="#CBD5E1" maxW="lg" lineHeight="tall">
            Only registered participants whose <chakra.span color="#38D9A9" fontWeight="bold">payment has been accepted</chakra.span> on Pulzion EMS are eligible to register a HackNova team.
          </Text>

          <Box
            p={3}
            bg="rgba(239, 68, 68, 0.08)"
            border="1px dashed rgba(239, 68, 68, 0.35)"
            borderRadius="md"
            maxW="md"
          >
            <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="#FCA5A5">
              If you recently made your payment, please allow a short interval for admin verification on Pulzion EMS, then click below to re-verify.
            </Text>
          </Box>

          <Button
            onClick={loadTeamData}
            bg="linear-gradient(90deg, #EF4444 0%, #F97316 100%)"
            color="#FFFFFF"
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.12em"
            textTransform="uppercase"
            px={6}
            h="40px"
            _hover={{
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
            }}
          >
            Re-check Payment & Status
          </Button>
        </Stack>
      </Box>
    );
  }

  // 2. Already Registered & Locked View
  if (teamState?.is_team_registered && teamState?.team) {
    const team = teamState.team;
    const members = Array.isArray(team.members) ? team.members : [];
    const leaderMember = members.find((m) => m.role === "leader") || {
      user_name: teamState?.leader?.name || "Team Leader",
      email: teamState?.leader?.email,
      phone: teamState?.leader?.phone,
      role: "leader",
    };
    const otherMembers = members.filter((m) => m.role !== "leader");

    return (
      <Box
        position="relative"
        p={{ base: 5, md: 7 }}
        bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 100%)"
        border="1px solid rgba(56, 217, 169, 0.45)"
        boxShadow="0 0 35px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
        borderRadius="md"
        overflow="hidden"
      >
        {/* HUD Brackets */}
        <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
        <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
        <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
        <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

        <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5} pb={4} borderBottom="1px solid rgba(56, 217, 169, 0.2)">
          <Box>
            <Badge
              px={2.5}
              py={0.5}
              bg="rgba(56, 217, 169, 0.15)"
              color="#38D9A9"
              border="1px solid rgba(56, 217, 169, 0.4)"
              fontFamily="'Oxanium', sans-serif"
              fontSize="2xs"
              letterSpacing="0.15em"
              mb={1}
            >
              HACKNOVA &bull; OFFICIAL TEAM DOSSIER
            </Badge>
            <chakra.h2
              fontFamily="'United Colony', sans-serif !important"
              fontSize={{ base: "xl", sm: "2xl" }}
              fontWeight="bold"
              color="#FFFFFF"
              letterSpacing="0.06em"
              textTransform="uppercase"
            >
              {team.team_name}
            </chakra.h2>
          </Box>

          <Badge
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            px={3}
            py={1.5}
            bg="rgba(245, 158, 11, 0.15)"
            color="#F59E0B"
            border="1px solid rgba(245, 158, 11, 0.4)"
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.1em"
          >
            <LockIcon w={3} h={3} /> PERMANENTLY LOCKED
          </Badge>
        </Flex>

        <Stack spacing={4}>
          <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="#22D3EE" letterSpacing="0.12em" textTransform="uppercase">
            CONFIRMED TEAM ROSTER ({members.length} MEMBERS)
          </Text>

          {/* Leader Card */}
          <Box
            p={4}
            bg="rgba(5, 11, 29, 0.75)"
            border="1px solid rgba(56, 217, 169, 0.4)"
            borderRadius="md"
            position="relative"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontFamily="'Oxanium', sans-serif" fontSize="sm" fontWeight="bold" color="#FFFFFF">
                {leaderMember.user_name}
              </Text>
              <Badge bg="#38D9A9" color="#030512" fontFamily="'Oxanium', sans-serif" fontSize="2xs" fontWeight="extrabold" px={2} py={0.5}>
                TEAM LEADER
              </Badge>
            </Flex>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} fontSize="xs" fontFamily="'Oxanium', sans-serif" color="#CBD5E1">
              <Text>📧 {leaderMember.email}</Text>
              <Text>📱 {leaderMember.phone || "N/A"}</Text>
            </SimpleGrid>
          </Box>

          {/* Other Members Cards */}
          {otherMembers.map((m, idx) => (
            <Box
              key={m.id || idx}
              p={4}
              bg="rgba(5, 11, 29, 0.5)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="md"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontFamily="'Oxanium', sans-serif" fontSize="sm" fontWeight="bold" color="#FFFFFF">
                  {m.user_name}
                </Text>
                <Badge bg="rgba(34, 211, 238, 0.15)" color="#22D3EE" border="1px solid rgba(34, 211, 238, 0.3)" fontFamily="'Oxanium', sans-serif" fontSize="2xs" px={2} py={0.5}>
                  MEMBER {idx + 2}
                </Badge>
              </Flex>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} fontSize="xs" fontFamily="'Oxanium', sans-serif" color="#CBD5E1">
                <Text>📧 {m.email}</Text>
                <Text>📱 {m.phone}</Text>
              </SimpleGrid>
            </Box>
          ))}

          <Box
            p={3}
            bg="rgba(56, 217, 169, 0.08)"
            border="1px solid rgba(56, 217, 169, 0.25)"
            borderRadius="md"
            textAlign="center"
            mt={2}
          >
            <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="#38D9A9" letterSpacing="0.05em">
              ✓ Team roster is locked for HackNova. Each participant is bound to this team and cannot register another team.
            </Text>
          </Box>
        </Stack>
      </Box>
    );
  }

  // 3. Submissions Closed Check
  if (teamState?.submission_active === false) {
    return <SubmissionClosedNotice eventName="HackNova Squad Registration" />;
  }

  // 4. Team Registration Form View
  const leader = teamState?.leader || {};

  return (
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
        <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
          <chakra.h2
            fontFamily="'United Colony', sans-serif !important"
            fontSize={{ base: "xl", sm: "2xl" }}
            fontWeight="bold"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            HACKNOVA TEAM REGISTRATION
          </chakra.h2>
          <Badge
            px={2.5}
            py={1}
            bg="rgba(56, 217, 169, 0.15)"
            color="#38D9A9"
            border="1px solid rgba(56, 217, 169, 0.35)"
            fontFamily="'Oxanium', sans-serif"
            fontSize="2xs"
            letterSpacing="0.1em"
          >
            2–4 MEMBERS REQUIRED
          </Badge>
        </Flex>
        <chakra.p
          fontFamily="'Oxanium', sans-serif"
          fontSize="xs"
          color="#22D3EE"
          letterSpacing="0.12em"
          textTransform="uppercase"
          mt={1}
        >
          STEP 1: ESTABLISH AND LOCK YOUR SQUAD ROSTER
        </chakra.p>
      </Box>

      {formErrors.duplicateEmail && (
        <Box p={3} mb={4} bg="rgba(239, 68, 68, 0.15)" border="1px solid #EF4444" borderRadius="md">
          <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" color="#FCA5A5" fontWeight="bold">
            ⚠️ {formErrors.duplicateEmail}
          </Text>
        </Box>
      )}

      <form onSubmit={handlePreSubmit}>
        <Stack spacing={5}>
          {/* Section: Team Details */}
          <Box p={4} bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(56, 217, 169, 0.2)" borderRadius="md">
            <FormControl id="teamName" isRequired>
              <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="xs" fontWeight="bold" letterSpacing="0.1em" textTransform="uppercase" color="#38D9A9" mb={1.5}>
                Team Name *
              </FormLabel>
              <Input
                name="teamName"
                placeholder="e.g. CyberNovas"
                h="44px"
                fontFamily="'Oxanium', sans-serif"
                color="#FFFFFF"
                bg="rgba(7, 16, 36, 0.85)"
                border="1px solid rgba(56, 217, 169, 0.35)"
                borderRadius="md"
                _hover={{ borderColor: "rgba(56, 217, 169, 0.6)" }}
                _focus={{ borderColor: "#38D9A9", boxShadow: "0 0 12px rgba(56, 217, 169, 0.35)" }}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              {formErrors.teamName && (
                <Text color="#F87171" fontSize="xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                  {formErrors.teamName}
                </Text>
              )}
            </FormControl>
          </Box>

          {/* Section: Team Leader (Auto-Fetched & Read-Only) */}
          <Box p={4} bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(34, 211, 238, 0.25)" borderRadius="md">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" fontWeight="bold" color="#22D3EE" letterSpacing="0.1em" textTransform="uppercase">
                MEMBER 1: TEAM LEADER (AUTO-FETCHED & READ-ONLY)
              </Text>
              <Badge bg="#38D9A9" color="#030512" fontFamily="'Oxanium', sans-serif" fontSize="2xs" fontWeight="bold">
                LEADER (YOU)
              </Badge>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
              <FormControl>
                <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="gray.400" mb={1}>
                  LEADER NAME
                </FormLabel>
                <Input
                  value={leader.name || ""}
                  isReadOnly
                  h="40px"
                  fontFamily="'Oxanium', sans-serif"
                  color="#CBD5E1"
                  bg="rgba(15, 23, 42, 0.6)"
                  border="1px solid rgba(255, 255, 255, 0.15)"
                  cursor="not-allowed"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="gray.400" mb={1}>
                  LEADER EMAIL
                </FormLabel>
                <Input
                  value={leader.email || ""}
                  isReadOnly
                  h="40px"
                  fontFamily="'Oxanium', sans-serif"
                  color="#CBD5E1"
                  bg="rgba(15, 23, 42, 0.6)"
                  border="1px solid rgba(255, 255, 255, 0.15)"
                  cursor="not-allowed"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="gray.400" mb={1}>
                  LEADER PHONE
                </FormLabel>
                <Input
                  value={leader.phone || ""}
                  isReadOnly
                  h="40px"
                  fontFamily="'Oxanium', sans-serif"
                  color="#CBD5E1"
                  bg="rgba(15, 23, 42, 0.6)"
                  border="1px solid rgba(255, 255, 255, 0.15)"
                  cursor="not-allowed"
                />
              </FormControl>
            </SimpleGrid>
            <Text fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="gray.400" mt={2}>
              🔒 Leader details are securely sourced from your authenticated Pulzion account.
            </Text>
          </Box>

          {/* Section: Member 2 (Mandatory) */}
          <Box p={4} bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(56, 217, 169, 0.25)" borderRadius="md">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" fontWeight="bold" color="#38D9A9" letterSpacing="0.1em" textTransform="uppercase">
                MEMBER 2 (MANDATORY) *
              </Text>
              <Badge bg="rgba(56, 217, 169, 0.15)" color="#38D9A9" border="1px solid rgba(56, 217, 169, 0.3)" fontFamily="'Oxanium', sans-serif" fontSize="2xs">
                REQUIRED
              </Badge>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
              <FormControl isRequired>
                <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#38D9A9" mb={1}>
                  FULL NAME *
                </FormLabel>
                <Input
                  placeholder="e.g. Alex Smith"
                  h="40px"
                  fontFamily="'Oxanium', sans-serif"
                  color="#FFFFFF"
                  bg="rgba(7, 16, 36, 0.85)"
                  border="1px solid rgba(56, 217, 169, 0.35)"
                  value={member2.name}
                  onChange={(e) => setMember2({ ...member2, name: e.target.value })}
                />
                {formErrors.m2Name && (
                  <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                    {formErrors.m2Name}
                  </Text>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#38D9A9" mb={1}>
                  EMAIL ADDRESS *
                </FormLabel>
                <Input
                  type="email"
                  placeholder="alex@example.com"
                  h="40px"
                  fontFamily="'Oxanium', sans-serif"
                  color="#FFFFFF"
                  bg="rgba(7, 16, 36, 0.85)"
                  border="1px solid rgba(56, 217, 169, 0.35)"
                  value={member2.email}
                  onChange={(e) => setMember2({ ...member2, email: e.target.value })}
                />
                {formErrors.m2Email && (
                  <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                    {formErrors.m2Email}
                  </Text>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#38D9A9" mb={1}>
                  PHONE NUMBER *
                </FormLabel>
                <Input
                  placeholder="9876543210"
                  h="40px"
                  fontFamily="'Oxanium', sans-serif"
                  color="#FFFFFF"
                  bg="rgba(7, 16, 36, 0.85)"
                  border="1px solid rgba(56, 217, 169, 0.35)"
                  value={member2.phone}
                  onChange={(e) => setMember2({ ...member2, phone: e.target.value })}
                />
                {formErrors.m2Phone && (
                  <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                    {formErrors.m2Phone}
                  </Text>
                )}
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Section: Member 3 (Optional) */}
          <Box p={4} bg="rgba(7, 16, 36, 0.7)" border="1px solid rgba(255, 255, 255, 0.15)" borderRadius="md">
            <Flex justify="space-between" align="center" mb={showMember3 ? 3 : 0}>
              <Box>
                <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" fontWeight="bold" color="#CBD5E1" letterSpacing="0.1em" textTransform="uppercase">
                  MEMBER 3 (OPTIONAL)
                </Text>
                {!showMember3 && (
                  <Text fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="gray.400">
                    Add a 3rd member to your HackNova squad
                  </Text>
                )}
              </Box>

              {!showMember3 ? (
                <Button
                  size="xs"
                  leftIcon={<AddIcon />}
                  variant="outline"
                  borderColor="#38D9A9"
                  color="#38D9A9"
                  fontFamily="'Oxanium', sans-serif"
                  fontSize="2xs"
                  _hover={{ bg: "rgba(56, 217, 169, 0.15)" }}
                  onClick={() => setShowMember3(true)}
                >
                  Add Member 3
                </Button>
              ) : (
                <Button
                  size="xs"
                  leftIcon={<DeleteIcon />}
                  variant="ghost"
                  color="#F87171"
                  fontFamily="'Oxanium', sans-serif"
                  fontSize="2xs"
                  _hover={{ bg: "rgba(239, 68, 68, 0.15)" }}
                  onClick={() => {
                    setShowMember3(false);
                    setMember3({ name: "", email: "", phone: "" });
                    // Also disable member 4 if member 3 is removed
                    setShowMember4(false);
                    setMember4({ name: "", email: "", phone: "" });
                  }}
                >
                  Remove Member 3
                </Button>
              )}
            </Flex>

            {showMember3 && (
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mt={2}>
                <FormControl>
                  <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#CBD5E1" mb={1}>
                    FULL NAME
                  </FormLabel>
                  <Input
                    placeholder="e.g. Sam Wilson"
                    h="40px"
                    fontFamily="'Oxanium', sans-serif"
                    color="#FFFFFF"
                    bg="rgba(7, 16, 36, 0.85)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    value={member3.name}
                    onChange={(e) => setMember3({ ...member3, name: e.target.value })}
                  />
                  {formErrors.m3Name && (
                    <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                      {formErrors.m3Name}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#CBD5E1" mb={1}>
                    EMAIL ADDRESS
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="sam@example.com"
                    h="40px"
                    fontFamily="'Oxanium', sans-serif"
                    color="#FFFFFF"
                    bg="rgba(7, 16, 36, 0.85)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    value={member3.email}
                    onChange={(e) => setMember3({ ...member3, email: e.target.value })}
                  />
                  {formErrors.m3Email && (
                    <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                      {formErrors.m3Email}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#CBD5E1" mb={1}>
                    PHONE NUMBER
                  </FormLabel>
                  <Input
                    placeholder="9876543211"
                    h="40px"
                    fontFamily="'Oxanium', sans-serif"
                    color="#FFFFFF"
                    bg="rgba(7, 16, 36, 0.85)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    value={member3.phone}
                    onChange={(e) => setMember3({ ...member3, phone: e.target.value })}
                  />
                  {formErrors.m3Phone && (
                    <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                      {formErrors.m3Phone}
                    </Text>
                  )}
                </FormControl>
              </SimpleGrid>
            )}
          </Box>

          {/* Section: Member 4 (Optional, conditional on Member 3) */}
          <Box
            p={4}
            bg="rgba(7, 16, 36, 0.7)"
            border="1px solid rgba(255, 255, 255, 0.15)"
            borderRadius="md"
            opacity={!showMember3 ? 0.6 : 1}
          >
            <Flex justify="space-between" align="center" mb={showMember4 ? 3 : 0}>
              <Box>
                <Text fontFamily="'Oxanium', sans-serif" fontSize="xs" fontWeight="bold" color="#CBD5E1" letterSpacing="0.1em" textTransform="uppercase">
                  MEMBER 4 (OPTIONAL)
                </Text>
                {!showMember4 && (
                  <Text fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="gray.400">
                    {!showMember3 ? "⚠️ Member 3 must be filled first to unlock Member 4" : "Add a 4th member to reach the max squad limit"}
                  </Text>
                )}
              </Box>

              {!showMember4 ? (
                <Button
                  size="xs"
                  leftIcon={<AddIcon />}
                  variant="outline"
                  borderColor={showMember3 ? "#38D9A9" : "gray.600"}
                  color={showMember3 ? "#38D9A9" : "gray.500"}
                  isDisabled={!showMember3}
                  fontFamily="'Oxanium', sans-serif"
                  fontSize="2xs"
                  _hover={showMember3 ? { bg: "rgba(56, 217, 169, 0.15)" } : {}}
                  onClick={() => setShowMember4(true)}
                >
                  Add Member 4
                </Button>
              ) : (
                <Button
                  size="xs"
                  leftIcon={<DeleteIcon />}
                  variant="ghost"
                  color="#F87171"
                  fontFamily="'Oxanium', sans-serif"
                  fontSize="2xs"
                  _hover={{ bg: "rgba(239, 68, 68, 0.15)" }}
                  onClick={() => {
                    setShowMember4(false);
                    setMember4({ name: "", email: "", phone: "" });
                  }}
                >
                  Remove Member 4
                </Button>
              )}
            </Flex>

            {showMember4 && showMember3 && (
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mt={2}>
                <FormControl>
                  <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#CBD5E1" mb={1}>
                    FULL NAME
                  </FormLabel>
                  <Input
                    placeholder="e.g. Taylor Swift"
                    h="40px"
                    fontFamily="'Oxanium', sans-serif"
                    color="#FFFFFF"
                    bg="rgba(7, 16, 36, 0.85)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    value={member4.name}
                    onChange={(e) => setMember4({ ...member4, name: e.target.value })}
                  />
                  {formErrors.m4Name && (
                    <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                      {formErrors.m4Name}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#CBD5E1" mb={1}>
                    EMAIL ADDRESS
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="taylor@example.com"
                    h="40px"
                    fontFamily="'Oxanium', sans-serif"
                    color="#FFFFFF"
                    bg="rgba(7, 16, 36, 0.85)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    value={member4.email}
                    onChange={(e) => setMember4({ ...member4, email: e.target.value })}
                  />
                  {formErrors.m4Email && (
                    <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                      {formErrors.m4Email}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontFamily="'Oxanium', sans-serif" fontSize="2xs" color="#CBD5E1" mb={1}>
                    PHONE NUMBER
                  </FormLabel>
                  <Input
                    placeholder="9876543212"
                    h="40px"
                    fontFamily="'Oxanium', sans-serif"
                    color="#FFFFFF"
                    bg="rgba(7, 16, 36, 0.85)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    value={member4.phone}
                    onChange={(e) => setMember4({ ...member4, phone: e.target.value })}
                  />
                  {formErrors.m4Phone && (
                    <Text color="#F87171" fontSize="2xs" fontFamily="'Oxanium', sans-serif" mt={1}>
                      {formErrors.m4Phone}
                    </Text>
                  )}
                </FormControl>
              </SimpleGrid>
            )}
          </Box>

          {/* Submit Button */}
          <Box pt={2}>
            <Button
              type="submit"
              w={{ base: "full", sm: "auto" }}
              px={8}
              h="46px"
              bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
              color="#030512"
              fontFamily="'Oxanium', sans-serif"
              fontWeight="extrabold"
              letterSpacing="0.12em"
              fontSize="sm"
              textTransform="uppercase"
              rounded="md"
              boxShadow="0 0 20px rgba(56, 217, 169, 0.35)"
              _hover={{
                bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                boxShadow: "0 0 30px rgba(56, 217, 169, 0.6)",
                transform: "translateY(-1px)",
              }}
              _active={{ transform: "scale(0.98)" }}
              isLoading={submitting}
            >
              🔒 Review & Register Team
            </Button>
          </Box>
        </Stack>
      </form>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay bg="rgba(3, 5, 18, 0.85)" backdropFilter="blur(8px)" />
        <ModalContent
          position="relative"
          bg="linear-gradient(180deg, rgba(11, 21, 46, 0.98) 0%, rgba(7, 16, 36, 0.98) 100%)"
          border="1px solid rgba(56, 217, 169, 0.45)"
          boxShadow="0 0 35px rgba(56, 217, 169, 0.25), 0 12px 32px rgba(0, 0, 0, 0.9)"
          borderRadius="md"
          p={4}
        >
          {/* HUD Brackets */}
          <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          <ModalHeader
            fontFamily="'United Colony', sans-serif !important"
            color="#FFFFFF"
            fontSize="xl"
            letterSpacing="0.08em"
            textTransform="uppercase"
            pt={3}
          >
            CONFIRM HACKNOVA TEAM ROSTER
          </ModalHeader>
          <ModalCloseButton color="#38D9A9" _hover={{ color: "#22D3EE" }} />

          <ModalBody fontFamily="'Oxanium', sans-serif" color="#CBD5E1" fontSize="sm">
            <Stack spacing={3}>
              <Box p={3} bg="rgba(56, 217, 169, 0.08)" border="1px solid rgba(56, 217, 169, 0.3)" borderRadius="md">
                <Text fontSize="xs" color="#38D9A9" fontWeight="bold">
                  TEAM NAME: <chakra.span color="#FFFFFF">{teamName}</chakra.span>
                </Text>
              </Box>

              <Text fontSize="xs" color="#22D3EE" fontWeight="bold" letterSpacing="0.1em">
                REGISTERED ROSTER:
              </Text>

              <Stack spacing={2} fontSize="xs">
                <Text>• <chakra.span fontWeight="bold" color="#38D9A9">Leader:</chakra.span> {leader.name} ({leader.email})</Text>
                <Text>• <chakra.span fontWeight="bold" color="#FFFFFF">Member 2:</chakra.span> {member2.name} ({member2.email})</Text>
                {showMember3 && member3.name && (
                  <Text>• <chakra.span fontWeight="bold" color="#FFFFFF">Member 3:</chakra.span> {member3.name} ({member3.email})</Text>
                )}
                {showMember4 && member4.name && (
                  <Text>• <chakra.span fontWeight="bold" color="#FFFFFF">Member 4:</chakra.span> {member4.name} ({member4.email})</Text>
                )}
              </Stack>

              <Box p={3} bg="rgba(239, 68, 68, 0.12)" border="1px solid rgba(239, 68, 68, 0.4)" borderRadius="md" mt={2}>
                <Text fontSize="xs" color="#FCA5A5" fontWeight="bold">
                  ⚠️ PERMANENT LOCK WARNING:
                </Text>
                <Text fontSize="2xs" color="#CBD5E1" mt={1}>
                  Once submitted, team details are permanently locked in the database and CANNOT be modified, updated, or reassigned.
                </Text>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter gap={3} pt={4}>
            <Button
              variant="outline"
              borderColor="rgba(255, 255, 255, 0.2)"
              color="#94A3B8"
              fontFamily="'Oxanium', sans-serif"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.1em"
              textTransform="uppercase"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
              color="#030512"
              fontFamily="'Oxanium', sans-serif"
              fontSize="xs"
              fontWeight="extrabold"
              letterSpacing="0.12em"
              textTransform="uppercase"
              boxShadow="0 0 15px rgba(56, 217, 169, 0.3)"
              _hover={{
                bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                boxShadow: "0 0 25px rgba(56, 217, 169, 0.5)",
              }}
              onClick={handleConfirmSubmit}
            >
              Confirm & Lock Team
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HackNovaTeamRegistration;
