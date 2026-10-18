import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";

const EventCard = ({ id, event, page, status, squadRegistrationActive = false }) => {
  const router = useRouter();
  const { user } = useContext(AppContext);

  const isHackNova =
    Number(id) === 20 ||
    String(event || "").toLowerCase().includes("hacknova") ||
    String(page || "").toLowerCase().includes("hacknova");

  const handleNavigate = () => {
    if (status === true) {
      router.push(page);
    } else {
      toast.error("Sorry submission for this event is closed");
    }
  };

  return (
    <Box
      role="group"
      position="relative"
      h="full"
      minH={{ base: "320px", sm: "340px" }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={{ base: 4, sm: 5 }}
      border="1px solid rgba(255, 255, 255, 0.15)"
      bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)"
      backdropFilter="blur(16px)"
      overflow="hidden"
      boxShadow="0 12px 32px rgba(0, 0, 0, 0.85)"
      cursor="pointer"
      userSelect="none"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "rgba(34, 211, 238, 0.8)",
        boxShadow: "0 0 35px rgba(34, 211, 238, 0.45), 0 12px 32px rgba(0, 0, 0, 0.85)",
        transform: "translateY(-3px)",
      }}
      onClick={handleNavigate}
    >
      {/* 4 Corner HUD Brackets - signature Pulzion 26 design */}
      <Box
        position="absolute"
        top="8px"
        left="8px"
        w="10px"
        h="10px"
        borderLeft="2px solid #38D9A9"
        borderTop="2px solid #38D9A9"
        opacity={0.35}
        transition="all 0.3s"
        _groupHover={{ opacity: 1, borderColor: "#22D3EE" }}
        pointerEvents="none"
        zIndex={20}
      />
      <Box
        position="absolute"
        top="8px"
        right="8px"
        w="10px"
        h="10px"
        borderRight="2px solid #38D9A9"
        borderTop="2px solid #38D9A9"
        opacity={0.35}
        transition="all 0.3s"
        _groupHover={{ opacity: 1, borderColor: "#22D3EE" }}
        pointerEvents="none"
        zIndex={20}
      />
      <Box
        position="absolute"
        bottom="8px"
        left="8px"
        w="10px"
        h="10px"
        borderLeft="2px solid #38D9A9"
        borderBottom="2px solid #38D9A9"
        opacity={0.35}
        transition="all 0.3s"
        _groupHover={{ opacity: 1, borderColor: "#22D3EE" }}
        pointerEvents="none"
        zIndex={20}
      />
      <Box
        position="absolute"
        bottom="8px"
        right="8px"
        w="10px"
        h="10px"
        borderRight="2px solid #38D9A9"
        borderBottom="2px solid #38D9A9"
        opacity={0.35}
        transition="all 0.3s"
        _groupHover={{ opacity: 1, borderColor: "#22D3EE" }}
        pointerEvents="none"
        zIndex={20}
      />

      {/* Hover glow orb */}
      <Box
        position="absolute"
        top="-80px"
        left="-80px"
        w="180px"
        h="180px"
        rounded="full"
        bg="#22D3EE"
        filter="blur(75px)"
        opacity={0}
        transition="opacity 0.5s ease"
        _groupHover={{ opacity: 0.35 }}
        pointerEvents="none"
        zIndex={5}
      />

      {/* Scanline overlay pattern */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.02) 4px)"
        pointerEvents="none"
        zIndex={10}
      />

      {/* Top/Center: Event Logo + Title + Description */}
      <Flex
        position="relative"
        direction="column"
        align="center"
        justify="center"
        my={3}
        zIndex={20}
        flex={1}
      >
        <Flex
          position="relative"
          align="center"
          justify="center"
          w={{ base: "72px", sm: "84px" }}
          h={{ base: "72px", sm: "84px" }}
        >
          <Image
            src={`${page}.png`}
            alt={event}
            w={{ base: "68px", sm: "78px" }}
            h={{ base: "68px", sm: "78px" }}
            objectFit="contain"
            transition="all 0.3s ease"
            filter="drop-shadow(0 0 10px rgba(56, 217, 169, 0.3))"
            _groupHover={{
              filter: "drop-shadow(0 0 22px rgba(34, 211, 238, 0.95))",
              transform: "scale(1.05)",
            }}
            fallbackSrc="/logo.svg"
          />
        </Flex>

        {/* Title in United Colony Font */}
        <chakra.h3
          fontFamily="'United Colony', sans-serif !important"
          fontSize={{ base: "md", sm: "lg" }}
          fontWeight="bold"
          color="#FFFFFF"
          letterSpacing="0.08em"
          textTransform="uppercase"
          mt={4}
          textAlign="center"
          transition="color 0.3s ease, text-shadow 0.3s ease"
          _groupHover={{
            color: "#22D3EE",
            textShadow: "0 0 14px rgba(34, 211, 238, 0.65)",
          }}
        >
          {event}
        </chakra.h3>

        {/* Subtitle / Mode text in Oxanium Font */}
        <chakra.p
          fontFamily="'Oxanium', sans-serif"
          fontSize="xs"
          color="slate.300"
          opacity={0.8}
          textAlign="center"
          mt={1.5}
          px={2}
          letterSpacing="0.06em"
          textTransform="uppercase"
        >
          {status ? "SUBMISSION ACTIVE" : "REGISTRATION ONLY"}
        </chakra.p>
      </Flex>

      {/* Bottom Info Badges & Action Link */}
      <Box
        w="full"
        pt={3}
        borderTop="1px solid rgba(255, 255, 255, 0.15)"
        zIndex={20}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <SimpleGrid columns={2} spacing={2} fontFamily="'Oxanium', sans-serif">
          {/* Mode Badge */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={1.5}
            px={2}
            rounded="xl"
            bg="rgba(34, 211, 238, 0.15)"
            border="1px solid rgba(34, 211, 238, 0.5)"
            textAlign="center"
            boxShadow="0 0 15px rgba(34, 211, 238, 0.15)"
            minH="50px"
          >
            <chakra.span
              color="#22D3EE"
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.15em"
              fontWeight="bold"
            >
              MODE
            </chakra.span>
            <chakra.span
              color="white"
              fontWeight="extrabold"
              fontSize="11px"
              mt={0.5}
              letterSpacing="0.05em"
            >
              ONLINE
            </chakra.span>
          </Flex>

          {/* Status Badge */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={1.5}
            px={2}
            rounded="xl"
            bg={status ? "rgba(56, 217, 169, 0.15)" : "rgba(248, 208, 146, 0.15)"}
            border={`1px solid ${status ? "rgba(56, 217, 169, 0.5)" : "rgba(248, 208, 146, 0.5)"}`}
            textAlign="center"
            boxShadow={status ? "0 0 15px rgba(56, 217, 169, 0.15)" : "0 0 15px rgba(248, 208, 146, 0.15)"}
            minH="50px"
          >
            <chakra.span
              color={status ? "#38D9A9" : "#F8D092"}
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.15em"
              fontWeight="bold"
            >
              STATUS
            </chakra.span>
            <chakra.span
              color="white"
              fontWeight="extrabold"
              fontSize="11px"
              mt={0.5}
              letterSpacing="0.05em"
            >
              {status ? "ACTIVE" : "CLOSED"}
            </chakra.span>
          </Flex>
        </SimpleGrid>

        {/* If HackNova and HackNova Squad Registrations is active, show direct Fill Team Form CTA */}
        {isHackNova && squadRegistrationActive === true && (
          <Button
            size="xs"
            w="full"
            variant="outline"
            borderColor="rgba(56, 217, 169, 0.6)"
            color="#38D9A9"
            bg="rgba(56, 217, 169, 0.12)"
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.08em"
            textTransform="uppercase"
            boxShadow="0 0 10px rgba(56, 217, 169, 0.2)"
            _hover={{
              bg: "rgba(56, 217, 169, 0.25)",
              borderColor: "#38D9A9",
              color: "#FFFFFF",
              boxShadow: "0 0 15px rgba(56, 217, 169, 0.4)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/hacknova-team");
            }}
          >
            👥 Fill Team Form →
          </Button>
        )}

        {/* Pulzion 26 Interactive Action */}
        <Flex
          alignItems="center"
          justifyContent="center"
          w="full"
          pt={1}
          pb={0.5}
        >
          <Flex
            alignItems="center"
            gap={1.5}
            fontFamily="'Oxanium', sans-serif"
            fontSize="xs"
            color="#38D9A9"
            textTransform="uppercase"
            fontWeight="bold"
            letterSpacing="0.12em"
            transition="all 0.3s ease"
            _groupHover={{
              transform: "translateX(4px)",
              color: "#22D3EE",
            }}
          >
            CLICK TO EXPLORE <ArrowRightIcon w={2.5} h={2.5} ml={1} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default EventCard;
