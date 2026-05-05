import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLayout from "./layout/UserLayout";
import AuthLayout from "./layout/AuthLayout";
import Login from "./auth/Login";
import { appMenu } from "./routes/routesConfig";
import Unauthorized from "./errorPage/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";
import useNetworkStatus from "./hooks/useNetworkStatus";
import NoInternet from "./errorPage/NoInternet";
import PageNotFound from "./errorPage/PageNotFound";

function App() {
  useNetworkStatus();

  const mergedRoutes = [];
  const pathRolesMap = {};

  appMenu.forEach((menu) => {
    const menuRoles = menu?.roles ?? [];

    menu?.children?.forEach((route) => {
      const path = route.path;
      const routeRoles = route.roles ?? menuRoles;

      if (pathRolesMap[path] !== undefined) {
        const idx = pathRolesMap[path];
        mergedRoutes[idx].roles = [
          ...new Set([...mergedRoutes[idx].roles, ...routeRoles]),
        ];
      } else {
        pathRolesMap[path] = mergedRoutes.length;
        mergedRoutes.push({ ...route, roles: routeRoles });
      }
    });
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthLayout cmp={Login} />} />
        <Route path="/login" element={<AuthLayout cmp={Login} />} />

        {mergedRoutes.map((route, i) => (
          <Route
            key={i}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={route.roles}>
                <UserLayout cmp={route.element} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="/unauthorized" element={<UserLayout cmp={Unauthorized} />} />
        <Route path="/no-internet" element={<UserLayout cmp={NoInternet} />} />
        <Route path="/*" element={<UserLayout cmp={PageNotFound} />} />
      </Routes>
    </>
  );
}

export default App;