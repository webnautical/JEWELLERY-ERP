import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const wrapperRef = useRef(null);
  const notifyRef = useRef(null);
  const userRef = useRef(null);

  // 👉 Outside click detect
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }

      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear()
  }

  return (
    <div
      className="header_outer"
      style={{
        height: "62px",
        background: "#000",
        borderBottom: "1px solid #e8d9b0",
        position: "fixed",
        top: 10,
        right: 15,
        left: isMobile ? "0" : "275px",
        zIndex: 1030,
        transition: "left 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderRadius: "60px",
      }}
    >
      <h1
        className="top_heading d-lg-block d-none"
        style={{ fontSize: "20px", margin: "0px", color: "white" }}
      >
        Sales Dashboard
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* SEARCH */}
        <div
          ref={wrapperRef}
          className={`search-wrapper ${open ? "open" : ""}`}
        >
          <div
            className="search-icon"
            onClick={() => setOpen(!open)}
          >
            <i className="bi bi-search"></i>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>

        {/* 🔔 NOTIFICATION */}
        <div className="notify-wrapper" ref={notifyRef}>
          <i
            className="bi bi-bell-fill notify-icon"
            onClick={() => {
              setNotifyOpen(!notifyOpen);
              setUserOpen(false);
            }}
          ></i>

          <div className={`notify-dropdown ${notifyOpen ? "show" : ""}`}>
            <div className="notify-header">
              <h6>Notifications</h6>
              <span>3 New</span>
            </div>

            <div className="notify-list">

              <div className="notify-item unread">
                <div className="notify-icon-circle blue">
                  <i className="bi bi-gear"></i>
                </div>
                <div className="notify-content">
                  <p>
                    Your Elite author Graphic Optimization <span>reward</span> is ready!
                  </p>
                  <small>Just 30 sec ago</small>
                </div>

              </div>

              <div className="notify-item highlight">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt=""
                  className="notify-avatar"
                />
                <div className="notify-content">
                  <p>
                    <strong>Angela Bernier</strong> answered to your comment on the cash
                    flow forecast's graph 🔔
                  </p>
                  <small>48 min ago</small>
                </div>

              </div>

              <div className="notify-item">
                <div className="notify-icon-circle red">
                  <i className="bi bi-chat-dots"></i>
                </div>
                <div className="notify-content">
                  <p>
                    You have received <span>20</span> new messages in the conversation
                  </p>
                  <small>1 hour ago</small>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div
          className="vr"
          style={{ height: "30px", width: "1px", background: "#e8d9b0" }}
        ></div>

        {/* 👤 USER */}
        <div className="user-wrapper" ref={userRef}>
          <div
            className="user-icon"
            onClick={() => {
              setUserOpen(!userOpen);
              setNotifyOpen(false);
            }}
          >
            <i className="bi bi-person-fill"></i>
          </div>

          <div className={`user-dropdown ${userOpen ? "show" : ""}`}>
            <ul>
              <li><Link to={'/profile'} className="text-white" style={{textDecoration : 'none'}}>Profile</Link></li>
              <li><Link to={'/reset-password'} className="text-white" style={{textDecoration : 'none'}}>Change Password</Link></li>
              <li><Link to={'/login'} onClick={() => handleLogout()}  className="text-white" style={{textDecoration : 'none'}}>Logout</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};