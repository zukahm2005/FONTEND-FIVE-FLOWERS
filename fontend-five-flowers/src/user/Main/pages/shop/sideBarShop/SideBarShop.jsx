import React from "react";

import AvailabilityShop from "./availabilityShop/AvailabilityShop";
import BrandShop from "./BrandShop/BrandShop"
import CategoryShop from "./categoryShop/CategoryShop";
import PriceShop from "./priceShop/PriceShop";
import "./sideBarShop.scss";
const SideBarShop = ({
  onCategoryFilterChange,
  onBrandFilterChange,
  selectedBrand,
  onPriceFilterChange,
  maxPrice,
  onAvailabilityFilterChange,
}) => {
  return (
    <div className="sidebar-shop-container">
      <div className="sidebar-shop-category">
        <CategoryShop onFilterChange={onCategoryFilterChange} />
      </div>
      <div className="sidebar-shop-brand">
        <BrandShop
          onBrandFilterChange={onBrandFilterChange}
          selectedBrand={selectedBrand}
        />
      </div>
      <div className="sidebar-shop-price">
        <PriceShop
          onPriceFilterChange={onPriceFilterChange}
          maxPrice={maxPrice}
        />
      </div>
      <div className="sidebar-shop-avail">
        <AvailabilityShop
          onAvailabilityFilterChange={onAvailabilityFilterChange}
        />
      </div>
    </div>
  );
};

export default SideBarShop;
