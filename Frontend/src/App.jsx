import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import Home from "./Home";
import Login from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
function App() {
  const [UserDetails, setUserDetails] = useState(null);
  const updateUserDetails = (updatedData) => {
    setUserDetails(updatedData);
  };

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6001/auth/isUserLoggedIn",
        {
          withCredentials: true,
        }
      );

      updateUserDetails(response.data.userDetails);
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
                <Login updateUserDetails={updateUserDetails} />
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
          element={UserDetails ? <Logout  updateUserDetails={updateUserDetails}/> : <Navigate to="/login" />}
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
      </Routes>
    </>
  );
}

export default App;
