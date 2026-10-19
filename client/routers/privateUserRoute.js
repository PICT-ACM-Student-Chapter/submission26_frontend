import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useRouter } from "next/router";
import ContentLoader from "../components/ContentLoader";
import Layout from "../components/Layout";
import axios from "axios";
import apiConfig from "../configs/api";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  chakra,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  WarningIcon,
  ChevronLeftIcon,
  RepeatIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";
import { toast } from "react-toastify";

/**
 * Resolves the required competition event based on pathname or explicit parameter
 */
const resolveRequiredEvent = (pathname, asPath, explicitEvent) => {
  if (explicitEvent) {
    const key = String(explicitEvent).toLowerCase().trim();
    if (key === "hacknova") {
      return {
        key: "hacknova",
        name: "HackNova",
        emsId: 20,
        matches: (ev) => {
          const id = Number(ev.event_id || ev.id || ev.fk_event);
          const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
          const name = String(ev.event_name || "").toLowerCase();
          return id === 20 || id === 200 || route.includes("hacknova") || name.includes("hacknova");
        },
      };
    }
    if (key === "freeze") {
      return {
        key: "freeze",
        name: "Freeze The Second",
        emsId: 10,
        matches: (ev) => {
          const id = Number(ev.event_id || ev.id || ev.fk_event);
          const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
          const name = String(ev.event_name || "").toLowerCase();
          return id === 10 || route.includes("freeze") || name.includes("freeze");
        },
      };
    }
    if (key === "innowave") {
      return {
        key: "innowave",
        name: "Innowave",
        emsId: 12,
        matches: (ev) => {
          const id = Number(ev.event_id || ev.id || ev.fk_event);
          const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
          const name = String(ev.event_name || "").toLowerCase();
          return id === 12 || route.includes("innowave") || name.includes("innowave");
        },
      };
    }
    if (key === "rootcause") {
      return {
        key: "rootcause",
        name: "Root Cause",
        emsId: 21,
        matches: (ev) => {
          const id = Number(ev.event_id || ev.id || ev.fk_event);
          const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
          const name = String(ev.event_name || "").toLowerCase();
          return id === 21 || route.includes("rootcause") || name.includes("rootcause");
        },
      };
    }
  }

  // Auto-detect from router pathname or asPath
  const path = (pathname || "").toLowerCase();
  const cleanAsPath = (asPath || "").toLowerCase();

  if (path === "/dashboard" || path === "/" || path === "") {
    return null; // Dashboard and root are not restricted to a single event
  }

  if (path.includes("hacknova") || cleanAsPath.includes("hacknova")) {
    return {
      key: "hacknova",
      name: "HackNova",
      emsId: 20,
      matches: (ev) => {
        const id = Number(ev.event_id || ev.id || ev.fk_event);
        const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
        const name = String(ev.event_name || "").toLowerCase();
        return id === 20 || id === 200 || route.includes("hacknova") || name.includes("hacknova");
      },
    };
  }

  if (path.includes("freeze") || cleanAsPath.includes("freeze")) {
    return {
      key: "freeze",
      name: "Freeze The Second",
      emsId: 10,
      matches: (ev) => {
        const id = Number(ev.event_id || ev.id || ev.fk_event);
        const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
        const name = String(ev.event_name || "").toLowerCase();
        return id === 10 || route.includes("freeze") || name.includes("freeze");
      },
    };
  }

  if (path.includes("innowave") || cleanAsPath.includes("innowave")) {
    return {
      key: "innowave",
      name: "Innowave",
      emsId: 12,
      matches: (ev) => {
        const id = Number(ev.event_id || ev.id || ev.fk_event);
        const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
        const name = String(ev.event_name || "").toLowerCase();
        return id === 12 || route.includes("innowave") || name.includes("innowave");
      },
    };
  }

  if (path.includes("rootcause") || cleanAsPath.includes("rootcause")) {
    return {
      key: "rootcause",
      name: "Root Cause",
      emsId: 21,
      matches: (ev) => {
        const id = Number(ev.event_id || ev.id || ev.fk_event);
        const route = String(ev.event_route || "").toLowerCase().replace(/^\//, "");
        const name = String(ev.event_name || "").toLowerCase();
        return id === 21 || route.includes("rootcause") || name.includes("rootcause");
      },
    };
  }

  return null;
};

const privateUserRoute = (Component, explicitEvent = null) => {
  const Auth = (props) => {
    const { user, contEvents, dispatchEvents } = useContext(AppContext);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [checking, setChecking] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [targetEvent, setTargetEvent] = useState(null);
    const backendUrl = apiConfig.url;

    const verifyAccess = async (target) => {
      const submission =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("submission") || "null")
          : null;

      if (!submission || !submission.token) {
        router.push("/");
        return;
      }

      // If page is not event-restricted (e.g. /dashboard)
      if (!target) {
        setIsAllowed(true);
        // Refresh registered events in background on dashboard
        try {
          const res = await axios.get(`${backendUrl}/user/user_events`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${submission.token}`,
            },
          });
          const eventsList = Array.isArray(res.data) ? res.data : [];
          setRegisteredEvents(eventsList);
          if (dispatchEvents) {
            dispatchEvents({
              type: "SET_EVENTS",
              events: eventsList,
            });
          }
        } catch (e) {
          // Ignore background fetch error on dashboard
        }
        setChecking(false);
        return;
      }

      try {
        setChecking(true);
        // Fetch fresh event registrations directly from NEXT_PUBLIC_BACKEND_URL /user/user_events
        const res = await axios.get(`${backendUrl}/user/user_events`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${submission.token}`,
          },
        });

        const eventsList = Array.isArray(res.data) ? res.data : [];
        setRegisteredEvents(eventsList);

        if (dispatchEvents) {
          dispatchEvents({
            type: "SET_EVENTS",
            events: eventsList,
          });
        }

        // Verify if user is registered for target event
        const hasEvent = eventsList.some((ev) => target.matches(ev));

        if (hasEvent) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
          toast.error(
            `Access Denied: You have not checked or registered for ${target.name}. Please check your dashboard.`,
            { toastId: `not-reg-${target.key}` }
          );
        }
      } catch (err) {
        console.error("Error verifying registration from /user/user_events:", err);
        // Fallback to context if network error occurs
        if (Array.isArray(contEvents) && contEvents.length > 0) {
          setRegisteredEvents(contEvents);
          const hasEvent = contEvents.some((ev) => target.matches(ev));
          setIsAllowed(hasEvent);
        } else {
          setIsAllowed(false);
        }
      } finally {
        setChecking(false);
      }
    };

    useEffect(() => {
      setMounted(true);
      if (!user?.id || user?.type !== "user") {
        router.push("/");
        return;
      }

      const target = resolveRequiredEvent(router.pathname, router.asPath, explicitEvent);
      setTargetEvent(target);
      verifyAccess(target);
    }, [user, router.pathname, router.asPath]);

    // SSR or Initial Mount Loading
    if (!mounted || checking) {
      return <ContentLoader />;
    }

    // User is not authenticated
    if (!user?.id || user?.type !== "user") {
      router.push("/");
      return <ContentLoader />;
    }

    // User is authorized for this route
    if (isAllowed) {
      return <Component {...props} />;
    }

    // Access Restricted Screen (User manually typed route without being registered)
    const currentRouteDisplay = router.asPath || router.pathname;

    return (
      <Layout>
        <Box
          pt={{ base: 8, md: 14 }}
          pb="80px"
          px={{ base: "16px", md: "48px" }}
          maxW="3xl"
          mx="auto"
        >
          <Box
            position="relative"
            p={{ base: 6, md: 8 }}
            bg="linear-gradient(180deg, rgba(20, 10, 25, 0.95) 0%, rgba(12, 6, 18, 0.95) 100%)"
            border="1px solid rgba(239, 68, 68, 0.5)"
            boxShadow="0 0 35px rgba(239, 68, 68, 0.25), 0 12px 32px rgba(0, 0, 0, 0.9)"
            borderRadius="md"
            overflow="hidden"
            textAlign="center"
          >
            {/* 4 Corner HUD Brackets in Red */}
            <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #EF4444" borderTop="2px solid #EF4444" pointerEvents="none" />
            <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #EF4444" borderTop="2px solid #EF4444" pointerEvents="none" />
            <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #EF4444" borderBottom="2px solid #EF4444" pointerEvents="none" />
            <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #EF4444" borderBottom="2px solid #EF4444" pointerEvents="none" />

            <Flex justify="center" mb={4}>
              <Flex
                align="center"
                justify="center"
                w="58px"
                h="58px"
                rounded="full"
                bg="rgba(239, 68, 68, 0.15)"
                border="1px solid #EF4444"
                color="#EF4444"
                boxShadow="0 0 20px rgba(239, 68, 68, 0.4)"
              >
                <WarningIcon w={7} h={7} />
              </Flex>
            </Flex>

            <Badge
              px={3}
              py={1}
              bg="rgba(239, 68, 68, 0.15)"
              color="#EF4444"
              border="1px solid rgba(239, 68, 68, 0.4)"
              fontFamily="'Inter', sans-serif"
              fontSize="xs"
              letterSpacing="0.15em"
              mb={3}
            >
              ACCESS RESTRICTED • YOU HAVE NOT CHECKED
            </Badge>

            <chakra.h2
              fontFamily="'Orbitron', sans-serif !important"
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              fontWeight="bold"
              color="#FFFFFF"
              letterSpacing="0.08em"
              textTransform="uppercase"
              mb={3}
            >
              YOU HAVE NOT CHECKED FOR THIS EVENT
            </chakra.h2>

            <Text
              fontFamily="'Inter', sans-serif"
              fontSize="sm"
              color="gray.300"
              lineHeight="tall"
              mb={5}
              maxW="xl"
              mx="auto"
            >
              We verified your registration from{" "}
              <chakra.span color="#38D9A9" fontFamily="'Share Tech Mono', monospace">
                {backendUrl}/user/user_events
              </chakra.span>
              . You have not checked or registered for{" "}
              <chakra.span fontWeight="bold" color="#FFFFFF">
                {targetEvent?.name || "this event"}
              </chakra.span>{" "}
              on Pulzion EMS.
              <br />
              If you manually typed this route (
              <chakra.span color="#EF4444" fontWeight="semibold">
                {currentRouteDisplay}
              </chakra.span>
              ), access cannot be granted. Please check your registered events on your dashboard.
            </Text>

            {/* Show registered events if any */}
            {registeredEvents.length > 0 ? (
              <Box
                p={4}
                mb={6}
                bg="rgba(7, 16, 36, 0.7)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="md"
                textAlign="left"
              >
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  color="#38D9A9"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb={3}
                >
                  Your Active Registered Events:
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2.5}>
                  {registeredEvents.map((ev, idx) => {
                    const evRoute = (ev.event_route || "").replace(/^\/?/, "/");
                    const evName = ev.event_name || ev.name || "Event";
                    return (
                      <NextLink key={idx} href={evRoute} passHref>
                        <Button
                          as="a"
                          size="sm"
                          variant="outline"
                          borderColor="rgba(56, 217, 169, 0.4)"
                          color="#FFFFFF"
                          fontFamily="'Inter', sans-serif"
                          fontSize="xs"
                          justifyContent="space-between"
                          _hover={{
                            bg: "rgba(56, 217, 169, 0.15)",
                            borderColor: "#38D9A9",
                            color: "#38D9A9",
                          }}
                        >
                          <span>{evName}</span>
                          <ArrowForwardIcon />
                        </Button>
                      </NextLink>
                    );
                  })}
                </SimpleGrid>
              </Box>
            ) : (
              <Box
                p={3.5}
                mb={6}
                bg="rgba(239, 68, 68, 0.08)"
                border="1px solid rgba(239, 68, 68, 0.25)"
                borderRadius="md"
              >
                <Text fontFamily="'Inter', sans-serif" fontSize="xs" color="#FCA5A5">
                  You currently have no checked or registered events with accepted payment. Please register and complete payment on Pulzion EMS.
                </Text>
              </Box>
            )}

            {/* Action Buttons */}
            <Flex justify="center" align="center" wrap="wrap" gap={3}>
              <NextLink href="/dashboard" passHref>
                <Button
                  as="a"
                  size="md"
                  leftIcon={<ChevronLeftIcon />}
                  bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                  color="#030512"
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  boxShadow="0 0 15px rgba(56, 217, 169, 0.3)"
                  _hover={{
                    bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                    boxShadow: "0 0 25px rgba(56, 217, 169, 0.5)",
                  }}
                >
                  Back to Dashboard (Check Events)
                </Button>
              </NextLink>

              <Button
                size="md"
                leftIcon={<RepeatIcon />}
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="#CBD5E1"
                fontFamily="'Inter', sans-serif"
                fontSize="xs"
                letterSpacing="0.1em"
                textTransform="uppercase"
                onClick={() => verifyAccess(targetEvent)}
                _hover={{ bg: "rgba(255, 255, 255, 0.1)", color: "#FFFFFF" }}
              >
                Re-Check Registration Status
              </Button>
            </Flex>
          </Box>
        </Box>
      </Layout>
    );
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }
  return Auth;
};

export default privateUserRoute;
