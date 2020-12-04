/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import {} from "./styles";

// import Modal from "react-modal";
import {
  Grid,
  Flex,
  Heading,
  TabPanels,
  TabPanel,
  Divider,
} from "@chakra-ui/core";

import Header from "../../components/Header";
import Menu from "../../components/Menu";
// import TopSidebar from "../../components/Calls/TopSideBar";
// import Content from "../../components/Calls/Content";
// import BodyBar from "../../components/Calls/BodyBar";
// import SideBar from "../../components/Calls/Sidebar";

export default function Dashboard() {
  return (
    // <Flex backgroundColor="white" flex="1">
    //   <Heading color="black">teste</Heading>
    // </Flex>
    <Grid
      height="100vh"
      width="100vw"
      templateColumns="360px 1fr"
      templateRows="60px 1fr"
      templateAreas="
      ' topsidebar bodybar'
      ' sidebar  content'
      "
    >
      {/* <TopSidebar />

      <SideBar />

      <Content />

      <BodyBar /> */}
    </Grid>
  );
}
