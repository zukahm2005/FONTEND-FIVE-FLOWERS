import React, { useEffect, useState } from "react";
import { Row, Col, Card, DatePicker } from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "./HomeAdmin.scss";

const HomeAdmin = () => {
  const [stats, setStats] = useState({
    totalSale: 0,
    conversionRate: "0%",
    addToCart: 0,
    visitor: 0,
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
        conversionRate: `${data.conversionRate}%`,
        addToCart: data.addToCart,
        visitor: data.visitor,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats(moment());
  }, []);

  const onDateChange = (date) => {
    fetchStats(date);
  };

  const statsData = [
    {
      title: "Total Sale",
      value: stats.totalSale,
      icon: <DollarOutlined />,
      color: "#1890ff",
    },
    {
      title: "Conversion Rate",
      value: stats.conversionRate,
      icon: <PercentageOutlined />,
      color: "#52c41a",
    },
    {
      title: "Add To Cart",
      value: stats.addToCart,
      icon: <ShoppingCartOutlined />,
      color: "#faad14",
    },
    {
      title: "Visitor",
      value: stats.visitor,
      icon: <EyeOutlined />,
      color: "#f5222d",
    },
  ];

  return (
    <div className="home-admin-container">
      <div className="header-home-admin-box">
        <div className="title-homeadmin">
          <p>Dashboard</p>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
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
      <div className="date-picker-container">
        <DatePicker onChange={(date) => onDateChange(date)} />
      </div>
    </div>
  );
};

export default HomeAdmin;
