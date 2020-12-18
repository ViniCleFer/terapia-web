/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from "react";
import { useDispatch } from "react-redux";

import {} from "./styles";

// import Modal from "react-modal";
import {
  Grid,
  // Flex,
  // Heading,
  // TabPanels,
  // TabPanel,
  // Divider,
} from "@chakra-ui/core";

// import Header from "../../components/Header";
// import Menu from "../../components/Menu";
import TopSidebar from "../../components/Contacts/TopSideBar";
import Content from "../../components/Contacts/Content";
import BodyBar from "../../components/Contacts/BodyBar";
import SideBar from "../../components/Contacts/Sidebar";

import {
  getAllProfessionalsRequest,
} from "../../../store/modules/professionals/actions";

export default function ProfContacts() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProfessionalsRequest());
  }, []);

  return (
    // <Flex backgroundColor="white" flex="1">
    //   <Heading color="black">teste</Heading>
    // </Flex>
    <Grid
      height="100vh"
      width="100vw"
      templateColumns="260px 1fr"
      templateRows="60px 1fr"
      templateAreas="
      ' topsidebar bodybar'
      ' sidebar  content'
      "
    >
      <TopSidebar />

      <SideBar />
      <Content />

      <BodyBar />
    </Grid>
  );
}
