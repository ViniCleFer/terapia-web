import React from "react";
import PropType from "prop-types";
import Header from "../../../components/Header";
// import Sidebar from "../../../components/Professionals/Sidebar";
import Menu from "../../../components/Menu";

// import { Grid, Flex, Heading } from "@chakra-ui/core";

import { Wrapper, Content } from "./styles";

export default function DefaultLayout({ children }) {
  return (
    // <Grid
    //   as="main"
    //   height="100vh"
    //   templateColumns="68px 360px 1fr"
    //   templateRows="47px 60px 1fr"
    //   templateAreas="
    //   header header header
    //   menu topsidebar bodybar
    //   menu sidebar  content
    //   "
    // >
    // <Flex gridArea="header" bg="red" backgroundColor="gray.700">
    //   <Heading>teeeeeeste</Heading>
    // </Flex>
    // </Grid>
    <Wrapper>
      <Header />
      <Content>
        <Menu />
        {children}
      </Content>
    </Wrapper>
  );
}

DefaultLayout.propType = {
  children: PropType.element.isRequired,
};

// <Wrapper>
//       <Header />
//       <Content>
//         <Sidebar />
//         {children}
//       </Content>
//     </Wrapper>
