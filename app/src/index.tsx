import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Jarnac from "Jarnac";
import StartPage from "pages/StartPage";

const router = createBrowserRouter([
  { path: "/", element: <StartPage /> },
  { path: "/local", element: <Jarnac /> },
  { path: "/en-ligne/:id", element: <Jarnac /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
