import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";
import { toast } from "react-hot-toast";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        axios.post(`${serverEndpoint}/auth/send-reset-token`, { email }),
        {
          loading: "Sending reset code...",
          success: "Reset code sent successfully on your email!",
          error: (err) =>
            err?.response?.data?.message || "Failed to send reset code.",
        }
      );

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <p className="text-center text-white fs-5  px-3">
        Forgot your password? <span className="text-info">Don’t worry!</span>{" "}
        We’ll send you a code to reset it — quick and easy.
        <br />
        Enter your email to get a reset code.
      </p>

      <form
        onSubmit={handleSubmit}
        className="p-4 shadow rounded mt-4"
        style={{ minWidth: 350 }}
      >
        <div
          className="border border-dark rounded shadow p-4"
          style={{ backgroundColor: "#1f203d" }}
        >
          <h3 className="text-center mb-3 text-white">Forgot Password</h3>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">
              Email address
            </label>
            <input
              type="email"
              className="form-control text-white border border-white"
              style={{ backgroundColor: "#2a2b53" }}
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn  w-100" style={{backgroundColor: '#0dcaf0'}} >
            Send Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
