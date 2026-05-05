import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authUser, timeAgo } from "../../helper/Utility";
import { appMenu } from "../../routes/routesConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../api/globalSlice";
import { useTranslation } from "../../helper/useTranslation";
import { useGetNotificationsQuery } from "../../api/CommonAPI";

export const Header = () => {
  const { data: notificationData, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
  });
  console.log("notificationData", notificationData)
  const notificationList = notificationData?.data

  const authUserInfo = authUser();
  const authRole = authUserInfo?.role;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.global.language);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [notifyOpen, setNotifyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const wrapperRef = useRef(null);
  const notifyRef = useRef(null);
  const userRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleLogout = () => {
    localStorage.clear();
  };

  const dashboardTitleMap = {
    admin: 'adminDashboard',
    rd_team: 'rdDashboard',
    sourcing_team: 'sourcingDashboard',
    sales_executive: 'salesDashboard',
    costing_team: 'costingDashboard',
  };

  // Build flat list of searchable items filtered by role
  const getFilteredSuggestions = (searchQuery) => {
    const results = [];
    for (const section of appMenu) {
      if (!section.roles?.includes(authRole)) continue;
      for (const child of section.children) {
        if (!child.label) continue;
        if (
          !searchQuery ||
          child.label.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ ...child, section: section.title || "" });
        }
      }
    }
    return results;
  };

  const suggestions = getFilteredSuggestions(query);

  const handleSuggestionClick = (item) => {
    navigate(item.navPath || item.path);
    setOpen(false);
    setQuery("");
  };

  const handleSearchToggle = () => {
    setOpen((prev) => !prev);
    if (open) setQuery("");
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: "#d12026", fontWeight: 600 }}>
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

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
        className="top_heading d-lg-block d-none text-capitalize"
        style={{ fontSize: "20px", margin: "0px", color: "white" }}
      >
        {t(dashboardTitleMap[authRole])} 11
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* SEARCH */}
        <div
          ref={wrapperRef}
          className={`search-wrapper ${open ? "open" : ""}`}
          style={{ position: "relative" }}
        >
          <div className="search-icon" onClick={handleSearchToggle}>
            <i className="bi bi-search"></i>
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages..."
            className="search-input"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleSearchToggle()}
          />

          {/* Suggestions Dropdown */}
          {open && query.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: "240px",
                background: "#1a1a1a",
                border: "1px solid #e8d9b0",
                borderRadius: "12px",
                zIndex: 1050,
                overflow: "hidden",
              }}
            >
              {suggestions.length === 0 ? (
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#888",
                  }}
                >
                  No pages found
                </div>
              ) : (
                suggestions.slice(0, 8).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#fff",
                      borderBottom:
                        i < suggestions.slice(0, 8).length - 1
                          ? "1px solid #2a2a2a"
                          : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2a2a2a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <i
                      className={`bi ${item.icon}`}
                      style={{ fontSize: "14px", color: "#e8d9b0", width: "18px", textAlign: "center" }}
                    ></i>
                    <span style={{ flex: 1 }}>
                      {highlightMatch(item.label, query)}
                    </span>
                    {item.section && (
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {item.section}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* LANGUAGE SWITCH */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1a1a1a",
            border: "1px solid #e8d9b0",
            borderRadius: "20px",
            padding: "3px",
            gap: "2px",
          }}
        >
          <div
            onClick={() => dispatch(setLanguage("en"))}
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              background: language === "en" ? "#e8d9b0" : "transparent",
              color: language === "en" ? "#000" : "#e8d9b0",
              userSelect: "none",
            }}
          >
            EN
          </div>
          <div
            onClick={() => dispatch(setLanguage("zh"))}
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              background: language === "zh" ? "#e8d9b0" : "transparent",
              color: language === "zh" ? "#000" : "#e8d9b0",
              userSelect: "none",
            }}
          >
            中文
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="notify-wrapper" ref={notifyRef}>
          <span className="notify-bell" onClick={() => { setNotifyOpen(!notifyOpen); setUserOpen(false); }}>
            <i className="bi bi-bell-fill notify-icon"></i>
            {notificationData?.unreadCount > 0 && (
              <span className="notify-badge">
                {notificationData.unreadCount > 99 ? "99+" : notificationData.unreadCount}
              </span>
            )}
          </span>

          <div className={`notify-dropdown ${notifyOpen ? "show" : ""}`}>
            <div className="notify-header">
              <h6>Notifications</h6>
              <span>{notificationData?.unreadCount} New</span>
            </div>
            <div className="notify-list">
              {notificationList?.map((item) => (
                <div key={item.id} className={`notify-item ${!item.is_read ? "unread" : ""}`}>
                  <div className="notify-content">
                    <p><strong>{item?.title}</strong></p>
                    <p>{item?.message}</p>
                    <small>{timeAgo(item?.created_at)}</small>
                  </div>
                </div>
              ))}
            </div>

            {notificationData?.totalRecords > 5 && (
              <div className="notify-footer text-center">
                <Link to={'/dataList/notifications'} className="btn btn-sm btn-primary">
                  View all {notificationData?.totalRecords} notifications
                </Link>
              </div>
            )}
          </div>

        </div>

        <div className="vr"
          style={{ height: "30px", width: "1px", background: "#e8d9b0" }}
        ></div>

        {/* USER */}
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
              <li>
                <Link to="/profile" className="text-white" style={{ textDecoration: "none" }}>
                  {t("Profile")}
                </Link>
              </li>
              <li>
                <Link to="/reset-password" className="text-white" style={{ textDecoration: "none" }}>
                  {t("Change Password")}
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="text-white"
                  style={{ textDecoration: "none" }}
                >
                  {t("Logout")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};