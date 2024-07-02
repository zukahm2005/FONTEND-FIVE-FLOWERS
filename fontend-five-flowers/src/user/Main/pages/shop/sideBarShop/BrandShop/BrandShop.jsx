import axios from "axios";
import React, { useEffect, useState } from "react";
import "./brandShop.scss";

const BrandShop = ({ onBrandFilterChange, selectedBrand }) => {
  const [brands, setBrands] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    const fetchBrandsAndProducts = async () => {
      try {
        // Fetch brands
        const brandResponse = await axios.get(
          "http://localhost:8080/api/v1/brands/all"
        );
        console.log("Fetched brands:", brandResponse.data.content); // Kiểm tra dữ liệu trả về
        setBrands(
          Array.isArray(brandResponse.data.content) ? brandResponse.data.content : []
        );

        // Fetch products
        const productResponse = await axios.get("http://localhost:8080/api/v1/products/all", {
          params: {
            page: 0,
            size: 1000, // Lấy đủ số lượng sản phẩm để tính toán
          }
        });
        const products = productResponse.data.content; // Giả sử API trả về `content`

        // Tính toán số lượng sản phẩm cho mỗi brand
        const counts = products.reduce((acc, product) => {
          const brandId = product.brand.brandId; // Điều chỉnh nếu cần thiết
          acc[brandId] = (acc[brandId] || 0) + 1;
          return acc;
        }, {});

        console.log("Calculated product counts:", counts); // Kiểm tra kết quả tính toán
        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching brands or products:", error);
        setBrands([]); // Đảm bảo brands luôn là một mảng
      }
    };

    fetchBrandsAndProducts();
  }, []);

  const handleCheckboxChange = (brandId) => {
    const newSelectedBrand = selectedBrand === brandId ? null : brandId;
    console.log("Selected brand:", newSelectedBrand); // Kiểm tra brand được chọn
    onBrandFilterChange(newSelectedBrand);
  };

  return (
    <div className="brand-container">
      <div className="title-brand">
        <p>Brand</p>
      </div>
      <div className="list-brand">
        {brands.map((brand) => (
          <label
            key={brand.brandId}
            className="check-box-container"
            onClick={() => handleCheckboxChange(brand.brandId)}
          >
            <div className="check-box-brand">
              <input
                type="checkbox"
                value={brand.brandId}
                onChange={() => handleCheckboxChange(brand.brandId)}
                checked={selectedBrand === brand.brandId}
              />
            </div>
            <div className="name-brand">
              <p>{brand.name} ({productCounts[brand.brandId] || 0})</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandShop;
