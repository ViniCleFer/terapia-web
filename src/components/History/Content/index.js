/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Flex,
  Heading,
  Box,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "@chakra-ui/core";

import { getHistoryCalls } from "../../../store/modules/list/actions";
// import { Container } from './styles';

// import CardUserCall from "../../../components/CardUserCall";

function Content() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);

  const historyCalls = useSelector((state) => state.list.historyCalls);

  useEffect(() => {
    dispatch(getHistoryCalls(profile.userId));
  }, []);

  return (
    <Grid
      templateColumns="700px 1fr 1fr 1fr"
      gridAutoRows="40px"
      backgroundColor="#f1f0ef"
      p="10px 10px 10px 10px"
    >
      <Heading
        pt="10px"
        fontSize="18px"
        fontWeight="500"
        color="black"
        mb="2px"
        bg="white"
        pl="10px"
      >
        Nome
      </Heading>
      <Heading
        pt="10px"
        pl="10px"
        fontSize="18px"
        fontWeight="500"
        color="black"
        mb="2px"
        bg="white"
      >
        Tipo
      </Heading>
      <Heading
        pt="10px"
        pl="10px"
        fontSize="18px"
        fontWeight="500"
        color="black"
        mb="2px"
        bg="white"
      >
        Duracao
      </Heading>
      <Heading
        pt="10px"
        pl="10px"
        fontSize="18px"
        fontWeight="500"
        color="black"
        mb="2px"
        bg="white"
      >
        Data
      </Heading>

      {historyCalls?.map((item) => {
        const dateParts = item.dateTime.split("-");
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        return (
          <>
            <Heading
              pt="10px"
              pl="10px"
              fontSize="16px"
              fontWeight="400"
              color="black"
              bg="white"
              mb="1px"
            >
              {item.name}
            </Heading>
            <Heading
              pt="10px"
              pl="10px"
              fontSize="16px"
              fontWeight="400"
              color="black"
              bg="white"
              mb="1px"
            >
              {item.video ? "Video" : "Audio"}
            </Heading>
            <Heading
              pt="10px"
              pl="10px"
              fontSize="16px"
              fontWeight="400"
              color="black"
              bg="white"
              mb="1px"
            >
              {item.duration}
            </Heading>
            <Heading
              pt="10px"
              pl="10px"
              fontSize="16px"
              fontWeight="400"
              color="black"
              bg="white"
              mb="1px"
            >
              {date}
            </Heading>
          </>
        );
      })}
    </Grid>
  );
}

export default Content;
