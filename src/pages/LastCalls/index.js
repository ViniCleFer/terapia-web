/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
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
import TopSidebar from "../../components/Calls/TopSideBar";
import Content from "../../components/Calls/Content";
import BodyBar from "../../components/Calls/BodyBar";
import SidebarCalls from "../../components/Calls/Sidebar";

import Vcomm, { API } from "../../services/vcoom";

export default function LastCalls() {
  const profile = useSelector((state) => state.auth.profile);

  const vcomm = Vcomm.getInstance();

  useEffect(() => {
    vcomm.on(Vcomm.Events.Connected, async (isConnected) => {
      if (isConnected) {
        console.log("CONNECTED");

        API.login(profile.userId, profile.name);
      }
    });

    vcomm.on(Vcomm.Events.Logged, async () => {
      console.log("logado");
    });
  }, []);

  return (
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
      <TopSidebar />

      <SidebarCalls />

      <Content />

      <BodyBar />
    </Grid>
  );
}