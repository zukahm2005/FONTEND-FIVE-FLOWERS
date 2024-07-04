import axios from "axios";
import React, { useEffect, useState } from "react";
import "./categoryShop.scss";

const CategoryShop = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories
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
        console.log("Fetched categories:", categoryResponse.data.content); // Kiểm tra dữ liệu categories
        setCategories(categoryResponse.data.content);

        // Fetch products
        const productResponse = await axios.get("http://localhost:8080/api/v1/products/all", {
          params: {
            page: 0,
            size: 1000, // Lấy đủ số lượng sản phẩm để tính toán
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Fetched products:", productResponse.data.content); // Kiểm tra dữ liệu products
        const products = productResponse.data.content; // Giả sử API trả về `content`

        // Tính toán số lượng sản phẩm cho mỗi category
        const counts = products.reduce((acc, product) => {
          const categoryId = product.category.categoryId; // Điều chỉnh nếu cần thiết
          acc[categoryId] = (acc[categoryId] || 0) + 1;
          return acc;
        }, {});

        console.log("Calculated product counts:", counts); // Kiểm tra kết quả tính toán
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

  return (
    <div className="category-container">
      <div className="title-category">
        <p>Category</p>
      </div>
      <div className="list-category">
        {categories.map((category) => (
          <label
            key={category.categoryId}
            className="check-box-container"
            onClick={() => handleCheckboxChange(category.categoryId)}
          >
            <div className="check-box-category">
              <input
                type="checkbox"
                value={category.categoryId}
                onChange={() => handleCheckboxChange(category.categoryId)}
                checked={selectedCategory === category.categoryId}
              />
            </div>
            <div className="name-category">
              <p>{category.name} ({productCounts[category.categoryId] || 0})</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryShop;
