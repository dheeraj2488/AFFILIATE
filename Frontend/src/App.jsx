import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import Home from "./Home";
import Login from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { serverEndpoint } from "./config";

function App() {


  const UserDetails = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

 

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/auth/isUserLoggedIn`,
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "SET_USER",
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.error("Error checking user login status:", error);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            UserDetails ? (
              <Navigate to="/dashboard" />
            ) : (
              <AppLayout>
                <Home />
              </AppLayout>
            )
          }
        />
        <Route
          path="/login"
          element={
            UserDetails ? (
              <Navigate to="/dashboard" />
            ) : (
              <AppLayout>
                <Login  />
              </AppLayout>
            )
          }
        />

        <Route
          path="/dashboard"
          element={UserDetails ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/logout"
          element={UserDetails ? <Logout/> : <Navigate to="/login" />}
        >
        </Route>

        <Route
          path="/error"
          element={
            UserDetails ? (
              <Error />
            ) : (
              <AppLayout>
                <Error />
              </AppLayout>
            )
          }
        ></Route>

        <Route path="/register" element={ <Register/> }></Route>
      </Routes>
    </>
  );
}

export default App;
