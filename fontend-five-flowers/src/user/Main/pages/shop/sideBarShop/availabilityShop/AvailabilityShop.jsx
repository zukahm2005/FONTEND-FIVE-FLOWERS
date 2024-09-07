import axios from "axios";
import React, { useEffect, useState } from "react";
import "./availabilityShop.scss";

const AvailabilityShop = ({ onAvailabilityFilterChange }) => {
  const [availabilityCounts, setAvailabilityCounts] = useState({
    inStock: 0,
    outOfStock: 0,
  });
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get("http://localhost:8080/api/v1/products/all", {
          params: {
            page: 0,
            size: 1000,
          }
        });
        const products = productResponse.data.content;

        // Tính toán số lượng sản phẩm theo tình trạng kho
        const counts = products.reduce(
          (acc, product) => {
            if (product.quantity > 0) {
              acc.inStock += 1;
            } else {
              acc.outOfStock += 1;
            }
            return acc;
          },
          { inStock: 0, outOfStock: 0 }
        );

        setAvailabilityCounts(counts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCheckboxChange = (availability) => {
    const newSelectedAvailability =
      selectedAvailability === availability ? null : availability;
    setSelectedAvailability(newSelectedAvailability);
    onAvailabilityFilterChange(newSelectedAvailability);
  };

  return (
    <div className="avail-container">
      <div className="title-avail">
        <p>Availability</p>
      </div>

      <label className="input-stock-container">
        <input
          type="checkbox"
          onChange={() => handleCheckboxChange("inStock")}
          checked={selectedAvailability === "inStock"}
        />
        <div className="label-checkbox-stock">
          <p>In stock ({availabilityCounts.inStock})</p>
        </div>
      </label>

      <label className="input-stock-container">
        <input
          type="checkbox"
          onChange={() => handleCheckboxChange("outOfStock")}
          checked={selectedAvailability === "outOfStock"}
        />
        <div className="label-checkbox-stock">
          <p>Out of stock ({availabilityCounts.outOfStock})</p>
        </div>
      </label>
    </div>
  );
};

export default AvailabilityShop;
