import React, { useEffect ,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverEndpoint } from "../config";
import { toast } from 'react-hot-toast';
const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false);
  const handleLogout = async () => {

    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/logout`,
        {},
        {
          withCredentials: true, // This ensures that cookies are sent with the request
        }
      );

      document.cookie = `jwtToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;


      if (response.data.success) {
        dispatch({type: "CLEAR_USER",}); // Clear user details on logout
        setTimeout(() => {
          navigate('/login');
          toast.success("Logged out successfully");
        },300);
      }
    } catch (error) {
      console.error("Error during logout:", error);

      navigate("/error");
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

   return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <span className="text-muted">Logging out...</span>
    </div>
  );
};

export default Logout;
