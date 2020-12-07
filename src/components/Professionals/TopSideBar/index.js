import React from "react";
import { Grid, Flex, Heading, Div, Divider } from "@chakra-ui/core";

// import { Container } from './styles';

function TopSideBar() {
  return (
    <Flex gridArea="topsidebar" flex="1" alignItems="center" ml="24px">
      <Heading
        fontWeight="500"
        fontSize="20px"
        lineHeight="1.33"
        fontWeight="700"
        mt="6px"
        color="#252423s"
      >
        Profissionais
      </Heading>
    </Flex>
  );
}

export default TopSideBar;
