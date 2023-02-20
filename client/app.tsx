import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Routes } from "./routes";
import { Auth } from "./routes/auth";
import "./app.scss";
import { Nav } from "./components/nav";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
    {
      path: Routes.AUTH(),
      element: <Auth />,
    },
  ]);

  return (
    <>
      <Nav anonymous={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
