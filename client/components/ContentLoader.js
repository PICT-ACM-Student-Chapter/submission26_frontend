import React from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import animationData from "../lotties/final.json";

// SSR-safe dynamic import for Lottie with cyber glow fallback
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <Spinner
      thickness="3px"
      speed="0.8s"
      emptyColor="rgba(56, 217, 169, 0.15)"
      color="#38D9A9"
      w="64px"
      h="64px"
      borderRadius="50%"
      style={{ borderRadius: "50%" }}
      boxShadow="0 0 25px rgba(56, 217, 169, 0.45)"
    />
  ),
});

const ContentLoader = ({ text = "INITIALIZING MISSION INTERFACE..." }) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="100vw"
      h="100vh"
      bg="#030512"
      position="relative"
      overflow="hidden"
    >
      {/* Background cyber radial glow */}
      <Box
        position="absolute"
        w="280px"
        h="280px"
        bg="#38D9A9"
        opacity={0.15}
        borderRadius="50%"
        style={{ borderRadius: "50%" }}
        filter="blur(80px)"
        pointerEvents="none"
      />

      {/* Lottie Animation or glowing Spinner fallback */}
      <Box
        w="220px"
        h="220px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        zIndex={10}
      >
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ height: 220, width: 220 }}
        />
      </Box>

      {/* Mission Text */}
      <Text
        fontFamily="'Oxanium', sans-serif"
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="0.25em"
        color="#38D9A9"
        textTransform="uppercase"
        mt={3}
        position="relative"
        zIndex={10}
        textAlign="center"
        px={4}
      >
        {text}
      </Text>
    </Flex>
  );
};

export default ContentLoader;
