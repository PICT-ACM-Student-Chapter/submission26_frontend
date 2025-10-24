import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { SwitchThemeButton } from "./Util/SwitchTheme";
import Link from "next/link";
import * as styles from "../styles/header.module.css";
import { ChevronDownIcon } from "@chakra-ui/icons";
import AppContext from "../context/AppContext";
import { logout } from "../action/user";

const Header = () => {
  const { colorMode } = useColorMode();
  const { user, dispatchUser, dispatchEvents } = useContext(AppContext);
  const handleLogout = async () => {
    try {
      const data = await logout(dispatchUser, dispatchEvents);
      if (data?.error) {
        console.log(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      py="2"
      px={{
        base: "4",
        md: "8",
        lg: "16",
      }}
      boxShadow="sm"
    >
      {/* Logo on the left */}
      <Link href="/">
        <Image
          src="https://i.postimg.cc/YSz4S1h5/PULZION-25-LOGO-HERO.png"
          alt="logo"
          height="80px"
       
          width="auto"
          objectFit="contain"
        />
      </Link>

      {/* Logout button on the extreme right */}
      {user?.id && (
        <Button
          onClick={handleLogout}
          fontSize="md"
          fontWeight="medium"
          px={6}
          py={3}
          mr={4}
        >
          Log Out
        </Button>
      )}
    </Flex>
  );
};

export default Header;
