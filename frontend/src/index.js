import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext"; // import context

ReactDOM.render(
  <UserProvider>       {/* Wrap App with UserProvider */}
    <App />
  </UserProvider>,
  document.getElementById("root")
);
