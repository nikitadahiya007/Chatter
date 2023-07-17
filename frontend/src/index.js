import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./context/ChatProvider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);
