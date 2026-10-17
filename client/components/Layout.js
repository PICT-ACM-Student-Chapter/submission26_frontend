import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      bg="#030512"
      minHeight="100vh"
      width="100%"
      position="relative"
      overflowX="hidden"
      fontFamily="'Oxanium', sans-serif"
      color="#F8FAFC"
    >
      {/* Pulzion 26 Background: Nebula glows and subtle sci-fi grid */}
      <Box
        position="fixed"
        inset={0}
        pointerEvents="none"
        zIndex={0}
        bg="#030512"
        overflow="hidden"
      >
        {/* Top-left Cyan ambient nebula */}
        <Box
          position="absolute"
          top="-25%"
          left="-15%"
          w="60vw"
          h="60vh"
          bg="#22D3EE"
          opacity={0.08}
          rounded="full"
          filter="blur(160px)"
        />
        {/* Bottom-right Mint ambient nebula */}
        <Box
          position="absolute"
          bottom="-25%"
          right="-15%"
          w="60vw"
          h="60vh"
          bg="#38D9A9"
          opacity={0.08}
          rounded="full"
          filter="blur(160px)"
        />
        {/* Center Amber subtle glow */}
        <Box
          position="absolute"
          top="40%"
          left="30%"
          w="40vw"
          h="40vh"
          bg="#F8D092"
          opacity={0.03}
          rounded="full"
          filter="blur(150px)"
        />
        {/* Sci-fi coordinate grid overlay */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.035}
          backgroundImage="linear-gradient(rgba(56, 217, 169, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 217, 169, 0.8) 1px, transparent 1px)"
          backgroundSize="55px 55px"
        />
        {/* Subtle scanline overlay */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.4}
          backgroundImage="repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.015) 4px)"
        />
      </Box>

      {/* Content wrapper */}
      <Box position="relative" zIndex={10} w="100%" display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Flex flexGrow={1} width="100%" height="auto">
          {children}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Layout;