import React from "react";
import EcommerceDashboardAdmin from "./ecommerceDashboardAdmin/EcommerceDashboardAdmin";
import ChartAdmin from "./chartAdmin/ChartAdmin";
import SellingAdmin from "./SellingAdmin/SellingAdmin";
import "./HomeAdmin.scss";

const HomeAdmin = () => {
  return (
    <div className="home-container">
      <div className="main-content">
        <div className="content-container">
          <EcommerceDashboardAdmin />
          <div className="dashboard-row">
            <div className="chart-admin-container">
              <ChartAdmin />
            </div>
            <div className="selling-admin-container">
              <SellingAdmin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
