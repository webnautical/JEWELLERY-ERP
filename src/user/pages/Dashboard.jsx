import React from "react";
import { authUser } from "../../helper/Utility";
import AdminDashboard from "./dashboard/AdminDashboard";

const Dashboard = () => {
  const user = authUser();
  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "rd_team":
      return <AdminDashboard />;
    case "user":
      return <AdminDashboard />;
    default:
      return <><AdminDashboard /></>;
  }
};

export default Dashboard;