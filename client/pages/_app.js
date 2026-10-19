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
import "../styles/globals.css";
import ContentLoader from "../components/ContentLoader";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, dispatchUser] = useReducer(userReducer, {});
  const [contEvents, dispatchEvents] = useReducer(eventsReducer, []);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    // If no active session token exists in localStorage, skip initial load screen immediately
    const submission =
      typeof window !== "undefined" ? localStorage.getItem("submission") : null;

    if (!submission) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userData = await loadUser(dispatchUser, dispatchEvents);
        if (userData?.error) {
          console.log(userData?.error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleStart = (url, { shallow }) => {
      if (!shallow && url !== router.asPath) {
        setRouteLoading(true);
      }
    };
    const handleComplete = () => {
      setRouteLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
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
            href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap"
            rel="stylesheet"
          />
          <title>Pulzion 26 | Submission</title>
        </Head>
        <ToastContainer />
        {loading || routeLoading ? (
          <ContentLoader
            text={
              routeLoading
                ? "NAVIGATING MISSION SECTOR..."
                : "INITIALIZING MISSION INTERFACE..."
            }
          />
        ) : (
          <Component {...pageProps} />
        )}
      </ChakraProvider>
    </AppContext.Provider>
  );
}

export default MyApp;
