import React from "react";
import { authUser } from "../../helper/Utility";
import AdminDashboard from "./dashboard/AdminDashboard";
import RDDashboard from "./dashboard/Rddashboard";
import CostingDashboard from "./dashboard/Costingdashboard";
import SourcingDashboard from "./dashboard/Ratesdashboard";
import SalesDashboard from "./dashboard/Salesdashboard";

const Dashboard = () => {
  const user = authUser();
  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "rd_team":
      return <RDDashboard />;
    case "costing_team":
      return <CostingDashboard />;
    case "sourcing_team":
      return <SourcingDashboard />;
    case "sales_executive":
      return <SalesDashboard />;

    case "user":
      return <AdminDashboard />;
    default:
      return (
        <>
          <AdminDashboard />
        </>
      );
  }
};

export default Dashboard;
