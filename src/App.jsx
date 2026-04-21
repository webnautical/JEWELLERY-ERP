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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout cmp={Login} />} />
          <Route path="/login" element={<AuthLayout cmp={Login} />} />

          <Route path="/dashboard" element={<UserLayout cmp={Dashboard} />} />

          <Route path="/users" element={<UserLayout cmp={Users} />} />
          <Route path="/users/add" element={<UserLayout cmp={UserForm} />} />
          <Route
            path="/users/edit/:id"
            element={<UserLayout cmp={UserForm} />}
          />

          <Route path="/styles" element={<UserLayout cmp={Styles} />} />
          <Route path="/styles/add" element={<UserLayout cmp={StyleForm} />} />
          <Route
            path="/styles/edit/:id"
            element={<UserLayout cmp={StyleForm} />}
          />

          <Route
            path="/dashboard/products"
            element={<UserLayout cmp={Products} />}
          />
          <Route
            path="/dashboard/products/add"
            element={<UserLayout cmp={AddEditProduct} />}
          />
          <Route
            path="/dashboard/products/edit/:id"
            element={<UserLayout cmp={AddEditProduct} />}
          />
          <Route
            path="/dashboard/products/:id"
            element={<UserLayout cmp={ProductDetails} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
