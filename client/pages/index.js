// // import {
// //   Flex,
// //   Box,
// //   FormControl,
// //   FormLabel,
// //   Input,
// //   Stack,
// //   Button,
// //   Heading,
// //   useColorModeValue,
// // } from "@chakra-ui/react";
// // import { Formik } from "formik";
// // import { toast } from 'react-toastify';
// // import * as Yup from "yup";
// // import { useContext, useState } from "react";
// // import Layout from "../components/Layout";
// // import FormField from "../components/FormField";
// // import { userLogin } from "../action/user";
// // import AppContext from "../context/AppContext";
// // import publicRoute from "../routers/publicRoute";

// // const validateSchema = Yup.object({
// //   email: Yup.string().email("Invalid email address").required("Required"),
// //   password: Yup.string().required("Required")
// // });

// // function Loginpage() {

// //   const { dispatchUser, dispatchEvents } = useContext(AppContext);
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = async (values) => {
// //     console.log(values);
// //     try {
// //       setLoading(true);
// //       const data = await userLogin(values, 'user', dispatchUser, dispatchEvents);
// //       if (data?.error) {
// //         toast.error(data.error);
// //       }
// //     } catch (e) {
// //       console.log(e)
// //       toast.error('Something Went Wrong')
// //     }
// //     setLoading(false)
// //   }

// //   return (
// //     <Layout>
// //       <Flex
// //         alignItems={"center"}
// //         justifyContent={"center"}
// //         px={{
// //           base: '16px',
// //           md: '48px',
// //           lg: '64px'
// //         }}
// //         py={"1px"}
// //         w={"100%"}
// //       >
// //         <Flex
// //           align={"center"}
// //           justify={"center"}
// //           opacity={0.8}
          
// //           rounded={useColorModeValue("", "lg")}
// //           bg={useColorModeValue("white.100", "secondaries.800")}
// //         >
// //           <Stack spacing={"1"} py={12} px={4}
// //              bg={'#536F53'}
// //              rounded={"xl"}
// //             >
// //             <Stack align={"center"}>
// //               <Heading fontFamily={'vt323, monospace'} fontSize={"4xl"} color={"white"}>Sign in to your account </Heading>
// //             </Stack>
// //             <Box
             
// //               px={"5"}
// //               py={"4"}         
// //             >
// //               <Formik
// //                 initialValues={{ email: "", password: "" }}
// //                 validationSchema={validateSchema}
// //                 onSubmit={handleLogin}
// //               >
// //                 {({ handleBlur, handleChange, values, handleSubmit }) => (
// //                   <form onSubmit={handleSubmit}>
// //                     <Stack spacing={"3"}>
// //                       <FormField
// //                         type="email"
// //                         placeholder="Email"
// //                         name="email"
// //                         label="Email Address"
// //                         value={values.email}
// //                         onChange={handleChange}
// //                         onBlur={handleBlur}
// //                       />
// //                       <FormField
// //                         label="Password"
// //                         type='password'
// //                         name="password"
// //                         value={values.password}
// //                         onChange={handleChange}
// //                         onBlur={handleBlur}
// //                         placeholder="Password"
// //                       />
// //                       <Button
// //                         bg={"#BE913E"}
// //                         color={"white"}
// //                         _hover={{
// //                           bg: "CCBA63",
// //                         }}
// //                         type="submit"
// //                         isLoading={loading}
// //                         fontSize={30}
// //                       >
// //                         Sign in
// //                       </Button>
// //                     </Stack>
// //                   </form>
// //                 )}
// //               </Formik>
// //             </Box>
// //           </Stack>
// //         </Flex>
// //       </Flex>
// //     </Layout>

// //   );
// // }

// // export default publicRoute(Loginpage);

// // import {
// //   Flex,
// //   Box,
// //   Stack,
// //   Button,
// //   Heading,
// //   useColorModeValue,
// // } from "@chakra-ui/react";
// // import { Formik } from "formik";
// // import { toast } from "react-toastify";
// // import * as Yup from "yup";
// // import { useContext, useState } from "react";
// // import Layout from "../components/Layout";
// // import FormField from "../components/FormField";
// // import { userLogin } from "../action/user";
// // import AppContext from "../context/AppContext";
// // import publicRoute from "../routers/publicRoute";

// // const validateSchema = Yup.object({
// //   email: Yup.string().email("Invalid email address").required("Required"),
// //   password: Yup.string().required("Required"),
// // });

// // function Loginpage() {
// //   const { dispatchUser, dispatchEvents } = useContext(AppContext);
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = async (values) => {
// //     console.log(values);
// //     try {
// //       setLoading(true);
// //       const data = await userLogin(values, "user", dispatchUser, dispatchEvents);
// //       if (data?.error) toast.error(data.error);
// //     } catch (e) {
// //       console.log(e);
// //       toast.error("Something Went Wrong");
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <Layout>
// //       <Flex
// //         align="center"
// //         justify="center"
// //         px={{ base: "16px", md: "48px", lg: "64px" }}
// //         py="12vh"
// //         w="100vw"
// //         minH="100vh"
// //         className="scanlines"
// //         bg="hsl(220, 40%, 5%)"
// //       >
// //         <Box
// //           bg="hsl(220, 40%, 7%)" // Card background
// //           border="1px solid"
// //           borderColor="hsl(217, 33%, 17%)"
// //           boxShadow="0 0 20px hsl(188, 100%, 45%, 0.4)"
// //           rounded="md"
// //           px={8}
// //           py={10}
// //           maxW="400px"
// //           w="full"
// //           color="hsl(210, 40%, 100%)"
// //         >
// //           <Stack spacing={6} align="center" mb={6}>
// //             <Heading
// //               fontFamily="Orbitron, monospace"
// //               fontSize="4xl"
// //               color="hsl(188, 100%, 45%)"
// //               textAlign="center"
// //             >
// //               Sign in
// //             </Heading>
// //           </Stack>

// //           <Formik
// //             initialValues={{ email: "", password: "" }}
// //             validationSchema={validateSchema}
// //             onSubmit={handleLogin}
// //           >
// //             {({ handleBlur, handleChange, values, handleSubmit }) => (
// //               <form onSubmit={handleSubmit}>
// //                 <Stack spacing={4}>
// //                   <FormField
// //                     type="email"
// //                     placeholder="Email"
// //                     name="email"
// //                     label="Email Address"
// //                     value={values.email}
// //                     onChange={handleChange}
// //                     onBlur={handleBlur}
// //                   />
// //                   <FormField
// //                     label="Password"
// //                     type="password"
// //                     name="password"
// //                     value={values.password}
// //                     onChange={handleChange}
// //                     onBlur={handleBlur}
// //                     placeholder="Password"
// //                   />
// //                   <Button
// //                     type="submit"
// //                     isLoading={loading}
// //                     bg="hsl(188, 100%, 45%)" // Electric cyan
// //                     color="hsl(220, 40%, 5%)" // Dark text for contrast
// //                     fontFamily="Rajdhani, sans-serif"
// //                     fontWeight="600"
// //                     fontSize="lg"
// //                     _hover={{
// //                       bg: "hsl(188, 100%, 55%)",
// //                       boxShadow: "0 0 20px hsl(188, 100%, 55%, 0.6)",
// //                     }}
// //                   >
// //                     Sign In
// //                   </Button>
// //                 </Stack>
// //               </form>
// //             )}
// //           </Formik>
// //         </Box>
// //       </Flex>
// //     </Layout>
// //   );
// // }

// // export default publicRoute(Loginpage);


// import {
//   Flex,
//   Box,
//   Stack,
//   Button,
//   Heading,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { Formik } from "formik";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import { useContext, useState } from "react";
// import Layout from "../components/Layout";
// import FormField from "../components/FormField";
// import { userLogin } from "../action/user";
// import AppContext from "../context/AppContext";
// import publicRoute from "../routers/publicRoute";

// const validateSchema = Yup.object({
//   email: Yup.string().email("Invalid email address").required("Required"),
//   password: Yup.string().required("Required"),
// });

// function Loginpage() {
//   const { dispatchUser, dispatchEvents } = useContext(AppContext);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (values) => {
//     try {
//       setLoading(true);
//       const data = await userLogin(values, "user", dispatchUser, dispatchEvents);
//       if (data?.error) toast.error(data.error);
//     } catch (e) {
//       console.log(e);
//       toast.error("Something Went Wrong");
//     }
//     setLoading(false);
//   };

//   // Pull colors from theme
//   const bgCard = useColorModeValue("background.200", "background.200");
//   const textColor = useColorModeValue("foreground.100", "foreground.100");
//   const primaryColor = useColorModeValue("primary.400", "primary.400");
//   const primaryHover = useColorModeValue("primary.100", "primary.100");
//   const borderColor = useColorModeValue("border.100", "border.100");

//   return (
//     <Layout>
//       <Flex
//         align="center"
//         justify="center"
//         px={{ base: "16px", md: "48px", lg: "64px" }}
//         py="6vh"
//         w="100vw"
//         minH="70vh"
//         className="scanlines"
//         bg="background.100"
//       >
//         <Box
//           bg={bgCard} 
//           border="1px solid"
//           borderColor={borderColor}
//           boxShadow="0 0 20px hsl(265, 82%, 70% , 0.4)"
//           rounded="md"
//           px={8}
//           py={10}
//           maxW="400px"
//           w="full"
//           color={textColor}
//         >
//           <Stack spacing={6} align="center" mb={6}>
//             <Heading
//               fontFamily="heading"
//               fontSize="4xl"
//               color={primaryColor}
//               textAlign="center"
//               textShadow={`0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}`}
//             >
//               Sign in
//             </Heading>
//           </Stack>

//           <Formik
//             initialValues={{ email: "", password: "" }}
//             validationSchema={validateSchema}
//             onSubmit={handleLogin}
//           >
//             {({ handleBlur, handleChange, values, handleSubmit }) => (
//               <form onSubmit={handleSubmit}>
//                 <Stack spacing={4}>
//                   <FormField
//                     type="email"
//                     placeholder="Email"
//                     name="email"
//                     label="Email Address"
//                     value={values.email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     focusBorderColor={primaryColor}
//                     color={textColor}
//                     bg={bgCard}
//                   />
//                   <FormField
//                     label="Password"
//                     type="password"
//                     name="password"
//                     value={values.password}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     placeholder="Password"
//                     focusBorderColor={primaryColor}
//                     color={textColor}
//                     bg={bgCard}
//                   />
//                   <Button
//                     type="submit"
//                     isLoading={loading}
//                     bg={primaryColor}
//                     color="background.100"
//                     fontFamily="body"
//                     fontWeight="600"
//                     fontSize="lg"
//                     _hover={{
//                       bg: primaryHover,
//                       boxShadow: "0 0 20px hsl(188, 100%, 55%, 0.6)",
//                     }}
//                   >
//                     Sign In
//                   </Button>
//                 </Stack>
//               </form>
//             )}
//           </Formik>
//         </Box>
//       </Flex>
//     </Layout>
//   );
// }

// export default publicRoute(Loginpage);

import {
  chakra,
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import FormField from "../components/FormField";
import { userLogin } from "../action/user";
import AppContext from "../context/AppContext";
import publicRoute from "../routers/publicRoute";

const validateSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

function Loginpage() {
  const router = useRouter();
  const { dispatchUser, dispatchEvents } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const data = await userLogin(values, "user", dispatchUser, dispatchEvents);
      if (data?.error) {
        toast.error(data.error);
      } else if (data?.message && !data?.id) {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  // Theme colors
  const textColor = "#F8FAFC";
  const primaryColor = "#38D9A9";

  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        px={{ base: "16px", md: "48px", lg: "64px" }}
        py="8vh"
        w="100%"
        minH="70vh"
      >
        <Box
          position="relative"
          bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)"
          backdropFilter="blur(16px)"
          border="1px solid rgba(56, 217, 169, 0.4)"
          boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
          rounded="none"
          px={{ base: 6, sm: 8 }}
          py={10}
          maxW="420px"
          w="full"
          color={textColor}
          overflow="hidden"
        >
          {/* 4 Corner HUD Brackets matching Pulzion 26 */}
          <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          {/* Top subtle glow */}
          <Box position="absolute" top="-50px" left="50%" transform="translateX(-50%)" w="200px" h="100px" bg="#38D9A9" filter="blur(60px)" opacity={0.2} pointerEvents="none" />

          {/* Scanlines */}
          <Box position="absolute" inset={0} bg="repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 4px)" pointerEvents="none" />

          <Stack spacing={6} align="center" mb={6} position="relative" zIndex={10}>
            <Heading
              fontFamily="'Orbitron', sans-serif !important"
              fontSize={{ base: "3xl", md: "4xl" }}
              color="#FFFFFF"
              textAlign="center"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              SIGN <chakra.span color="#38D9A9" textShadow="0 0 15px rgba(56, 217, 169, 0.6)">IN</chakra.span>
            </Heading>
            <chakra.p
              fontFamily="'Inter', sans-serif"
              fontSize="xs"
              color="gray.400"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mt={-3}
            >
              AUTHENTICATE TO ACCESS MISSION
            </chakra.p>
          </Stack>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validateSchema}
            onSubmit={handleLogin}
          >
            {({ handleBlur, handleChange, values, handleSubmit }) => (
              <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 10 }}>
                <Stack spacing={5} fontFamily="'Inter', sans-serif">
                  <FormField
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    focusBorderColor={primaryColor}
                    color={textColor}
                  />
                  <FormField
                    label="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    focusBorderColor={primaryColor}
                    color={textColor}
                  />



                  <Button
                    type="submit"
                    isLoading={loading}
                    bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                    color="#030512"
                    fontFamily="'Inter', sans-serif"
                    fontWeight="extrabold"
                    letterSpacing="0.15em"
                    fontSize="md"
                    textTransform="uppercase"
                    rounded="md"
                    h="44px"
                    boxShadow="0 0 20px rgba(56, 217, 169, 0.3)"
                    _hover={{
                      bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                      boxShadow: "0 0 30px rgba(56, 217, 169, 0.6)",
                      transform: "translateY(-1px)",
                    }}
                    _active={{
                      transform: "scale(0.98)",
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
}

export default publicRoute(Loginpage);

