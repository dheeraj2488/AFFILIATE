import React from "react";
import { FaRegSadTear } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NoSubscription = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card text-center shadow-lg p-4"
        style={{
          backgroundColor: "#1f203d",
          color: "#ffffff",
          maxWidth: "600px",
          border: "1px solid #34354a",
        }}
      >
        <div className="card-body">
          <FaRegSadTear size={60} className="mb-3 text-warning" />
          <h3 className="card-title mb-3 fw-bold">No Subscription Found</h3>
          <p className="card-text fs-5 mb-4">
            Your admin has not activated any subscription yet. <br />
            Once they do, details will appear here.
          </p>
          <hr className="my-4 border-light" />
          <p className="text-muted mb-4">
            Please check back later or contact your admin for more info.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline-light"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoSubscription;
