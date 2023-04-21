import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import StartPage from "pages/StartPage"
import LocalGamePage from "pages/LocalGamePage"
import OnlineGamePage from "pages/OnlineGamePage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const router = createBrowserRouter([
  { path: "/jarnac/", element: <StartPage /> },
  { path: "/jarnac/local", element: <LocalGamePage /> },
  { path: "/jarnac/en-ligne/:gameId", element: <OnlineGamePage /> },
  { path: "*", element: <Navigate to="jarnac/" /> },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
