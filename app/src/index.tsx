import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import StartPage from "pages/StartPage"
import LocalGamePage from "pages/LocalGamePage"
import OnlineGamePage from "pages/OnlineGamePage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const router = createBrowserRouter([
  { path: "/", element: <StartPage /> },
  { path: "/local", element: <LocalGamePage /> },
  { path: "/en-ligne/:gameId", element: <OnlineGamePage /> },
  { path: "*", element: <Navigate to="/" /> },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
