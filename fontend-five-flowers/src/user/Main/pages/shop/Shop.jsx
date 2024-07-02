import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CollectionGrid from "./collectionShop/collectionGrid/CollectionGrid";
import CollectionHeader from "./collectionShop/collectionHeader/CollectionHeader";
import "./shop.scss";
import SideBarShop from "./sideBarShop/SideBarShop";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null); // Thêm trạng thái cho availability
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Assuming 1000 as default max price
  const [initialMaxPrice, setInitialMaxPrice] = useState(1000); // Store initial max price
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayType, setDisplayType] = useState("grid"); // Thêm trạng thái cho kiểu hiển thị

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/products/all", {
        params: { page: 0, size: 10 },
      })
      .then((response) => {
        const productsWithDefaultPrice = response.data.content.map(
          (product) => ({
            ...product,
            originalPrice: product.originalPrice || 1000.0,
            isOnSale: true, // Mock the isOnSale property for testing
          })
        );
        console.log("Fetched products:", productsWithDefaultPrice); // Kiểm tra dữ liệu sản phẩm
        setProducts(productsWithDefaultPrice);
        const maxPriceValue = Math.max(...productsWithDefaultPrice.map(product => product.price));
        setMaxPrice(maxPriceValue);
        setInitialMaxPrice(maxPriceValue); // Set the initial max price
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedBrand, selectedAvailability, minPrice, maxPrice, products]);

  const handleCategoryFilterChange = (category) => {
    console.log("Category filter changed:", category); // Kiểm tra category filter change
    setSelectedCategory(category);
  };

  const handleBrandFilterChange = (brand) => {
    console.log("Brand filter changed:", brand); // Kiểm tra brand filter change
    setSelectedBrand(brand);
  };

  const handlePriceFilterChange = (min, max) => {
    console.log("Price filter changed: min =", min, "max =", max); // Kiểm tra price filter change
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleAvailabilityFilterChange = (availability) => {
    console.log("Availability filter changed:", availability); // Kiểm tra availability filter change
    setSelectedAvailability(availability);
  };

  const handleDisplayChange = (type) => {
    setDisplayType(type);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => {
        console.log("Filtering by categoryId:", product.category.categoryId, "selectedCategory:", selectedCategory);
        return product.category.categoryId === selectedCategory;
      });
    }

    if (selectedBrand) {
      filtered = filtered.filter(product => {
        console.log("Filtering by brandId:", product.brand.brandId, "selectedBrand:", selectedBrand);
        return product.brand.brandId === selectedBrand;
      });
    }

    if (selectedAvailability) {
      filtered = filtered.filter(product => {
        console.log("Filtering by availability:", selectedAvailability);
        return selectedAvailability === "inStock" ? product.quantity > 0 : product.quantity === 0;
      });
    }

    filtered = filtered.filter(product => {
      return product.price >= minPrice && product.price <= maxPrice;
    });

    console.log("Filtered products:", filtered); // Kiểm tra kết quả sau khi lọc
    setFilteredProducts(filtered);
  };

  return (
    <div className="shop-container">
      <div className="top-shop-container">
        <div className="name-top-shop-container">
          <h1>COLLECTION</h1>
        </div>
        <div className="name-bottom-shop-container">
          <div className="home-name-bsc">
            <Link to="/">
              <p>Home</p>
            </Link>
          </div>
          <span className="breadcrumb__sep">
            <p>/</p>
          </span>
          <p>Products</p>
        </div>
      </div>
      <div className="background-bot-shop-container">
        <div className="bot-shop-container">
          <div className="sidebar-shop-container">
            <SideBarShop
              onCategoryFilterChange={handleCategoryFilterChange}
              onBrandFilterChange={handleBrandFilterChange}
              selectedBrand={selectedBrand}
              onPriceFilterChange={handlePriceFilterChange}
              maxPrice={initialMaxPrice} // Pass initial max price
              onAvailabilityFilterChange={handleAvailabilityFilterChange} // Truyền hàm xử lý availability
            />
          </div>
          <div className="collection-grid-container">
            <div className="header-collection-grid-container">
              <CollectionHeader onDisplayChange={handleDisplayChange} />
            </div>
            <div className="bottom-collection-grid-container">
              <CollectionGrid products={filteredProducts} displayType={displayType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
