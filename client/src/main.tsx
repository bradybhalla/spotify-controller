import React from "react";
import ReactDOM from "react-dom/client";

import "../scss/custom.scss";

import App from "./App";


const params = new URLSearchParams(location.search);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App name={params.get("name")} id={params.get("id")} />
  </React.StrictMode>,
);

