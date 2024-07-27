import { Button, Drawer } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import CollectionGrid from "./collectionShop/collectionGrid/CollectionGrid";
import CollectionHeader from "./collectionShop/collectionHeader/CollectionHeader";
import "./shop.scss";
import SideBarShop from "./sideBarShop/SideBarShop";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [initialMaxPrice, setInitialMaxPrice] = useState(1000);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayType, setDisplayType] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("featured");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/products/all", {
        params: { page: 0, size: 1000 },
      })
      .then((response) => {
        const productsWithDefaultPrice = response.data.content.map((product) => ({
          ...product,
          originalPrice: product.originalPrice || 1000.0,
          isOnSale: true,
        }));
        setProducts(productsWithDefaultPrice);
        const maxPriceValue = Math.max(
          ...productsWithDefaultPrice.map((product) => product.price)
        );
        setMaxPrice(maxPriceValue);
        setInitialMaxPrice(maxPriceValue);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
      if (window.innerWidth <= 1000) {
        setItemsPerPage(displayType === "list" ? 5 : 4);
      } else {
        setItemsPerPage(displayType === "list" ? 5 : 9);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [displayType]);

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
    currentPage,
    itemsPerPage,
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
    setItemsPerPage(type === "list" ? 5 : (window.innerWidth <= 1000 ? 4 : 9));
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sort) => {
    setSortType(sort);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        return product.category.categoryId === selectedCategory;
      });
    }

    if (selectedBrand) {
      filtered = filtered.filter((product) => {
        return product.brand.brandId === selectedBrand;
      });
    }

    if (selectedAvailability) {
      filtered = filtered.filter((product) => {
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
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const displayedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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
          {isMobile ? (
            <>
              <Button
                className="drawer-button"
                onClick={() => setDrawerVisible(true)}
                icon={<FaArrowRight />}
              />
              <Drawer
                title="Filters"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                bodyStyle={{ padding: "1rem" }}
              >
                <SideBarShop
                  onCategoryFilterChange={handleCategoryFilterChange}
                  onBrandFilterChange={handleBrandFilterChange}
                  selectedBrand={selectedBrand}
                  onPriceFilterChange={handlePriceFilterChange}
                  maxPrice={initialMaxPrice}
                  onAvailabilityFilterChange={handleAvailabilityFilterChange}
                />
              </Drawer>
            </>
          ) : (
            <div className="sidebar-shop-container">
              <SideBarShop
                onCategoryFilterChange={handleCategoryFilterChange}
                onBrandFilterChange={handleBrandFilterChange}
                selectedBrand={selectedBrand}
                onPriceFilterChange={handlePriceFilterChange}
                maxPrice={initialMaxPrice}
                onAvailabilityFilterChange={handleAvailabilityFilterChange}
              />
            </div>
          )}
          <div className={`collection-grid-container ${isMobile ? 'mobile-fullwidth' : ''}`}>
            <div className="header-collection-grid-container">
              <CollectionHeader
                onDisplayChange={handleDisplayChange}
                onSearchTermChange={handleSearchTermChange}
                onSortChange={handleSortChange}
              />
            </div>
            <div className="bottom-collection-grid-container">
              <CollectionGrid
                products={displayedProducts}
                displayType={displayType}
                itemsPerPage={itemsPerPage}
              />
              <ReactPaginate
                previousLabel={<FaArrowLeft />}
                nextLabel={<FaArrowRight />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageClassName={"page"}
                previousClassName={`prev ${currentPage === 0 ? "disabled" : ""}`}
                nextClassName={`next ${currentPage === totalPages - 1 ? "disabled" : ""}`}
                disabledClassName={"disabled"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
