import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  // Flex,
  // Heading,
  // Box,
  Accordion,
  // AccordionIcon,
  AccordionItem,
  // AccordionHeader,
  AccordionPanel,
} from "@chakra-ui/core";

import {
  getAllProfessionalsRequest,
} from "../../../store/modules/professionals/actions";

import CardUserCall from "../../../components/CardUserCall";

// import { Container } from './styles';

function Content() {
  const dispatch = useDispatch();

  const professionals = useSelector((state) => state.professionals.professionals);
  // const changed = useSelector((state) => state.professionals.changed);

  useEffect(() => {
    dispatch(getAllProfessionalsRequest());
  }, [dispatch, professionals]);

  return (
    <Accordion defaultIndex={[0]} allowMultiple={true}>
      <AccordionItem>
        {/* <AccordionHeader>
          <Box flex="1" textAlign="left">
            Usuários Alto Risco
          </Box>
          <AccordionIcon />
        </AccordionHeader> */}
        <AccordionPanel pb={4} pt="20px" backgroundColor="#f1f0ef">
          <Grid
            templateColumns="1fr 1fr 1fr 1fr 1fr"
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            {professionals.map((item, index) => {
              return <CardUserCall data={item} key={index} />;
            })}
          </Grid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default Content;
