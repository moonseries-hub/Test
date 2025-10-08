import React from "react";
import ReactDOM from "react-dom/client"; // React 18+
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { CategoriesProvider } from "./context/CategoriesContext"; // new

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <CategoriesProvider>
        <App />
      </CategoriesProvider>
    </UserProvider>
  </React.StrictMode>
);
