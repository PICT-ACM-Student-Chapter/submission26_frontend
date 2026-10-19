// import React, { useContext, useState } from 'react'
// import Layout from '../components/Layout'
// import { Box, Button, Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
// import { Formik } from 'formik'
// import FormField from '../components/FormField'
// import * as Yup from "yup";
// import AppContext from '../context/AppContext'
// import { userLogin } from '../action/user'
// import apiConfig from '../configs/api'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useRouter } from 'next/router'
// const validateSchema = Yup.object({
//   username: Yup.string().required("Required"),
//   password: Yup.string().required("Required")
// });

// const login = () => {
    
//   const [loading, setLoading] = useState(false);
//   const router=useRouter();
//   const handleLogin = async (values) => {
//     console.log(values);
    
//     try {
//       const options = {
//         method: "POST",
//         url: `${apiConfig.url}/admin/signin`,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: values,
//       };
//       const res = await axios(options);
//       localStorage.setItem(
//         "admin",
//         JSON.stringify({ token: res.data.token})
//       );
//       console.log(res);
//       router.push('/admin');
//     } catch (e) {
//       console.log(e)
//       toast.error('Invalid Admin')
//     }
//     setLoading(false)
//   }
//   return (
//     <Layout>
//       <Flex
//         alignItems={"center"}
//         justifyContent={"center"}
//         px={{
//           base: '64px',
//           md: '48px',
//           lg: '64px'
//         }}
//         py={"1px"}
//         w={"100vw"}
//       >
//         <Flex
//           align={"center"}
//           justify={"center"}
//           opacity={0.8}
          
//           rounded={useColorModeValue("", "lg")}
//           bg={useColorModeValue("white.100", "secondaries.800")}
//         >
//           <Stack spacing={"1"} py={12} px={4}
//             bgImage="/signup.png"  // Replace with your image URL
//             bgPosition="center"
//             bgRepeat="no-repeat"
//             bgSize="cover"
            
//             >
//             <Stack align={"center"}>
//               <Heading fontFamily={'vt323, monospace'} fontSize={"4xl"} color={"white"}>Admin sign in</Heading>
//             </Stack>
//             <Box
//               rounded={"lg"}
//               boxShadow={"md"}
//               px={"10"}
//               py={"4"}         
//             >
//               <Formik
//                 initialValues={{ username: "", password: "" }}
//                 validationSchema={validateSchema}
//                 onSubmit={handleLogin}
//               >
//                 {({ handleBlur, handleChange, values, handleSubmit }) => (
//                   <form onSubmit={handleSubmit}>
//                     <Stack spacing={"3"}>
//                       <FormField
//                         type="username"
//                         placeholder="username"
//                         name="username"
//                         label="Username"
//                         value={values.username}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         width={"full"}
//                       />
//                       <FormField
//                         label="Password"
//                         type='password'
//                         name="password"
//                         value={values.password}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         placeholder="Password"
//                         width={"full"}
//                       />
//                       <Button
//                         bg={"#BE913E"}
//                         color={"white"}
//                         _hover={{
//                           bg: "#CCBA63",
//                         }}
//                         type="submit"
//                         isLoading={loading}
//                         fontSize={30}
//                       >
//                         Sign in
//                       </Button>
//                     </Stack>
//                   </form>
//                 )}
//               </Formik>
//             </Box>
//           </Stack>
//         </Flex>
//       </Flex>
//     </Layout>
//   )

// }

// export default login;

import React, { useState, useEffect } from "react";
import {
  chakra,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import FormField from "../components/FormField";
import apiConfig from "../configs/api";
import ContentLoader from "../components/ContentLoader";

const validateSchema = Yup.object({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminData = localStorage.getItem("admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          if (admin.token && admin.token.trim() !== '') {
            router.push('/admin');
            return;
          } else {
            localStorage.removeItem("admin");
          }
        }
      } catch (error) {
        console.error('Error checking admin authentication:', error);
        localStorage.removeItem("admin");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiConfig.url}/admin/signin`, values, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem(
        "admin",
        JSON.stringify({ token: res.data.token })
      );
      toast.success("Login Successful!");
      router.push("/admin");
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.error || e?.response?.data?.message || "Invalid Admin Credentials");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Use consistent theme colors
  const textColor = "#F8FAFC";
  const primaryColor = "#38D9A9";

  if (checkingAuth) {
    return <ContentLoader text="AUTHENTICATING ADMIN ACCESS..." />;
  }

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
          {/* 4 Corner HUD Brackets */}
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
              ADMIN <chakra.span color="#38D9A9" textShadow="0 0 15px rgba(56, 217, 169, 0.6)">SIGN IN</chakra.span>
            </Heading>
            <chakra.p
              fontFamily="'Inter', sans-serif"
              fontSize="xs"
              color="gray.400"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mt={-3}
            >
              MISSION CONTROL ACCESS PORTAL
            </chakra.p>
          </Stack>

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validateSchema}
            onSubmit={handleLogin}
          >
            {({ handleBlur, handleChange, values, handleSubmit }) => (
              <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 10 }}>
                <Stack spacing={5} fontFamily="'Inter', sans-serif">
                  <FormField
                    type="text"
                    placeholder="Enter admin username"
                    name="username"
                    label="Username"
                    value={values.username}
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
                    placeholder="Enter admin password"
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
};

export default AdminLogin;
