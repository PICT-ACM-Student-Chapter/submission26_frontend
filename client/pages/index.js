// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Button,
//   Heading,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { Formik } from "formik";
// import { toast } from 'react-toastify';
// import * as Yup from "yup";
// import { useContext, useState } from "react";
// import Layout from "../components/Layout";
// import FormField from "../components/FormField";
// import { userLogin } from "../action/user";
// import AppContext from "../context/AppContext";
// import publicRoute from "../routers/publicRoute";

// const validateSchema = Yup.object({
//   email: Yup.string().email("Invalid email address").required("Required"),
//   password: Yup.string().required("Required")
// });

// function Loginpage() {

//   const { dispatchUser, dispatchEvents } = useContext(AppContext);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (values) => {
//     console.log(values);
//     try {
//       setLoading(true);
//       const data = await userLogin(values, 'user', dispatchUser, dispatchEvents);
//       if (data?.error) {
//         toast.error(data.error);
//       }
//     } catch (e) {
//       console.log(e)
//       toast.error('Something Went Wrong')
//     }
//     setLoading(false)
//   }

//   return (
//     <Layout>
//       <Flex
//         alignItems={"center"}
//         justifyContent={"center"}
//         px={{
//           base: '16px',
//           md: '48px',
//           lg: '64px'
//         }}
//         py={"1px"}
//         w={"100%"}
//       >
//         <Flex
//           align={"center"}
//           justify={"center"}
//           opacity={0.8}
          
//           rounded={useColorModeValue("", "lg")}
//           bg={useColorModeValue("white.100", "secondaries.800")}
//         >
//           <Stack spacing={"1"} py={12} px={4}
//              bg={'#536F53'}
//              rounded={"xl"}
//             >
//             <Stack align={"center"}>
//               <Heading fontFamily={'vt323, monospace'} fontSize={"4xl"} color={"white"}>Sign in to your account </Heading>
//             </Stack>
//             <Box
             
//               px={"5"}
//               py={"4"}         
//             >
//               <Formik
//                 initialValues={{ email: "", password: "" }}
//                 validationSchema={validateSchema}
//                 onSubmit={handleLogin}
//               >
//                 {({ handleBlur, handleChange, values, handleSubmit }) => (
//                   <form onSubmit={handleSubmit}>
//                     <Stack spacing={"3"}>
//                       <FormField
//                         type="email"
//                         placeholder="Email"
//                         name="email"
//                         label="Email Address"
//                         value={values.email}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                       />
//                       <FormField
//                         label="Password"
//                         type='password'
//                         name="password"
//                         value={values.password}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         placeholder="Password"
//                       />
//                       <Button
//                         bg={"#BE913E"}
//                         color={"white"}
//                         _hover={{
//                           bg: "CCBA63",
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

//   );
// }

// export default publicRoute(Loginpage);

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
//     console.log(values);
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

//   return (
//     <Layout>
//       <Flex
//         align="center"
//         justify="center"
//         px={{ base: "16px", md: "48px", lg: "64px" }}
//         py="12vh"
//         w="100vw"
//         minH="100vh"
//         className="scanlines"
//         bg="hsl(220, 40%, 5%)"
//       >
//         <Box
//           bg="hsl(220, 40%, 7%)" // Card background
//           border="1px solid"
//           borderColor="hsl(217, 33%, 17%)"
//           boxShadow="0 0 20px hsl(188, 100%, 45%, 0.4)"
//           rounded="md"
//           px={8}
//           py={10}
//           maxW="400px"
//           w="full"
//           color="hsl(210, 40%, 100%)"
//         >
//           <Stack spacing={6} align="center" mb={6}>
//             <Heading
//               fontFamily="Orbitron, monospace"
//               fontSize="4xl"
//               color="hsl(188, 100%, 45%)"
//               textAlign="center"
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
//                   />
//                   <FormField
//                     label="Password"
//                     type="password"
//                     name="password"
//                     value={values.password}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     placeholder="Password"
//                   />
//                   <Button
//                     type="submit"
//                     isLoading={loading}
//                     bg="hsl(188, 100%, 45%)" // Electric cyan
//                     color="hsl(220, 40%, 5%)" // Dark text for contrast
//                     fontFamily="Rajdhani, sans-serif"
//                     fontWeight="600"
//                     fontSize="lg"
//                     _hover={{
//                       bg: "hsl(188, 100%, 55%)",
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
  const { dispatchUser, dispatchEvents } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const data = await userLogin(values, "user", dispatchUser, dispatchEvents);
      if (data?.error) toast.error(data.error);
    } catch (e) {
      console.log(e);
      toast.error("Something Went Wrong");
    }
    setLoading(false);
  };

  // Pull colors from theme
  const bgCard = useColorModeValue("background.200", "background.200");
  const textColor = useColorModeValue("foreground.100", "foreground.100");
  const primaryColor = useColorModeValue("primary.400", "primary.400");
  const primaryHover = useColorModeValue("primary.100", "primary.100");
  const borderColor = useColorModeValue("border.100", "border.100");

  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        px={{ base: "16px", md: "48px", lg: "64px" }}
        py="6vh"
        w="100vw"
        minH="70vh"
        className="scanlines"
        bg="background.100"
      >
        <Box
          bg={bgCard} 
          border="1px solid"
          borderColor={borderColor}
          boxShadow="0 0 20px hsl(265, 82%, 70% , 0.4)"
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
              Sign in
            </Heading>
          </Stack>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validateSchema}
            onSubmit={handleLogin}
          >
            {({ handleBlur, handleChange, values, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormField
                    type="email"
                    placeholder="Email"
                    name="email"
                    label="Email Address"
                    value={values.email}
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
}

export default publicRoute(Loginpage);
