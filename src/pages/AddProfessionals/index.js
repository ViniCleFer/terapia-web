/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Grid } from "@chakra-ui/core";

import TopSidebar from "../../components/ProfessionalsForm/TopSideBar";
import Content from "../../components/ProfessionalsForm/Content";
import BodyBar from "../../components/ProfessionalsForm/BodyBar";
import SidebarProfessionals from "../../components/ProfessionalsForm/Sidebar";

export default function AddProfessionals() {
  return (
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
      <SidebarProfessionals />
      <Content />
      <BodyBar />
    </Grid>
  );
}
