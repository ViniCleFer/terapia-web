import React from "react";
import { Flex, Heading, Button } from "@chakra-ui/core";

import history from "../../../services/history";

function BodyBar() {
  return (
    <Flex
      gridArea="bodybar"
      bg="red"
      flex="1"
      backgroundColor="#f1f0ef"
      borderBottomWidth="1px"
      justifyContent="space-between"
      alignItems="center"
      paddingLeft="20px"
      paddingRight="20px"
    >
      <Heading
        fontWeight="500"
        fontSize="24px"
        mt="6px"
        color="black"
      >
        Adicionar Profissionais
      </Heading>


      <Button onClick={() => history.push("/professionals/contacts")} background="#6E8BC6" variant="solid" color="#fff">
        Voltar 
      </Button>

    </Flex>
  );
}

export default BodyBar;
