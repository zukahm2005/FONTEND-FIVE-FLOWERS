import React, { useEffect, useState } from "react";
import "./priceShop.scss";

const PriceShop = ({ onPriceFilterChange, maxPrice }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

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

  return (
    <div className="price-container">
      <div className="name-price">
        <p>Price</p>
      </div>
      <div className="content-below-price">
        <div className="title-price">
          <p>The highest price is Rs. {maxPrice}</p>
        </div>
        <div className="input-price">
          <div className="label-input">
            <p>From ₹</p>
          </div>
          <input
            type="text"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="input-price">
          <div className="label-input">
            <p>To ₹</p>
          </div>
          <input
            type="text"
            placeholder={maxPrice}
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
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
