import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "focus-visible/dist/focus-visible";
import baseUrl from "../src/services/baseUrl";

import VComm from "../src/services/vcoom";

VComm.config({
  appName: "Bella Materna",
  account: "bellamaterna",
  tenant: "bellamaterna",
  api: `${baseUrl.COMM}`,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
