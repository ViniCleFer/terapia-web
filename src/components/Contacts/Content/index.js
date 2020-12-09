import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  // Flex,
  // Heading,
  Box,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "@chakra-ui/core";

import {
  getUsersHighRisk,
  getUsersWithoutMonitoring,
} from "../../../store/modules/list/actions";
// import { Container } from './styles';

import CardUserCall from "../../../components/CardUserCall";

// const users = [
//   {
//     avatar: "https://api.adorable.io/avatars/285/ab1111ott@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//     userId: "30",
//     displayName: "Romulo Costa",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/ab312ott@adorable.png",
//     name: "Lucas Tumolo",
//     status: "Ausente",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/aboczctt@adorable.png",
//     name: "Marcel Pratte",
//     status: "Ao telefone",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abo867tt@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abovvtt@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abot12t@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abosdtt@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abot1t@adorable.png",
//     name: "Lucas Tumolo",
//     status: "Ausente",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/aabott@adorable.png",
//     name: "Marcel Pratte",
//     status: "Ao telefone",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abotht@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abotlt@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
//   {
//     avatar: "https://api.adorable.io/avatars/285/abo1tt@adorable.png",
//     name: "Romulo Costa",
//     status: "Disponivel",
//   },
// ];

function Content() {
  const dispatch = useDispatch();

  const usersHighRisk = useSelector((state) => state.list.usersHighRisk);
  const usersWithoutMonitoring = useSelector(
    (state) => state.list.usersWithoutMonitoring
  );

  useEffect(() => {
    dispatch(getUsersHighRisk());
    dispatch(getUsersWithoutMonitoring());
  }, [dispatch]);

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
            {usersHighRisk.map((item) => {
              return <CardUserCall data={item} />;
            })}
          </Grid>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>
          <Box flex="1" textAlign="left">
            Usuários com Monitoramento Pendente
          </Box>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel pb={4} pt="20px" backgroundColor="#f1f0ef">
          <Grid
            templateColumns="1fr 1fr 1fr 1fr 1fr"
            gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            {usersWithoutMonitoring.map((item) => {
              return <CardUserCall data={item} />;
            })}
          </Grid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default Content;
