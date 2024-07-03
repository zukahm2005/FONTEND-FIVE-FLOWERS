import React from "react";
import "./sortCollectionHeader.scss";

const SortCollectionHeader = ({ onSortChange }) => {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="sort-collect-container">
      <div className="sort-collect-header">
        <div className="title-sort">
          <p>Sort by</p>
        </div>
        <div className="select-sort">
          <select name="sort" id="sort" onChange={handleSortChange}>
            <option value="featured">Featured</option>
            <option value="az">Alphabetically, A-Z</option>
            <option value="za">Alphabetically, Z-A</option>
            <option value="price-minmax">Price, low to high</option>
            <option value="price-maxmin">Price, high to low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortCollectionHeader;
