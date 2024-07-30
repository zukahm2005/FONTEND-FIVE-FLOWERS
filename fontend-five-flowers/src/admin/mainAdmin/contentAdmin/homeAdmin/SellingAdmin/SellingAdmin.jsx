import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellingAdmin.scss';

const SellingAdmin = ({ selectedDate }) => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    fetchTopSellingProducts(selectedDate);
  }, [selectedDate]);

  const fetchTopSellingProducts = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/orders/top-selling-products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: date.format('YYYY-MM-DD'),
        },
      });
      setTopSellingProducts(response.data);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
    }
  };

  return (
    <div className="selling-admin-container">
      <h2>Top Selling Products</h2>
      <div className="top-selling-products">
        {topSellingProducts.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <div className="product-details">
                <p className="product-price">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellingAdmin;
