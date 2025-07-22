import React from "react";
import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "../src/config";
import { useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';
function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (formData.username.length === 0) {
      newErrors.username = "Username is Mandatory";
      isValid = false;
    }
    if (formData.password.length === 0) {
      newErrors.password = "Password is Mandatory";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // We use event.preventDefault() to stop the default form behavior (page reload) and handle submission in our own way using JavaScript.
    if (validate()) {
      const configuration = {
        withCredentials: true, // it is used to send cookies with the request
      };

      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/login`,
          formData,
          configuration
        );
        dispatch({
          type: "SET_USER",
          payload: response.data.userDetails,
        });
        toast.success("Login successful");
      } catch (err) {
        if (err?.response?.status === 401) {
          setErrors({ message: "Invalid credentials" });
        } else {
          setErrors({ message: "something went wrong , please try again" });
        }
      }
    }
  };

  const handelGoogleSigin = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        {
          idToken: authResponse.credential,
        },
        { withCredentials: true }
      );
      
      console.log("Google Signin Response:", response.data);
      dispatch({
        type: "SET_USER",
        payload: response.data.userDetails,
      });
      toast.success("Login successful");
    } catch (error) {
      console.log(error);
      setErrors({ message: "something went wrong , please try again" });
    }
  };

  const handleGoogleSigninFailure = async (error) => {
    console.log(error);
    setErrors({ message: "Something went wrong while google signin" });
  };
  return (
    <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
  
        
        <div className="border border-dark rounded shadow p-4"  style={{ backgroundColor: '#1f203d'}}>
          <h1 className="text-center mb-4">Login Page</h1>
  
          {/* Error Alert */}
          {errors.message && (
            <div className="alert alert-danger" role="alert">
              {errors.message}
            </div>
          )}
  
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""} text-white border border-secondary `}
                style={{ backgroundColor: '#2a2b53'}}
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
                className={`form-control ${errors.password ? "is-invalid" : ""}  text-white border border-secondary`}
                style={{ backgroundColor: '#2a2b53'}}
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
              <button type="submit" className="btn btn-danger ">
                Login
              </button>
            </div>
  
            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <a href="/register" className="text-secondary text-decoration-underline">
                Register here
              </a>
            </div>
  
            <div className="text-center mt-2">
              <a href="/forgot-password" className="text-secondary text-decoration-underline">
                Forgot Password?
              </a>
            </div>
          </form>
  
          <div className="text-center">
            <div className="my-4 d-flex align-items-center text-muted">
              <hr className="flex-grow-1 border-white" />
              <span className="px-2 text-white">OR</span>
              <hr className="flex-grow-1 border-white" />
            </div>
  
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handelGoogleSigin}
                onError={handleGoogleSigninFailure}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default Login;
