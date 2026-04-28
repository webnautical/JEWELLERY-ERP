import React from "react";
import { authUser } from "../../helper/Utility";
import AdminDashboard from "./dashboard/AdminDashboard";
import RDDashboard from "./dashboard/Rddashboard";

const Dashboard = () => {
  const user = authUser();
  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "rd_team":
      return <RDDashboard />;
    case "user":
      return <AdminDashboard />;
    default:
      return <><AdminDashboard /></>;
  }
};

export default Dashboard;