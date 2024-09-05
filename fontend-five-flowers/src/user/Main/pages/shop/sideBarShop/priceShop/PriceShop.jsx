import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import "./priceShop.scss";

const PriceShop = ({ onPriceFilterChange, maxPrice }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [isFocused, setIsFocused] = useState({ min: false, max: false });

  useEffect(() => {
    setMaxPriceInput(maxPrice);
  }, [maxPrice]);

  const handleApplyClick = () => {
    onPriceFilterChange(minPrice, maxPriceInput);
  };

  const handleResetClick = () => {
    setMinPrice(0);
    setMaxPriceInput(maxPrice);
    onPriceFilterChange(0, maxPrice);
  };

  const handleFocusChange = (field, focus) => {
    setIsFocused((prev) => ({ ...prev, [field]: focus }));
  };

  return (
    <div className="price-container">
      <div className="name-price">
        <p>Price</p>
      </div>
      <div className="content-below-price">
        <div className="title-price">
          <p>The highest price is {maxPrice}$</p>
        </div>
        <div className="input-price">
          <div className="label-input">
            <p>From $</p>
          </div>
          <motion.input
            type="text"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onFocus={() => handleFocusChange("min", true)}
            onBlur={() => handleFocusChange("min", false)}
            animate={{
              borderColor: isFocused.min ? "#fa3e2c" : "#e7e7e7",
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="input-price">
          <div className="label-input">
            <p>To $</p>
          </div>
          <motion.input
            type="text"
            placeholder={maxPrice}
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            onFocus={() => handleFocusChange("max", true)}
            onBlur={() => handleFocusChange("max", false)}
            animate={{
              borderColor: isFocused.max ? "#fa3e2c" : "#e7e7e7",
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="button-price">
          <div className="button-price-apply">
            <button onClick={handleApplyClick}>
              <p>APPLY</p>
            </button>
          </div>
          <div className="button-price-reset">
            <button onClick={handleResetClick}>
              <p>RESET</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceShop;
