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
            <div className="summary-section">
              <ChartAdmin />
            </div>
            <div className="selling-section">
              <SellingAdmin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
