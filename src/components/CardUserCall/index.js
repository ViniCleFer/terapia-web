import React from "react";
import history from "../../services/history";
import { useDispatch } from "react-redux";
import {
  Grid,
  Flex,
  Heading,
  Box,
  Avatar,
  Icon,
  AvatarBadge,
  Button,
} from "@chakra-ui/core";
import {
  MdCall,
  MdCheck,
  MdVideocam,
  MdAccessTime,
  MdMoreHoriz,
} from "react-icons/md";

import VComm from "../../../src/services/vcoom";
import { getProfileById } from "../../store/modules/list/actions";

function CardUserCall({ data }) {
  const dispatch = useDispatch();

  // function handleVideoCall() {
  //   // VComm.getInstance().makeCall(data.userId, data.displayName, true);
  //   VComm.getInstance().makeCall(30, "Romulo Costa", true);

  //   history.push("/calls/incall");
  // }

  function handleShowProfile() {
    dispatch(getProfileById(data.userId));
  }

  return (
    <Flex
      flexDirection="column"
      backgroundColor="white"
      height="140px"
      width="276px"
      p="20px"
      flex="1"
    >
      <Flex flexDirection="rows">
        <Avatar src={data.photoUrl} width="64px" height="64px" rounded="32px">
          <AvatarBadge
            size="1em"
            mr="2px"
            mb="2px"
            bg="#84bd4a"
            borderWidth="1px"
          >
            <Icon as={MdCheck} size="13px" color="white" />
          </AvatarBadge>
        </Avatar>

        <Flex flexDirection="column" ml="20px">
          <Heading fontSize="14px" fontWeight="bold" mt="8px" color="black">
            {data.name}
          </Heading>
          <Heading fontSize="12px" fontWeight="400" mt="4px" color="black">
            {data.status}
          </Heading>
        </Flex>
      </Flex>
      <Flex mt="20px">
        {/* <Button
          backgroundColor="white"
          width="22px"
          height="22px"
          onClick={() => handleVideoCall()}
        >
          <Icon as={MdVideocam} size="22px" color="black" />
        </Button>

        <Button backgroundColor="white" width="22px" height="22px">
          <Icon as={MdCall} size="22px" color="black" />
        </Button> */}

        <Button
          backgroundColor="white"
          width="22px"
          height="22px"
          onClick={handleShowProfile}
        >
          <Icon as={MdMoreHoriz} size="22px" color="black" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default CardUserCall;
