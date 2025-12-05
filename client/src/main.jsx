// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import UserProvider from "./app/providers/UserProvider.jsx";
import CustomThemeProvider from "./app/providers/CustomThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
