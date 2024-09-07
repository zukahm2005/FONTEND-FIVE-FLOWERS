import { Select, Tooltip } from 'antd';
import React from "react";
import "./sortCollectionHeader.scss";

const { Option } = Select;

const SortCollectionHeader = ({ onSortChange }) => {
  const handleSortChange = (value) => {
    onSortChange(value);
  };

  return (
    <div className="sort-collect-container">
      <div className="sort-collect-header">
        <div className="title-sort">
          <p>Sort by</p>
        </div>
        <div className="select-sort">
          <Select
            defaultValue="featured"
            style={{ width: 120 }} // Chiều rộng nhỏ hơn cho Select
            onChange={handleSortChange}
            dropdownStyle={{ border: '1px solid #fa422d', color: 'black' }}
          >
            <Option value="featured">
              <Tooltip title="Sort by Featured" placement="right">
                <span>Featured</span>
              </Tooltip>
            </Option>
            <Option value="az">
              <Tooltip title="Sort Alphabetically, A-Z" placement="right">
                <span>Alphabetically, A-Z</span>
              </Tooltip>
            </Option>
            <Option value="za">
              <Tooltip title="Sort Alphabetically, Z-A" placement="right">
                <span>Alphabetically, Z-A</span>
              </Tooltip>
            </Option>
            <Option value="price-minmax">
              <Tooltip title="Sort by Price, low to high" placement="right">
                <span>Price, low to high</span>
              </Tooltip>
            </Option>
            <Option value="price-maxmin">
              <Tooltip title="Sort by Price, high to low" placement="right">
                <span>Price, high to low</span>
              </Tooltip>
            </Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SortCollectionHeader;
