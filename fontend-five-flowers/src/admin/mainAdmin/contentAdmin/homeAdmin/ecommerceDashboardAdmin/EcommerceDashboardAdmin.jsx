import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  OrderedListOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "./EcommerceDashboardAdmin.scss";

const EcommerceDashboardAdmin = ({ selectedDate }) => {
  const [stats, setStats] = useState({
    totalSale: 0,
    newOrder: 0,
    addToCart: 0,
    conversionRate: "0%",
    visitor: 0,
    newUser: 0,
  });

  const fetchStats = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/analytics/stats/byDate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: date.format("YYYY-MM-DD"),
        },
      });

      const data = response.data;
      setStats({
        totalSale: `$${data.totalSale}`,
        newOrder: data.newOrder,
        addToCart: data.addToCart,
        conversionRate: `${data.conversionRate}%`,
        visitor: data.visitor,
        newUser: data.newUser,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAddToCartStats = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/v1/cart/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: date.format("YYYY-MM-DD"),
        },
      });

      const data = response.data;
      setStats(prevStats => ({
        ...prevStats,
        addToCart: data.addToCart,
      }));
    } catch (error) {
      console.error("Error fetching add to cart stats:", error);
    }
  };

  useEffect(() => {
    fetchStats(selectedDate);
    fetchAddToCartStats(selectedDate);
  }, [selectedDate]);

  const statsData = [
    {
      title: "Total Sale",
      value: stats.totalSale,
      icon: <DollarOutlined />,
      color: "#1890ff",
    },
    {
      title: "New Order",
      value: stats.newOrder,
      icon: <OrderedListOutlined />,
      color: "#722ed1",
    },
    {
      title: "Add To Cart",
      value: stats.addToCart,
      icon: <ShoppingCartOutlined />,
      color: "#faad14",
    },
    {
      title: "Conversion Rate",
      value: stats.conversionRate,
      icon: <PercentageOutlined />,
      color: "#52c41a",
    },
    {
      title: "Visitor",
      value: stats.visitor,
      icon: <EyeOutlined />,
      color: "#f5222d",
    },
    {
      title: "New User",
      value: stats.newUser,
      icon: <UserAddOutlined />,
      color: "#eb2f96",
    },
  ];

  return (
    <div className="ecommerce-dashboard-container">
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              className="stat-card"
              style={{ borderLeft: `4px solid ${stat.color}` }}
            >
              <div className="stat-card-body">
                <div className="stat-card-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-card-content">
                  <div className="stat-card-value">{stat.value}</div>
                  <div className="stat-card-title">{stat.title}</div>
                </div>
              </div>
              <div className="stat-card-footer">
                <a href="#">
                  More info <span>&#8594;</span>
                </a>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EcommerceDashboardAdmin;
