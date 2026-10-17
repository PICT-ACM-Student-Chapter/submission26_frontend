import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../themes/index";
import Head from "next/head";
import { useEffect, useReducer, useState } from "react";
import { ToastContainer } from "react-toastify";
import AppContext from "../context/AppContext";
import userReducer from "../reducers/userReducer";
import eventsReducer from "../reducers/eventsReducer";
import { loadUser } from "../action/user";

import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import ContentLoader from "../components/ContentLoader";

function MyApp({ Component, pageProps }) {
  const [user, dispatchUser] = useReducer(userReducer, {});
  const [contEvents, dispatchEvents] = useReducer(eventsReducer, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await loadUser(dispatchUser, dispatchEvents);
        if (userData?.error) {
          console.log(userData?.error);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return loading ? (
    <ContentLoader />
  ) : (
    <AppContext.Provider
      value={{
        user,
        dispatchUser,
        contEvents,
        dispatchEvents,
      }}
    >
      <ChakraProvider theme={customTheme}>
        <Head>
          <link rel="icon" href="/favicon-P.png" />
          <link rel="shortcut icon" href="/favicon-P.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <title>Pulzion 26 | Submission</title>
        </Head>
        <ToastContainer />
        <Component {...pageProps} />
      </ChakraProvider>
    </AppContext.Provider>
  );
}

export default MyApp;
