import React from "react";
import { Grid, Flex, Heading, Button } from "@chakra-ui/core";
import { useToasts } from "react-toast-notifications";
import { toast } from "react-toastify";
import NotificationCard from "../../NotificationCallCard";

// import { Container } from './styles';

export function modal() {
  return (
    <Flex>
      <Heading>teste</Heading>
    </Flex>
  );
}

function Content() {
  const { addToast } = useToasts();

  function handleModal() {
    // addToast("teste", { appearance: "error" });
    toast(<NotificationCard />, { autoClose: false, closeOnClick: false });
  }

  return (
    <Flex
      gridArea="content"
      bg="red"
      flex="1"
      backgroundColor="#f1f0ef"
      borderBottomWidth="2px"
      justifyContent="center"
      alignItems="center"
    >
      <Button onClick={handleModal} variantColor="green">
        Modal
      </Button>
    </Flex>
  );
}

export default Content;
