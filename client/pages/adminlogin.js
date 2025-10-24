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

import React, { useState } from "react";
import {
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
import { useEffect } from "react";
import apiConfig from "../configs/api";

const validateSchema = Yup.object({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if admin is already logged in
  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminData = localStorage.getItem("admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          if (admin.token && admin.token.trim() !== '') {
            router.push('/admin');
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
      toast.error("Invalid Admin Credentials");
    }
    setLoading(false);
  };

  // 🎨 Use consistent theme colors
  const bgCard = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");
  const primaryHover = useColorModeValue("primary.100", "primary.100");
  const borderColor = useColorModeValue("border.100", "border.100");

  if (checkingAuth) {
    return (
      <Layout>
        <Flex
          align="center"
          justify="center"
          px={{ base: "16px", md: "48px", lg: "64px" }}
          py="6vh"
          w="100vw"
          minH="70vh"
          bg="background.100"
          className="scanlines"
        >
          <Text color={textColor}>Checking authentication...</Text>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        px={{ base: "16px", md: "48px", lg: "64px" }}
        py="6vh"
        w="100vw"
        minH="70vh"
        bg="background.100"
        className="scanlines"
      >
        <Box
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="0 0 20px hsl(265, 82%, 70%, 0.4)"
          rounded="md"
          px={8}
          py={10}
          maxW="400px"
          w="full"
          color={textColor}
        >
          <Stack spacing={6} align="center" mb={6}>
            <Heading
              fontFamily="heading"
              fontSize="4xl"
              color={primaryColor}
              textAlign="center"
              textShadow={`0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}`}
            >
              Admin Sign In
            </Heading>
          </Stack>

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validateSchema}
            onSubmit={handleLogin}
          >
            {({ handleBlur, handleChange, values, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormField
                    type="text"
                    placeholder="Username"
                    name="username"
                    label="Username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    focusBorderColor={primaryColor}
                    color={textColor}
                    bg={bgCard}
                  />
                  <FormField
                    label="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    focusBorderColor={primaryColor}
                    color={textColor}
                    bg={bgCard}
                  />
                  <Button
                    type="submit"
                    isLoading={loading}
                    bg={primaryColor}
                    color="background.100"
                    fontFamily="body"
                    fontWeight="600"
                    fontSize="lg"
                    _hover={{
                      bg: primaryHover,
                      boxShadow: "0 0 20px hsl(188, 100%, 55%, 0.6)",
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
