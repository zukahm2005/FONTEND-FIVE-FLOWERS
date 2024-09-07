import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import "./categoryShop.scss";

const CategoryShop = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productCounts, setProductCounts] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State cho dropdown

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:8080/api/v1/categories/all",
          {
            params: {
              page: 0,
              size: 10,
              sortBy: "categoryId",
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setCategories(categoryResponse.data.content);

        const productResponse = await axios.get("http://localhost:8080/api/v1/products/all", {
          params: {
            page: 0,
            size: 1000,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const products = productResponse.data.content;
        const counts = products.reduce((acc, product) => {
          const categoryId = product.category.categoryId;
          acc[categoryId] = (acc[categoryId] || 0) + 1;
          return acc;
        }, {});

        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching categories or products:", error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const handleCheckboxChange = (categoryId) => {
    const newSelectedCategory =
      selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newSelectedCategory);
    onFilterChange(newSelectedCategory);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Đổi trạng thái dropdown
  };

  return (
    <div className="category-container">
      <div className="title-category" onClick={toggleDropdown}>
        <p>Category</p>
        <IoIosArrowUp className={`arrow-icon ${isDropdownOpen ? "open" : ""}`} />
      </div>
      {isDropdownOpen && (
        <div className="list-category">
          {categories.map((category) => (
            <label
              key={category.categoryId}
              className="check-box-container"
            >
              <input
                type="checkbox"
                value={category.categoryId}
                onChange={() => handleCheckboxChange(category.categoryId)}
                checked={selectedCategory === category.categoryId}
              />
              <div className="name-category">
                <p>{category.name} ({productCounts[category.categoryId] || 0})</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryShop;
