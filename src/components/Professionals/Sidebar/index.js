import React from "react";
import {
  Flex,
  Heading,
  ButtonGroup,
  Button,
  Icon,
} from "@chakra-ui/core";
import history from "../../../services/history";

import { MdPerson } from "react-icons/md";
// import { Container } from './styles';

function SideBar({ props }) {
  return (
    <Flex gridArea="sidebar" bg="red" flex="1" backgroundColor="white">
      <ButtonGroup spacing={4} width="260px">
        {/* <Button
          as="button"
          width="260px"
          rounded="0"
          justifyContent="flex-start"
          backgroundColor="white"
          _hover={{
            bg: "#eae8e6",
          }}
          _focus={{
            bg: "#eae8e6",
          }}
          onClick={() => history.push("/professionals")}
        >
          <Icon as={MdCall} size="20px" color="black" mr="10px" ml="5px" />
          <Heading fontWeight="400" fontSize="16px" color="black">
            Discagem rápida
          </Heading>
        </Button> */}
        <Button
          as="button"
          width="260px"
          rounded="0"
          justifyContent="flex-start"
          backgroundColor="white"
          // _active={{
          //   bg: "purple.600",
          // }}
          _hover={{
            bg: "#eae8e6",
          }}
          _focus={{
            bg: "#eae8e6",
          }}
          onClick={() => history.push("/professionals/contacts")}
        >
          <Icon as={MdPerson} size="20px" color="black" mr="10px" ml="5px" />
          <Heading fontWeight="400" fontSize="16px" color="black">
            Contatos
          </Heading>
        </Button>
        {/* <Button
          as="button"
          width="260px"
          rounded="0"
          justifyContent="flex-start"
          backgroundColor="white"
          // _active={{
          //   bg: "purple.600",
          // }}
          _hover={{
            bg: "#eae8e6",
          }}
          _focus={{
            bg: "#eae8e6",
          }}
          onClick={() => history.push("/calls/history")}
        >
          <Icon
            as={MdAccessTime}
            size="20px"
            color="black"
            mr="10px"
            ml="5px"
          />
          <Heading fontWeight="400" fontSize="16px" color="black">
            Histórico
          </Heading>
        </Button> */}
      </ButtonGroup>
    </Flex>
  );
}

export default SideBar;
