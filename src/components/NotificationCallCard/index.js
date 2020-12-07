import React from "react";

// import { Container } from './styles';
import {
  Grid,
  Flex,
  ButtonGroup,
  Button,
  Icon,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  AvatarBadge,
  Avatar,
} from "@chakra-ui/core";
import { useSelector } from "react-redux";
import {
  MdNotifications,
  MdCall,
  MdEventNote,
  MdVideocam,
  MdCallEnd,
} from "react-icons/md";
import history from "../../services/history";
import Vcomm from "../../services/vcoom";

function NotificationCallCard() {
  const vcomm = Vcomm.getInstance();
  const callData = useSelector((state) => state.auth.activeCallData);

  function handleAcceptedCall() {
    vcomm.acceptCall();
    history.push("/calls/incall");
  }

  function handleDeclineCall() {
    vcomm.hangupCall();
  }

  return (
    <Flex
      height="200px"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flex="1"
    >
      <Heading fontWeight="500" fontSize="18px" color="black">
        {callData?.profile?.name}
      </Heading>
      <Heading
        fontWeight="500"
        fontSize="16px"
      
        color="black"
        mt="5px"
      >
        está ligando para você
      </Heading>
      <Avatar src={callData.profile.photoUrl} mt="15px" />
      <Flex mt="20px" mb="10px">
        <Button
          width="30px"
          height="40px"
          backgroundColor="purple.300"
          rounded="50%"
          onClick={handleAcceptedCall}
        >
          <Icon as={MdVideocam} size="22px" color="white" />
        </Button>

        <Button
          width="30px"
          height="40px"
          backgroundColor="purple.300"
          rounded="50%"
          onClick={() => {}}
          ml="24px"
        >
          <Icon as={MdCall} size="22px" color="white" />
        </Button>

        <Button
          width="30px"
          height="40px"
          backgroundColor="#ff5c8d"
          rounded="50%"
          ml="24px"
          onClick={handleDeclineCall}
        >
          <Icon as={MdCallEnd} size="22px" color="white" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default NotificationCallCard;
