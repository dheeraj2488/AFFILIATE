import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { serverEndpoint } from '../config';
import {toast} from 'react-hot-toast';
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = location.state?.isLoggedIn || false;

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await toast.promise( axios.post(`${serverEndpoint}/auth/reset-password`, formData) , {
        loading: 'Resetting password...',
        success: 'Password reset successfully!',
        error: (err) => err?.response?.data?.message || 'Failed to reset password.'
      });

      if (isLoggedIn) {
        // Redirect back to dashboard if logged in
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        // Otherwise redirect to login page
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit} className="p-4 shadow rounded " style={{ minWidth: 350 }}>
      <div
        className="border border-dark rounded shadow p-4"
        style={{ backgroundColor: "#1f203d" }}
      >
        <h3 className="text-center mb-3">Reset Password</h3>

        {message && (
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        )}

        {!isLoggedIn && (
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              style={{ backgroundColor: "#2a2b53" }}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Reset Code</label>
          <input
            name="code"
            type="text"
            className="form-control text-white border border-secondary"
            style={{ backgroundColor: "#2a2b53" }}
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            name="newPassword"
            type="password" 
            className="form-control text-white border border-secondary"
            style={{ backgroundColor: "#2a2b53" }}
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-danger w-100">
          Reset Password
        </button>
      </div>
      </form>
    </div>
  );
};

export default ResetPassword;
