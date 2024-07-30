import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import EcommerceDashboardAdmin from "./ecommerceDashboardAdmin/EcommerceDashboardAdmin";
import ChartAdmin from "./chartAdmin/ChartAdmin";
import SellingAdmin from "./SellingAdmin/SellingAdmin";
import "./HomeAdmin.scss";

const HomeAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="content-container">
          <div className="header-ecommerce-dashboard-box">
            <div className="title-ecommercedashboard">
              <p>Dashboard</p>
            </div>
            <div className="date-picker-container">
              <DatePicker value={selectedDate} onChange={onDateChange} />
            </div>
          </div>
          <EcommerceDashboardAdmin selectedDate={selectedDate} />
          <div className="dashboard-row">
            <div className="summary-section">
              <ChartAdmin selectedDate={selectedDate} />
            </div>
            <div className="selling-section">
              <SellingAdmin selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
