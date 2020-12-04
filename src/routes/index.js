/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import Route from "./route";

import SignIn from "../pages/SignIn";

import Dashboard from "../pages/Dashboard";
import LastCalls from "../pages/LastCalls";
import CallContacts from "../pages/CallContacts";
import Call from "../pages/Call";
import CallHistory from "../pages/CallHistory";

import { useToasts } from "react-toast-notifications";
import VComm from "../../src/services/vcoom";
import NotificationCard from "../components/NotificationCallCard";
import { toast } from "react-toastify";

import { setActiveCallData } from "../store/modules/auth/actions.js";

// import Profile from '~/pages/Profile';

export default function Routes() {
  const dispatch = useDispatch();
  const vcomm = VComm.getInstance();
  const { addToast } = useToasts();

  function onDataReceived(data) {
    dispatch(setActiveCallData(data));
  }

  useEffect(() => {
    vcomm.on(VComm.Events.CallStatus, async (status) => {
      console.log(status, "teste");
      if (status === "RINGING") {
        setTimeout(() => {
          toast(<NotificationCard />, {
            autoClose: false,
          });
        }, 1000);
      }
    });
    vcomm.on(VComm.Events.DataReceived, onDataReceived);
  }, []);

  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      {/* <Route path="/calls" exact component={Calls} isPrivate /> */}
      <Route path="/calls/lastcalls" exact component={LastCalls} isPrivate />
      <Route path="/calls/contacts" exact component={CallContacts} isPrivate />
      <Route path="/calls/incall" exact component={Call} isPrivate />
      <Route path="/calls/history" exact component={CallHistory} isPrivate />

      {/* <Route path="/register" component={Signup} /> */}
      {/* Todo Falta colocar private nas rotas */}
      <Route path="/dashboard" component={Dashboard} isPrivate />
    </Switch>
  );
}
