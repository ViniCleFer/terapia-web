/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {} from "./styles";

import "./styles.css";

// import Modal from "react-modal";
import {
  Grid,
  Flex,
  Heading,
  TabPanels,
  TabPanel,
  Divider,
  AspectRatioBox,
  Button,
  Icon,
} from "@chakra-ui/core";

import Header from "../../components/Header";
import Menu from "../../components/Menu";
import TopSidebar from "../../components/Calls/TopSideBar";
import Content from "../../components/Calls/Content";
import BodyBar from "../../components/Calls/BodyBar";
import SidebarCalls from "../../components/Calls/Sidebar";

import {
  MdCall,
  MdCheck,
  MdVideocam,
  MdVideocamOff,
  MdAccessTime,
  MdVideoCall,
  MdMic,
  MdCallEnd,
  MdMicOff,
} from "react-icons/md";

import VComm from "../../../src/services/vcoom";

export default function Call() {
  const [callStatus, setCallStatus] = useState("");
  const [statusMic, setStatusMic] = useState(true);
  const [statusVideo, setStatusVideo] = useState(true);

  const vcomm = VComm.getInstance();

  useEffect(() => {
    vcomm.on(VComm.Events.CallStatus, async (status) => {
      setCallStatus(status);

      //   if (
      //     status === VComm.CallStatus.Cancelled ||
      //     status === VComm.CallStatus.Declined ||
      //     status === VComm.CallStatus.Finished ||
      //     status === VComm.CallStatus.Failed
      //   ) {
      //     setTimeout(() => {
      //       setTitle(VComm.getInstance().userName);
      //     }, 3000);
      //   }
    });
  }, []);

  useEffect(() => {
    console.log(callStatus, "useEffect");
  }, [callStatus]);

  const handleMic = () => {
    vcomm.enableAudio(!statusMic);
    setStatusMic(!statusMic);
  };

  function handleCam() {
    vcomm.enableVideo(false);
    setStatusVideo(!statusVideo);
  }

  const onFinishedCall = () => {
    vcomm.hangupCall(VComm.CallStatus.Finished);
  };

  return (
    <Flex
      backgroundColor="white"
      flex="1"
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      mb="  100px"
      flexDirection="column"
    >
      {/* {callStatus === "IN_CALL" && ( */}
      {/* <Flex className="videos" flex="1" backgroundColor="black">
        <div
          style={{ height: 900, width: 800 }}
          className="videoLocal"
          id="localVideoContainer"
        ></div>
        <div className="videoRemote" id="remoteVideoContainer"></div>
      </Flex> */}

      <div className="videos">
        <div className="videoLocal" id="localVideoContainer"></div>
        <div className="videoParticipant" id="remoteVideoContainer"></div>
        {callStatus === "IN_CALL" && (
          <Flex
            shadow="0px 8px 6px 1px rgba(0,0,0,0.2)"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top="780px"
            left="890px"
          >
            <Flex justifyContent="center" alignItems="center" flex="1">
              <Heading size="sm" fontWeight="normal" alignSelf="center">
                12:00
              </Heading>
            </Flex>
            <Divider orientation="vertical" />
            <Button rounded="0" _hover={{ bg: "none" }} onClick={handleCam}>
              <Icon
                as={statusVideo ? MdVideocam : MdVideocamOff}
                size="20px"
                color="black"
              />
            </Button>
            <Button rounded="0" _hover={{ bg: "none" }} onClick={handleMic}>
              <Icon
                as={statusMic ? MdMic : MdMicOff}
                size="20px"
                color="black"
              />
            </Button>
            <Button
              rounded="0"
              backgroundColor="#97243a"
              _hover={{ bg: "#a92765" }}
              onClick={onFinishedCall}
            >
              <Icon as={MdCallEnd} size="20px" color="white" />
            </Button>
          </Flex>
        )}
      </div>

      {/* <Flex
        backgroundColor="#ccc"
        height="900px"
        width="100vw"
        position="absolute"
        left="100"
      ></Flex>
      <Flex backgroundColor="#e21" height="200px" width="200px"></Flex> */}

      {/* )} */}

      {callStatus !== "IN_CALL" &&
        callStatus !== "FINISHED" &&
        callStatus !== "DECLINED" && (
          <>
            <Flex className="blob" mt="-200px">
              <Heading color="white">RC</Heading>
            </Flex>

            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mt="24px"
            >
              <Heading color="black">Chamando</Heading>
              <Heading color="black">Romulo Costa</Heading>
            </Flex>
          </>
        )}
    </Flex>
  );
}
