import { Layout, Menu } from "antd";
import React from "react";
import { AiOutlineComment, AiOutlineProduct } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { MdManageAccounts, MdOutlineHome, MdPayment } from "react-icons/md";
import { RiBloggerLine } from "react-icons/ri";
import { TbAddressBook, TbBrandAirbnb } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import "./sideBarAdmin.scss";

const { Sider } = Layout;

const SideBarAdmin = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split("/")[2]; // Lấy key từ pathname

  const menuItems = [
    { key: "home", icon: <MdOutlineHome />, label: "Home", path: "/admin/home" },
    { key: "product", icon: <AiOutlineProduct />, label: "Product", path: "/admin/product" },
    { key: "address", icon: <TbAddressBook />, label: "Customer", path: "/admin/address" },
    { key: "blog", icon: <RiBloggerLine />, label: "Blog", path: "/admin/blog" },
    { key: "brand", icon: <TbBrandAirbnb />, label: "Brand", path: "/admin/brand" },
    { key: "category", icon: <BiCategory />, label: "Category", path: "/admin/category" },
    { key: "orders", icon: <BsCart2 />, label: "Order", path: "/admin/orders" },
    { key: "payment", icon: <MdPayment />, label: "Payment", path: "/admin/payment" },
    { key: "comment", icon: <AiOutlineComment />, label: "Comment Review", path: "/admin/comment" },
    { key: "contact", icon: <CiMail />, label: "Contact", path: "/admin/contact" },
    { key: "manage-admin", icon: <MdManageAccounts />, label: "Manage Admin", path: "/admin/manage-admin" },
  ];

  return (
    <>
      <div className="side-bar-admin-placeholder"></div>
      <Sider width={200} className="side-bar-admin-container" style={{ position: 'fixed', height: '100vh' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: "100%", borderRight: 0 }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </>
  );
};

export default SideBarAdmin;
