// import { Flex, useColorModeValue } from '@chakra-ui/react';
// import React from 'react'
// import Lottie from 'react-lottie';
// import * as data from '../lotties/final.json';
// const defaultOptions = {
//   loop: true,
//   autoplay: true,
//   animationData: data,
//   rendererSettings: {
//     preserveAspectRatio: 'xMidYMid slice'
//   }
// };

// const ContentLoader = () => {
//   return (
//     <Flex
//         flexDirection={"column"}
//         alignItems={"center"}
//         justifyContent={"center"}
//         w={"100vw"}
//         h={"100vh"}
//         bg={useColorModeValue("#f8f9fb", "green.200")}
//     >
//         <Lottie
//           options={defaultOptions}
//           height={200}
//           width={200}
//         />
//     </Flex>
//   )
// }

// export default ContentLoader

// import { Flex, useColorModeValue } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";

// const ContentLoader = () => {
//   const [Lottie, setLottie] = useState(null);
//   const [animationData, setAnimationData] = useState(null);

//   useEffect(() => {
//     // Load Lottie only on the client
//     import("react-lottie").then((mod) => setLottie(() => mod.default));
//     import("../lotties/final.json").then((mod) => setAnimationData(mod.default || mod));
//   }, []);

//   // Don't render anything on server or before Lottie loads
//   if (!Lottie || !animationData) return null;

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };

//   return (
//     <Flex
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       w="100vw"
//       h="100vh"
//       bg={useColorModeValue("#f8f9fb", "green.200")}
//     >
//       <Lottie options={defaultOptions} height={200} width={200} />
//     </Flex>
//   );
// };

// export default ContentLoader;

import { Flex, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const ContentLoader = () => {
  const [animationData, setAnimationData] = useState(null);
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    // Dynamically import only on client side
    import("lottie-react").then((mod) => setLottie(() => mod.default));
    import("../lotties/final.json").then((mod) => setAnimationData(mod.default || mod));
  }, []);

  if (!Lottie || !animationData) return null;

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="100vw"
      h="100vh"
      bg={useColorModeValue("#f8f9fb", "green.200")}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ height: 200, width: 200 }}
      />
    </Flex>
  );
};

export default ContentLoader;
