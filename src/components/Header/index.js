import React from "react";
import { useDispatch } from "react-redux";

import logo from "../../assets/logoBella.png";
import {
  Grid,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Image,
  Box,
  Icon,
} from "@chakra-ui/core";

import { MdSettings, MdExitToApp } from "react-icons/md";
import { signOut } from "../../store/modules/auth/actions";

export default function Header() {
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Flex
      gridArea="header"
      backgroundColor="purple.600"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Menu>
        <MenuButton
          as={Button}
          variantColor="purple.600"
          border="0px"
          _hover={{ bg: "purple.500" }}
          height="47px"
          rounded="0px"
        >
          <Image
            src="https://bit.ly/sage-adebayo"
            alt="Segun Adebayo"
            rounded="full"
            size="40px"
          />
        </MenuButton>
        <MenuList backgroundColor="white">
          <MenuItem>
            <Icon as={MdSettings} size="20px" color="gray.700" mr="10px" />
            <Heading fontSize="16px" color="black" fontWeight="normal">
              Configurações
            </Heading>
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => handleSignOut()}>
            <Icon as={MdExitToApp} size="20px" color="gray.700" mr="10px" />
            <Heading fontSize="16px" color="black" fontWeight="normal">
              Sair
            </Heading>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
