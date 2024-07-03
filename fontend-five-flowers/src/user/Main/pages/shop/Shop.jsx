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
  const [searchTerm, setSearchTerm] = useState(""); // Thêm trạng thái tìm kiếm
  const [sortType, setSortType] = useState("featured"); // Thêm trạng thái sắp xếp

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
        setProducts(productsWithDefaultPrice);
        const maxPriceValue = Math.max(
          ...productsWithDefaultPrice.map((product) => product.price)
        );
        setMaxPrice(maxPriceValue);
        setInitialMaxPrice(maxPriceValue); // Set the initial max price
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    filterProducts();
  }, [
    selectedCategory,
    selectedBrand,
    selectedAvailability,
    minPrice,
    maxPrice,
    products,
    searchTerm,
    sortType,
  ]);

  const handleCategoryFilterChange = (category) => {
    setSelectedCategory(category);
  };

  const handleBrandFilterChange = (brand) => {
    setSelectedBrand(brand);
  };

  const handlePriceFilterChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleAvailabilityFilterChange = (availability) => {
    setSelectedAvailability(availability);
  };

  const handleDisplayChange = (type) => {
    setDisplayType(type);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sort) => {
    setSortType(sort);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        console.log(
          "Filtering by categoryId:",
          product.category.categoryId,
          "selectedCategory:",
          selectedCategory
        );
        return product.category.categoryId === selectedCategory;
      });
    }

    if (selectedBrand) {
      filtered = filtered.filter((product) => {
        console.log(
          "Filtering by brandId:",
          product.brand.brandId,
          "selectedBrand:",
          selectedBrand
        );
        return product.brand.brandId === selectedBrand;
      });
    }

    if (selectedAvailability) {
      filtered = filtered.filter((product) => {
        console.log("Filtering by availability:", selectedAvailability);
        return selectedAvailability === "inStock"
          ? product.quantity > 0
          : product.quantity === 0;
      });
    }

    filtered = filtered.filter((product) => {
      return product.price >= minPrice && product.price <= maxPrice;
    });

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortType) {
      case "az":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-minmax":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-maxmin":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

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
              <CollectionHeader
                onDisplayChange={handleDisplayChange}
                onSearchTermChange={handleSearchTermChange}
                onSortChange={handleSortChange}
              />
            </div>
            <div className="bottom-collection-grid-container">
              <CollectionGrid
                products={filteredProducts}
                displayType={displayType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
