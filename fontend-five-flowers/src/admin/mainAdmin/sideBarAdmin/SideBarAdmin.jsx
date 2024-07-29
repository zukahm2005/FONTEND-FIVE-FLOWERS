import { Layout, Menu } from "antd";
import React from "react";
import { AiOutlineComment, AiOutlineProduct } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";
import { MdManageAccounts, MdOutlineHome, MdPayment } from "react-icons/md";
import { RiBloggerLine } from "react-icons/ri";
import { TbAddressBook, TbBrandAirbnb } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import "./sideBarAdmin.scss";

const { Sider } = Layout;

const SideBarAdmin = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="side-bar-admin-container">
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<MdOutlineHome />}>
            <Link to="/admin/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AiOutlineProduct />}>
            <Link to="/admin/product">Product</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TbAddressBook />}>
            <Link to="/admin/address">Customer</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<RiBloggerLine />}>
            <Link to="/admin/blog">Blog</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<TbBrandAirbnb />}>
            <Link to="/admin/brand">Brand</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<BiCategory />}>
            <Link to="/admin/category">Category</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<BsCart2 />}>
            <Link to="/admin/orders">Order</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<MdPayment />}>
            <Link to="/admin/payment">Payment</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<AiOutlineComment />}>
            <Link to="/admin/comment">Comment Review</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<MdManageAccounts />}>
            <Link to="/admin/manage-admin">Manage Admin</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default SideBarAdmin;
