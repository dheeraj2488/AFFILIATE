import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const Register = () => {
  const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handelSubmit = async (event) => {
    event.preventDefault();

    const configuration = {
      withCredentials: true, // it is used to send cookies with the request
    };
    try {
      const res = await axios.post(
        `${serverEndpoint}/auth/register`,
        formData,
        configuration
      );
      dispatch({
        type: "SET_USER",
        payload: res.data.userDetails,
      });

      setFormData({
        username: "",
        password: "",
        name: "",
      });
      alert("user registered successfully");
    } catch (err) {
      console.log(err);
      setErrors({ message: "something went wrong , please try again" });
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        {
          idToken: authResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "SET_USER",
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.log(error);
      setErrors({ message: "Something went wrong while google signin" });
    }
  };

  const handleGoogleSigninFailure = async (error) => {
    console.log(error);
    setErrors({ message: "Something went wrong while google signin" });
  };
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
        <div className="border border-dark rounded shadow p-4"  style={{ backgroundColor: '#1f203d'}}>
          <h2 className="text-center mb-4">Sign up with a new account</h2>

          {/* Error Alert */}
          {errors.message && (
            <div className="alert alert-danger" role="alert">
              {errors.message}
            </div>
          )}

          <form onSubmit={handelSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""} text-white border border-secondary `}
                id="name"
                style={{ backgroundColor: "#2a2b53" }}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                } text-white border border-secondary `}
                style={{ backgroundColor: "#2a2b53" }}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                } text-white border border-secondary `}
                style={{ backgroundColor: "#2a2b53" }}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-danger">
                Submit
              </button>
            </div>
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <a href="/login" className="text-secondary text-decoration-underline">
                Login
              </a>
            </div>
          </form>

          <div className="text-center">
            <div className="my-4 d-flex align-items-center">
              <hr className="flex-grow-1 border-white" />
              <span className="px-2 text-white">OR</span>
              <hr className="flex-grow-1 border-white" />
            </div>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleSignin}
                onError={handleGoogleSigninFailure}
              />
            </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
