import { Tooltip, notification } from "antd";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CartContext } from "../../../header/components/cart/cartContext/CartProvider";
import Review from "../review/Review";
import ReviewsList from "../review/reviewList/ReviewList";
import "./productDetails.scss";
import RecommentProduct from "./recomProduct/RecomProduct";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const { fetchProductDetails, productDetails, addToCart, isLoggedIn } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const mainSlider = useRef(null);
  const thumbnailSlider = useRef(null);
  const [showReviews, setShowReviews] = useState(false); // State để kiểm soát hiển thị danh sách đánh giá
  const [reviews, setReviews] = useState([]); // State để lưu trữ danh sách đánh giá

  useEffect(() => {
    fetchProductDetails(id);
    loadReviews(); // Tải đánh giá khi component được mount
  }, [id]);

  const loadReviews = () => {
    axios
      .get(`/api/v1/reviews/product/${id}`) // Sử dụng endpoint mới
      .then((response) => {
        const reviewData = response.data.map(review => ({
          ...review,
          userName: review.user.userName,
          productName: review.product.productName,
          createdAt: review.createdAt
        }));
        setReviews(reviewData);
      })
      .catch((error) => {
        console.error("There was an error fetching the reviews!", error);
      });
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= productDetails.quantity) {
      setQuantity(value);
    } else if ( value > productDetails.quantity) {
      notification.error({
        message: "Out of Stock",
        description: `Only ${productDetails.quantity} items left in stock.`,
      });
    }
  };

  const handleAddToCart = async () => {
    console.log("Button clicked, attempting to add to cart:", productDetails, quantity);
    await addToCart(productDetails, quantity);
  };
  

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    asNavFor: thumbnailSlider.current,
    ref: mainSlider,
    prevArrow: <div className="slick-prev" />,
    nextArrow: <div className="slick-next" />,
  };

  const thumbnailSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    asNavFor: mainSlider.current,
    focusOnSelect: true,
    ref: thumbnailSlider,
    swipe: false,
    draggable: false,
    prevArrow: <div className="slick-prev" />,
    nextArrow: <div className="slick-next" />,
  };

  return (
    <div className="product-details-container">
      <div className="content-product-details">
        <div className="container-text-center-product-details">
          <div className="main-text-center">
            <h1>PRODUCT</h1>
          </div>
          <div className="nav-main-text-center">
            <div className="breadcrumb">
              <a href="/">Home </a>
              <span aria-hidden="true" className="breadcrumb__sep">
                {" "}
                /{" "}
              </span>
              <span>{productDetails.name}</span>
            </div>
          </div>
        </div>
        <div className="content-container-details-product">
          <div className="img-details-product">
            {productDetails.productImages && productDetails.productImages.length > 0 ? (
              <>
                <Slider {...mainSliderSettings} className="main-slider">
                  {productDetails.productImages.map((image, index) => (
                    <div key={image.productImageId}>
                      <img
                        src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                        alt={productDetails.name}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  ))}
                </Slider>
                <Slider
                  {...thumbnailSliderSettings}
                  className="thumbnail-slider"
                >
                  {productDetails.productImages.map((image, index) => (
                    <motion.div
                      key={image.productImageId}
                      className={`thumbnail-slide ${
                        activeSlide === index ? "active" : ""
                      }`}
                    >
                      <img
                        src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                        alt={productDetails.name}
                      />
                    </motion.div>
                  ))}
                </Slider>
              </>
            ) : (
              <p>No Images Available</p>
            )}
          </div>
          <div className="content-main-details-product">
            <div className="name-details-product">
              <h1>{productDetails.name}</h1>
            </div>
            <div className="content-below-details">
              <div className="title-content-below-details1">
                <div className="title-content">
                  <p>Price:</p>
                </div>
                <div className="title-content">
                  <p>Color:</p>
                </div>
                <div className="title-content">
                  <p>Brand:</p>
                </div>
                <div className="title-content">
                  <p>Category:</p>
                </div>
                <div className="title-content">
                  <p>Quantity:</p>
                </div>
              </div>
              <div className="title-content-below-details2">
                <div className="title1">
                  <p>Rs. {productDetails.price}</p>
                </div>
                <div className="title">
                  <Tooltip
                    title={productDetails.color}
                    overlayInnerStyle={{
                      backgroundColor: "white",
                      color: "#fa422d",
                    }}
                    color="white"
                  >
                    <div
                      className="color-block"
                      style={{ backgroundColor: productDetails.color }}
                    ></div>
                  </Tooltip>
                </div>
                <div className="title">
                  <p>{productDetails.brand.name}</p>
                </div>
                <div className="title">
                  <p>{productDetails.category.name}</p>
                </div>
                <div className="cacul-cart">
                  <div
                    className="cacul-quantity-content-cart1"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <p>-</p>
                  </div>
                  <div className="quantity-content-cart">
                    <p>{quantity}</p>
                  </div>
                  <div
                    className="cacul-quantity-content-cart2"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <p>+</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="availability">
              <h6>Availability:</h6>
              <p className={productDetails.quantity > 0 ? "in-stock" : "out-of-stock"}>
                {productDetails.quantity > 0 ? "In stock!" : "Out of stock!"}
              </p>
            </div>
            <div className="title-content-button">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={productDetails.quantity === 0}
              >
                <p>ADD TO CART</p>
              </button>
              <Review productId={productDetails.productId} onReviewSubmitted={loadReviews} /> {/* Truyền callback vào Review */}
            </div>
          </div>
        </div>
        <div className="desc-container-product-details">
          <div className="title-desc-product-details">
            <button onClick={() => setShowReviews(false)}>
              <p>PRODUCT DESCRIPTION</p>
            </button>
            <button onClick={() => setShowReviews(true)}>
              <p>REVIEW</p>
            </button>
          </div>
          <div className="content-desc-product-details">
            {!showReviews ? (
              <div dangerouslySetInnerHTML={{ __html: productDetails.description }} /> // Sử dụng dangerouslySetInnerHTML để hiển thị HTML
            ) : (
              <ReviewsList productId={id} reviews={reviews} /> // Truyền productId vào ReviewsList
            )}
          </div>
        </div>
      </div>
      <RecommentProduct />
    </div>
  );
};

export default ProductDetail;
