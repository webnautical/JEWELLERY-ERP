import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div
        className="table-card"
        style={{
          minHeight: "86vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
            padding: "30px",
            borderRadius: "12px",
            background: "#161616",
            border: "1px solid #1f1f1f",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* ICON */}
          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px",
            }}
          >
            🚫
          </div>

          {/* TITLE */}
          <h2
            style={{
              color: "#d12026",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Access Denied
          </h2>

          {/* MESSAGE */}
          <p
            style={{
              color: "#bbb",
              fontSize: "14px",
              marginBottom: "25px",
              lineHeight: "1.6",
            }}
          >
            You don’t have permission to access this page.  
            Please contact your administrator if you believe this is a mistake.
          </p>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #333",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Go Back
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#d12026",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;