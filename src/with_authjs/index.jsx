import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppWithRouterAccess from "./AppWithRouterAccess";


export const App = () => {
  console.log(process.env, 'process env');
  return (
    <Router>
        <AppWithRouterAccess/>
    </Router>
  );
};
