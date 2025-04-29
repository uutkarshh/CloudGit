import React, { useEffect } from "react";
import "./App.css";

import { useNavigate, useRoutes } from "react-router-dom";

//pages list
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Repo from "./components/user/Repo";
import Create from "./components/user/Create";
import Fevorite from "./components/user/Fevorite";
//Auth Context
import { useAuth } from "./authContext";
const Routes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }
    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname == "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  return useRoutes([
    {
      path: "/",
      element: <Dashboard></Dashboard>,
    },
    {
      path: "/auth",
      element: <Login></Login>,
    },
    {
      path: "/signup",
      element: <Signup></Signup>,
    },
    {
      path: "/profile",
      element: <Profile></Profile>,
    },
    {
      path: "/favorite",
      element: <Fevorite></Fevorite>,
    },
    {
      path: "/create",
      element: <Create></Create>,
    },
    {
      path: "/repo",
      element: <Repo></Repo>,
    },
  ]);
};

export default Routes;
