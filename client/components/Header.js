import {
  Box,
  Button,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import Link from "next/link";
import AppContext from "../context/AppContext";
import { logout } from "../action/user";

const Header = () => {
  const { user, dispatchUser, dispatchEvents } = useContext(AppContext);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const data = await logout(dispatchUser, dispatchEvents);
      if (data?.error) {
        console.log(data.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      w="full"
      bg="rgba(3, 8, 23, 0.85)"
      backdropFilter="blur(20px)"
      borderBottom="1px solid rgba(56, 217, 169, 0.2)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.65)"
    >
      {/* Bottom glowing cyber accent line */}
      <Box
        position="absolute"
        insetX={0}
        bottom={0}
        h="1px"
        bgGradient="linear(to-r, transparent, rgba(56, 217, 169, 0.7), transparent)"
        pointerEvents="none"
      />

      <Flex
        alignItems="center"
        justifyContent="space-between"
        h="70px"
        px={{
          base: "4",
          sm: "6",
          md: "8",
          lg: "16",
        }}
      >
        {/* Pulzion Logo on the left */}
        <Link href="/" passHref>
          <Box as="a" cursor="pointer" display="flex" alignItems="center" aria-label="Pulzion '26 Home">
            <Image
              src="/logo.png"
              alt="Pulzion '26"
              h={{ base: "48px", sm: "56px", md: "62px" }}
              w="auto"
              objectFit="contain"
              filter="drop-shadow(0 0 12px rgba(56, 217, 169, 0.35))"
              transition="all 0.3s"
              _hover={{
                filter: "drop-shadow(0 0 18px rgba(34, 211, 238, 0.7))",
              }}
            />
          </Box>
        </Link>

        {/* Right side actions */}
        <Flex alignItems="center" gap={4}>
          {user?.name && (
            <Box
              display={{ base: "none", sm: "flex" }}
              alignItems="center"
              gap={2}
              px={3}
              py={1}
              rounded="full"
              border="1px solid rgba(56, 217, 169, 0.3)"
              bg="rgba(7, 17, 38, 0.6)"
            >
              <Box w="6px" h="6px" rounded="full" bg="#38D9A9" boxShadow="0 0 8px #38D9A9" />
              <Text
                fontFamily="'Oxanium', sans-serif"
                fontSize="xs"
                fontWeight="semibold"
                color="#CBD5E1"
                letterSpacing="0.05em"
              >
                {user.name}
              </Text>
            </Box>
          )}

          {user?.id && (
            <Button
              onClick={handleLogout}
              isLoading={loggingOut}
              loadingText="Logging Out..."
              fontFamily="'Oxanium', sans-serif"
              fontSize="xs"
              fontWeight="extrabold"
              letterSpacing="0.15em"
              textTransform="uppercase"
              rounded="full"
              px={{ base: 4, md: 5 }}
              h="36px"
              bg="rgba(5, 11, 29, 0.9)"
              border="1px solid rgba(56, 217, 169, 0.5)"
              color="#38D9A9"
              boxShadow="0 0 14px rgba(56, 217, 169, 0.2)"
              transition="all 0.2s"
              _hover={{
                bg: "#38D9A9",
                color: "#030612",
                borderColor: "#38D9A9",
                boxShadow: "0 0 20px rgba(56, 217, 169, 0.45)",
                transform: "translateY(-1px)",
              }}
              _active={{
                transform: "scale(0.97)",
              }}
            >
              Log Out
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
