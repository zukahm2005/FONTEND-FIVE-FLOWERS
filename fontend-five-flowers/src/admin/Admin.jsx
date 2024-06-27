import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import HeaderAdmin from "./headerAdmin/HeaderAdmin";
import AddressAdmin from "./mainAdmin/contentAdmin/addressAdmin/AddressAdmin";
import BlogAdmin from "./mainAdmin/contentAdmin/blogAdmin/BlogAdmin";
import BrandAdmin from "./mainAdmin/contentAdmin/brandAdmin/BrandAdmin";
import CategoryAdmin from "./mainAdmin/contentAdmin/categoryAdmin/CategoryAdmin";
import ProductAdmin from "./mainAdmin/contentAdmin/productAdmin/ProductAdmin";
import SideBarAdmin from "./mainAdmin/sideBarAdmin/SideBarAdmin";
import "./admin.scss"
const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <HeaderAdmin />
      <div className="bottom-container-admin">
        <div className="side-bar-container-admin">
          <SideBarAdmin />
        </div>
        <div className="content-container-admin">
          <Routes>
            <Route path="address/*" element={<AddressAdmin />} />
            <Route path="blog/*" element={<BlogAdmin />} />
            <Route path="product/*" element={<ProductAdmin />} />
            <Route path="brand/*" element={<BrandAdmin />} />
            <Route path="category/*" element={<CategoryAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
