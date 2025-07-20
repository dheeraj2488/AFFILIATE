import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-token`, { email });
      setMessage("Reset code sent successfully.");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="p-4 shadow rounded bg-white"
        style={{ minWidth: 350 }}
      >
        <h3 className="text-center mb-3">Forgot Password</h3>

        {message && (
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Send Code
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
