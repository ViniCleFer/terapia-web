import React from "react";
import {
  // Grid,
  Flex,
  // ButtonGroup,
  // Button,
  Icon,
  Heading,
  Tabs,
  TabList,
  Tab,
  // TabPanel,
  // TabPanels,
} from "@chakra-ui/core";
import { MdNotifications, MdCall, MdEventNote } from "react-icons/md";
import history from "../../services/history";
// import ButtonLeftMenu from "../../components/ButtonLeftMenu";

function Menu({ children }) {
  return (
    <Flex
      bg="red"
      backgroundColor="purple.500"
      flexDirection="column"
      height="100vh"
      width="65px"
    >
      <Tabs orientation="vertical">
        <TabList>
          <Tab
            as="button"
            height="64px"
            width="65px"
            flexDirection="column"
            _selected={{
              borderColor: "white",
              boxShadow: "none",
              border: "none",
              borderBottom: "0px",
              bg: "purple.600",
              shadow: "none",
            }}
            onClick={() => history.push("/professionals")}
          >
            <Icon as={MdCall} size="24px" color="white" />
            <Heading fontWeight="500" fontSize="10px" mt="6px" color="white">
              Chamadas
            </Heading>
          </Tab>
          <Tab
            height="64px"
            width="65px"
            flexDirection="column"
            _selected={{
              borderColor: "white",
              boxShadow: "none",
              border: "none",
              borderBottom: "0px",
              bg: "purple.600",
              shadow: "none",
            }}
            // onClick={() => history.push("/chat")}
          >
            <Icon as={MdNotifications} size="24px" color="white" />
            <Heading fontWeight="500" fontSize="10px" mt="6px" color="white">
              Notificações
            </Heading>
          </Tab>
          <Tab
            height="64px"
            width="65px"
            flexDirection="column"
            _selected={{
              borderColor: "white",
              boxShadow: "none",
              border: "none",
              borderBottom: "0px",
              bg: "purple.600",
              shadow: "none",
            }}
          >
            <Icon as={MdEventNote} size="24px" color="white" />
            <Heading fontWeight="500" fontSize="10px" mt="6px" color="white">
              Calendario
            </Heading>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
}

export default Menu;
