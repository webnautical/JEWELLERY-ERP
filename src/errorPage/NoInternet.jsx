import React from "react";
import { useNavigate } from "react-router-dom";

const NoInternet = () => {
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
                        📶
                    </div>

                    {/* TITLE */}
                    <h2
                        style={{
                            color: "#d12026",
                            marginBottom: "10px",
                            fontWeight: "600",
                        }}
                    >
                        No Internet
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
                        You are currently offline.
                        Please check your internet connection and try again.
                    </p>

                    {/* BUTTONS */}
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>

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

export default NoInternet;