import React from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Button,
  chakra,
} from "@chakra-ui/react";
import { WarningIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

const SubmissionClosedNotice = ({ eventName = "this event" }) => {
  return (
    <Box
      position="relative"
      p={{ base: 6, md: 8 }}
      bg="linear-gradient(180deg, rgba(20, 10, 25, 0.95) 0%, rgba(12, 6, 18, 0.95) 100%)"
      border="1px solid rgba(239, 68, 68, 0.45)"
      boxShadow="0 0 30px rgba(239, 68, 68, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
      borderRadius="md"
      overflow="hidden"
      textAlign="center"
    >
      {/* 4 Corner HUD Brackets */}
      <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #EF4444" borderTop="2px solid #EF4444" pointerEvents="none" />
      <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #EF4444" borderTop="2px solid #EF4444" pointerEvents="none" />
      <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #EF4444" borderBottom="2px solid #EF4444" pointerEvents="none" />
      <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #EF4444" borderBottom="2px solid #EF4444" pointerEvents="none" />

      <Stack spacing={4} align="center">
        <Flex
          align="center"
          justify="center"
          w="56px"
          h="56px"
          rounded="full"
          bg="rgba(239, 68, 68, 0.15)"
          border="1px solid #EF4444"
          color="#EF4444"
          boxShadow="0 0 20px rgba(239, 68, 68, 0.4)"
        >
          <WarningIcon w={7} h={7} />
        </Flex>

        <chakra.h2
          fontFamily="'Orbitron', sans-serif !important"
          fontSize={{ base: "xl", sm: "2xl" }}
          fontWeight="bold"
          color="#FFFFFF"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          SUBMISSIONS CURRENTLY CLOSED
        </chakra.h2>

        <Text fontFamily="'Inter', sans-serif" fontSize="sm" color="#CBD5E1" maxW="md" lineHeight="tall">
          Submissions for <chakra.span color="#EF4444" fontWeight="bold">{eventName}</chakra.span> are closed by administrators. New entries will not be accepted or stored in the database.
        </Text>

        <Box
          p={3}
          bg="rgba(239, 68, 68, 0.08)"
          border="1px dashed rgba(239, 68, 68, 0.35)"
          borderRadius="md"
          maxW="md"
        >
          <Text fontFamily="'Inter', sans-serif" fontSize="xs" color="#FCA5A5">
            🛑 Form input and file uploads are disabled for this competition. If you require any assistance, please contact the Pulzion coordinators.
          </Text>
        </Box>

        <NextLink href="/dashboard">
          <Button
            mt={2}
            leftIcon={<ChevronLeftIcon />}
            variant="outline"
            borderColor="#38D9A9"
            color="#38D9A9"
            fontFamily="'Inter', sans-serif"
            fontSize="xs"
            letterSpacing="0.1em"
            textTransform="uppercase"
            _hover={{ bg: "rgba(56, 217, 169, 0.15)" }}
          >
            Back to Mission Control
          </Button>
        </NextLink>
      </Stack>
    </Box>
  );
};

export default SubmissionClosedNotice;
