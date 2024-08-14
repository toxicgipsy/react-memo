import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { SimpleModeProvider } from "./context/SimpleModeContext";
import { LeaderBoardProvider } from "./context/LeaderBoardContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SimpleModeProvider>
      <LeaderBoardProvider>
        <RouterProvider router={router}></RouterProvider>
      </LeaderBoardProvider>
    </SimpleModeProvider>
  </React.StrictMode>,
);
