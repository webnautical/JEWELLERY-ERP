import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./user/pages/Dashboard";
import AuthLayout from "./layout/AuthLayout";
import Login from "./auth/Login";
import Products from "./user/pages/product/Products";
import AddEditProduct from "./user/pages/product/AddEditProduct";
import ProductDetails from "./user/pages/product/ProductDetails";
import Users from "./user/pages/admin/users/Users";
import UserForm from "./user/pages/admin/users/Userform";
import Styles from "./user/pages/admin/rdteam/Styles";
import StyleForm from "./user/pages/admin/rdteam/Styleform";
import { appMenu } from "./routes/routesConfig";
import Unauthorized from "./errorPage/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout cmp={Login} />} />
          <Route path="/login" element={<AuthLayout cmp={Login} />} />

          {appMenu.map((menu) =>
            menu.children.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={menu.roles}>
                    <UserLayout cmp={route.element} />
                  </ProtectedRoute>
                }
              />
            ))
          )}
          <Route path="/unauthorized" element={<UserLayout cmp={Unauthorized} />} />

          {/* <Route path="/dashboard" element={<UserLayout cmp={Dashboard} />} />

          <Route path="/users" element={<UserLayout cmp={Users} />} />
          <Route path="/users/add" element={<UserLayout cmp={UserForm} />} />
          <Route path="/users/edit/:id" element={<UserLayout cmp={UserForm} />}/> */}



        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
