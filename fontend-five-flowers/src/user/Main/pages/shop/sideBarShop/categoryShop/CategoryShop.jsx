import React from "react";
import "./categoryShop.scss";
const CategoryShop = () => {
  return (
    <div className="category-container">
      <div className="title-category">
        <p>Category</p>
      </div>
      <div className="list-category">
        <ul>
          <li>
            <a href="/">Category 1</a>
          </li>
          <li>
            <a href="/">Category 2</a>
          </li>
          <li>
            <a href="/">Category 3</a>
          </li>
          <li>
            <a href="/">Category 4</a>
          </li>
          <li>
            <a href="/">Category 5</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryShop;
