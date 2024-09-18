import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import "./SellingAdmin.scss";

const SellingAdmin = ({ selectedDates }) => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [noOrdersMessage, setNoOrdersMessage] = useState("");

  useEffect(() => {
    if (selectedDates) {
      fetchTopSellingProducts(selectedDates);
    }
  }, [selectedDates]);

  const fetchTopSellingProducts = async (dates) => {
    const [startDate, endDate] = dates;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/v1/orders/top-selling-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        },
      });

      if (response.data.length === 0) {
        setNoOrdersMessage("No orders for the selected date range.");
      } else {
        setNoOrdersMessage("");
      }

      setTopSellingProducts(response.data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      setNoOrdersMessage("Error fetching order data.");
    }
  };

  return (
    <div className="selling-admin-container">
      <div className="title-selling-admin-container">
        <h2>Top Selling</h2>
      </div>
      {noOrdersMessage ? (
        <p className="no-orders-message">{noOrdersMessage}</p>
      ) : (
        <div className="top-selling-products">
          {topSellingProducts.map((product, index) => (
            <div key={index} className="product-card">
              <div className="info-product-card">
                <div className="img-product-card">
                  <img
                    src={`http://localhost:8080/api/v1/images/${product.imageUrl}`}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <div className="details-product-card">
                  <div className="name-product-card">
                    <p className="product-name">{product.name}</p>
                  </div>
                  <div className="category-product-card">
                    <p>{product.brand} / {product.category}</p>
                  </div>
                  <div className="quantity-product-card">
                    <p>{product.quantitySold} Items Sold</p>
                  </div>
                </div>
              </div>
              <div className="price-product-card">
                <p className="product-price">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellingAdmin;
