import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SellingAdmin.scss";

const SellingAdmin = ({ selectedDate }) => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      fetchTopSellingProducts(selectedDate);
    }
  }, [selectedDate]);

  const fetchTopSellingProducts = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/v1/orders/top-selling-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: date.format("YYYY-MM-DD"),
        },
      });
      setTopSellingProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm bán chạy:", error);
    }
  };

  return (
    <div className="selling-admin-container">
      <div className="title-selling-admin-container">
        <h2>Top Selling</h2>
      </div>
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
                  <p>{product.brand} /</p> <p>{product.category}</p>
                </div>
              </div>
            </div>
            <div className="price-product-card">
              <p className="product-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellingAdmin;
