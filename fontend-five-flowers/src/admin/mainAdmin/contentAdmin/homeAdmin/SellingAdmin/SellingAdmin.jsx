import React from 'react';
import './SellingAdmin.scss';

const SellingAdmin = () => {
  const topSellingProducts = [
    { name: 'Homepod', price: '$129.00', category: 'USB, wireless', imageUrl: 'homepod.jpg' },
    { name: 'Macbook Pro', price: '$899.00', category: 'USB, wireless', imageUrl: 'macbook.jpg' },
    { name: 'Apple Watch', price: '$399.00', category: 'USB, wireless', imageUrl: 'applewatch.jpg' },
  ];

  return (
    <div className="selling-admin-container">
      <h2>Top Selling Products</h2>
      <div className="top-selling-products">
        {topSellingProducts.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-category">{product.category}</p>
              <p className="product-price">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellingAdmin;
