// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import UserProvider from "./app/providers/UserProvider.jsx";
import CustomThemeProvider from "./app/providers/CustomThemeProvider.jsx";
import { SnackbarProvider } from "../src/app/providers/SnackBarProvider.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider>
    <BrowserRouter>
      <CustomThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CustomThemeProvider>
    </BrowserRouter>
    </SnackbarProvider>
  </React.StrictMode>
);
