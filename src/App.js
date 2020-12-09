/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { ToastContainer } from "react-toastify";
// import { PersistGate } from 'redux-persist/integration/react';
// import { Provider } from 'react-redux';
import { Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ThemeContainer from "../src/context/theme/ThemeContainer";
import { Global, css } from "@emotion/core";
import NotificationCard from "../src/components/NotificationCallCard";
import {
  ToastProvider,
  // useToasts,
  DefaultToast,
} from "react-toast-notifications";

import "./config/ReactotronConfig";

import Routes from "./routes/index";
import history from "./services/history";

import { store, persistor } from "./store";

import GlobalStyle from "./styles/global";

// import VComm, { API } from "../src/services/vcoom";

const StyleForChakra = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

export default function App() {
  const MyCustomToast = ({ children, ...props }) => (
    <DefaultToast {...props} autoDismiss appearance="success">
      <NotificationCard />
    </DefaultToast>
  );

  return (
    <ThemeContainer>
      <Provider store={store}>
        <ToastProvider components={{ Toast: MyCustomToast }}>
          <PersistGate persistor={persistor}>
            <Router history={history}>
              <Routes />
              <GlobalStyle />
              <Global styles={StyleForChakra} />
              <ToastContainer autoClose={3000} />
            </Router>
          </PersistGate>
        </ToastProvider>
      </Provider>
    </ThemeContainer>
  );
}
