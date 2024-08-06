import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import EcommerceDashboardAdmin from "./ecommerceDashboardAdmin/EcommerceDashboardAdmin";
import ChartAdmin from "./chartAdmin/ChartAdmin";
import SellingAdmin from "./SellingAdmin/SellingAdmin";
import { Link } from "react-router-dom";
import "./HomeAdmin.scss";

const { RangePicker } = DatePicker;

const HomeAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [totalSale, setTotalSale] = useState(0);

  useEffect(() => {
    setSelectedDate(moment());
  }, []);

  const onDateChange = (dates) => {
    if (dates && dates[1]) {
      setSelectedDate(dates[1]);
    } else {
      setSelectedDate(moment());
    }
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
              <RangePicker
              defaultValue={[moment(), moment()]}
                onChange={onDateChange}
                size="small"
                style={{ width: 150 }}
              />
            </div>
            <div className="button-create-orderadmin">
              <Link to="/admin/orders/add">
                <p>Create order</p>
              </Link>
            </div>
          </div>
          <EcommerceDashboardAdmin selectedDate={selectedDate} totalSale={totalSale} />
          <div className="dashboard-row">
            <div className="summary-section">
              <ChartAdmin selectedDate={selectedDate} setTotalSale={setTotalSale} />
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
