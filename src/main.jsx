import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.jsx";
import { ContextProvider } from "./context/ContextProvider";

createRoot(document.getElementById("root")).render(

    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>

);
