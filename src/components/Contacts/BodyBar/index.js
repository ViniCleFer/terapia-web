import React from "react";
import { Grid, Flex, Heading } from "@chakra-ui/core";

// import { Container } from './styles';

function BodyBar() {
  return (
    <Flex
      gridArea="bodybar"
      bg="red"
      flex="1"
      backgroundColor="#f1f0ef"
      borderBottomWidth="1px"
      justifyContent="flex-start"
      alignItems="center"
      paddingLeft="20px"
    >
      <Heading
        fontWeight="500"
        fontSize="24px"
        fontWeight="400"
        mt="6px"
        color="black"
      >
        Contatos
      </Heading>
    </Flex>
  );
}

export default BodyBar;
