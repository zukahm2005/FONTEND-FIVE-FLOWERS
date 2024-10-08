import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import Error from "../error/Error";
import "./admin.scss";
import HeaderAdmin from "./headerAdmin/HeaderAdmin";
import AddressAdmin from "./mainAdmin/contentAdmin/addressAdmin/AddressAdmin";
import UpdateAddressAdmin from "./mainAdmin/contentAdmin/addressAdmin/updateAddressAdmin/UpdateAddressAdmin";
import BlogAdmin from "./mainAdmin/contentAdmin/blogAdmin/BlogAdmin";
import BrandAdmin from "./mainAdmin/contentAdmin/brandAdmin/BrandAdmin";
import CategoryAdmin from "./mainAdmin/contentAdmin/categoryAdmin/CategoryAdmin";
import CommentReviewAdmin from "./mainAdmin/contentAdmin/commentReview/CommentReviewAdmin";
import HomeAdmin from "./mainAdmin/contentAdmin/homeAdmin/HomeAdmin";
import ManagementAdmin from "./mainAdmin/contentAdmin/managementAdmin/ManagementAdmin";
import OrderAdmin from "./mainAdmin/contentAdmin/orderAdmin/OrderAdmin";
import PaymentAdmin from "./mainAdmin/contentAdmin/paymentAdmin/PaymentAdmin";
import ProductAdmin from "./mainAdmin/contentAdmin/productAdmin/ProductAdmin";
import SideBarAdmin from "./mainAdmin/sideBarAdmin/SideBarAdmin";
import ContactAdmin from "./mainAdmin/contentAdmin/contactAdmin/ContactAdmin";
const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderAdmin className="header-admin" />
      <Layout className="bottom-container-admin">
        <SideBarAdmin className="side-bar-container-admin" />
        <Layout.Content className="content-container-admin">
          <Routes>
            <Route index element={<HomeAdmin />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="address/*" element={<AddressAdmin />} />
            <Route path="address/update/:id" element={<UpdateAddressAdmin />} />
            <Route path="blog/*" element={<BlogAdmin />} />
            <Route path="product/*" element={<ProductAdmin />} />
            <Route path="brand/*" element={<BrandAdmin />} />
            <Route path="category/*" element={<CategoryAdmin />} />
            <Route path="orders/*" element={<OrderAdmin />} />
            <Route path="payment/*" element={<PaymentAdmin />} />
            <Route path="comment/*" element={<CommentReviewAdmin />} />
            <Route path="customer/*" element={<AddressAdmin />} />
            <Route path="manage-admin/*" element={<ManagementAdmin />} />
            <Route path="contact/*" element={<ContactAdmin />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
