import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { SimpleModeProvider } from "./context/SimpleModeContext";
import { LeaderBoardProvider } from "./context/LeaderBoardContext";
import { EpiphanyProvider } from "./context/EpiphanyContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SimpleModeProvider>
      <EpiphanyProvider>
        <LeaderBoardProvider>
          <RouterProvider router={router}></RouterProvider>
        </LeaderBoardProvider>
      </EpiphanyProvider>
    </SimpleModeProvider>
  </React.StrictMode>,
);
