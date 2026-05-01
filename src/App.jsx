import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./user/pages/Dashboard";
import AuthLayout from "./layout/AuthLayout";
import Login from "./auth/Login";
import Users from "./user/pages/admin/users/Users";
import UserForm from "./user/pages/admin/users/Userform";
import Styles from "./user/pages/rdteam/Styles";
import StyleForm from "./user/pages/rdteam/Styleform";
import { appMenu } from "./routes/routesConfig";
import Unauthorized from "./errorPage/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";
import useNetworkStatus from "./hooks/useNetworkStatus";
import NoInternet from "./errorPage/NoInternet";
import PageNotFound from "./errorPage/PageNotFound";

function App() {
  useNetworkStatus();
  return (
    <>
        <Routes>
          <Route path="/" element={<AuthLayout cmp={Login} />} />
          <Route path="/login" element={<AuthLayout cmp={Login} />} />

          {appMenu?.map((menu, menuIdx) =>
            menu?.children?.map((route, i) => (
              <Route
                key={`${menuIdx}-${i}`}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={menu.roles}>
                    <UserLayout cmp={route.element} />
                  </ProtectedRoute>
                }
              />
            )),
          )}
          <Route path="/unauthorized" element={<UserLayout cmp={Unauthorized} />} />
          <Route path="/no-internet" element={<UserLayout cmp={NoInternet} />} />
          <Route path="/*" element={<UserLayout cmp={PageNotFound} />} />
        </Routes>
    </>
  );
}

export default App;
