import { Navigate } from "react-router-dom";
import { authUser } from "../helper/Utility";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authUser();
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;