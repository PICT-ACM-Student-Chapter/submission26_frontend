import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const ContentLoader = () => {
  const [animationData, setAnimationData] = useState(null);
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    import("lottie-react").then((mod) => setLottie(() => mod.default));
    import("../lotties/final.json").then((mod) => setAnimationData(mod.default || mod));
  }, []);

  if (!Lottie || !animationData) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100vw"
        h="100vh"
        bg="#030512"
      >
        <Box
          w="50px"
          h="50px"
          rounded="full"
          border="2px solid rgba(56, 217, 169, 0.2)"
          borderTopColor="#38D9A9"
          className="animate-spin"
        />
      </Flex>
    );
  }

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
      <Box
        position="absolute"
        w="250px"
        h="250px"
        bg="#38D9A9"
        opacity={0.15}
        rounded="full"
        filter="blur(80px)"
        pointerEvents="none"
      />
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ height: 220, width: 220, position: "relative", zIndex: 10 }}
      />
      <Text
        fontFamily="'Oxanium', sans-serif"
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="0.25em"
        color="#38D9A9"
        textTransform="uppercase"
        mt={4}
        position="relative"
        zIndex={10}
      >
        INITIALIZING MISSION INTERFACE...
      </Text>
    </Flex>
  );
};

export default ContentLoader;
