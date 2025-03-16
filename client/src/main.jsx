import { StrictMode } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import Home from "./components/common/Home.jsx";
import Signin from "./components/common/Signin.jsx";
import Signup from "./components/common/Signup.jsx";
import TodoList from "./components/common/TodoList.jsx";
import AuthorProfile from "./components/author/AuthorProfile.jsx";
import UserAuthorContext from "./contexts/UserAuthorContext.jsx";

const browserRouterObj = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "author-profile/:email",
          element: <AuthorProfile />,
          children: [
            {
              path: "todos",
              element: <TodoList />,
            },
            {
              path: "",
              element: <Navigate to="todos" />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <UserAuthorContext>
        <RouterProvider
          router={browserRouterObj}
          future={{
            v7_startTransition: true,
          }}
        />
      </UserAuthorContext>
  </StrictMode>
);
