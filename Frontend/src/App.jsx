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
import Spinner from "./components/Spinner";
import ManageUsers from "./pages/users/ManageUsers";
import UserLayout from "./layout/UserLayout";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import ProtectedRoute from "./rbac/ProtectedRoute";
import ManagePayments from "./pages/payments/ManagePayments";
import AnalyticsDashboard from "./pages/links/AnalyticsDashboard";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  const UserDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const attemptToRefreshToken = async () => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/refresh-token`,
        {},
        {
          withCredentials: true, // send cookies (important for refresh token)
        }
      );

      // Update user state with the new token data
      dispatch({
        type: "SET_USER",
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.error(
        "Failed to refresh token:",
        error.response?.data || error.message
      );

      // Optionally: handle logout or redirect
      // dispatch({ type: LOGOUT });
    }
  };
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
      if (error.response?.status === 401) {
        console.log("Token expired, attempting to refresh");

        await attemptToRefreshToken();
      } else {
        console.log("User not loggedin", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            UserDetails ? (
              <UserLayout>
                <Navigate to="/dashboard" />
              </UserLayout>
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
                <Login />
              </AppLayout>
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            UserDetails ? (
              <UserLayout>
                <Dashboard />
              </UserLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/logout"
          element={UserDetails ? <Logout /> : <Navigate to="/login" />}
        ></Route>

        <Route
          path="/error"
          element={
            UserDetails ? (
              <UserLayout>
                <Error />
              </UserLayout>
            ) : (
              <AppLayout>
                <Error />
              </AppLayout>
            )
          }
        ></Route>

        <Route
          path="/register"
          element={
            UserDetails ? (
              <Navigate to="/dashboard" />
            ) : (
              <AppLayout>
                <Register />
              </AppLayout>
            )
          }
        />

        <Route
          path="/users"
          element={
            UserDetails ? (
              <ProtectedRoute roles={["admin"]}>
                <UserLayout>
                  <ManageUsers />
                </UserLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        ></Route>

        <Route
          path="/unauthorized-access"
          element={
            UserDetails ? (
              <UserLayout>
                <UnauthorizedAccess />
              </UserLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/manage-payment"
          element={
            UserDetails ? (
              <UserLayout>
                <ManagePayments />
              </UserLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/analytics/:linkId"
          element={
            UserDetails ? (
              <UserLayout>
                <AnalyticsDashboard />
              </UserLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
