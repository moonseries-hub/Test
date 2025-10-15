import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { CategoriesProvider } from "./context/CategoriesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <CategoriesProvider>
        <App /> {/* App contains the <Router>, do NOT wrap here */}
      </CategoriesProvider>
    </UserProvider>
  </React.StrictMode>
);
