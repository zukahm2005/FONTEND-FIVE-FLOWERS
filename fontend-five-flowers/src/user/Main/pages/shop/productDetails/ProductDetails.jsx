import { Tooltip } from 'antd';
import axios from "axios";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CartContext } from "../../../header/components/cart/cartContext/CartProvider";
import "./productDetails.scss";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const [activeSlide, setActiveSlide] = useState(0);
  const mainSlider = useRef(null);
  const thumbnailSlider = useRef(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/products/get/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: thumbnailSlider.current,
    ref: mainSlider,
  };

  const thumbnailSliderSettings = {
    slidesToShow: 4, // Display 4 thumbnails
    slidesToScroll: 1,
    infinite: true,
    asNavFor: mainSlider.current,
    focusOnSelect: true,
    ref: thumbnailSlider,
    beforeChange: (current, next) => setActiveSlide(next),
    swipe: false, // Disable swiping to change slides
    draggable: false, // Disable dragging to change slides
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
              <span aria-hidden="true" className="breadcrumb__sep">/</span>
              <span>{product.name}</span>
            </div>
          </div>
        </div>
        <div className="content-container-details-product">
          <div className="img-details-product">
            {product.productImages && product.productImages.length > 0 ? (
              <>
                <Slider {...mainSliderSettings} className="main-slider">
                  {product.productImages.map((image, index) => (
                    <div key={image.productImageId}>
                      <img
                        src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                        alt={product.name}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  ))}
                </Slider>
                <Slider {...thumbnailSliderSettings} className="thumbnail-slider">
                  {product.productImages.map((image, index) => (
                    <motion.div
                      key={image.productImageId}
                      className={`thumbnail-slide ${activeSlide === index ? 'active' : ''}`}
                    >
                      <img
                        src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                        alt={product.name}
                        style={{ width: "100px", height: "100px", cursor: "pointer" }}
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
              <h1>{product.name}</h1>
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
                  <p>Rs. {product.price}</p>
                </div>
                <div className="title">
                  <Tooltip 
                    title={product.color} 
                    overlayInnerStyle={{ backgroundColor: 'white', color: '#fa422d' }}
                    color="white"
                  >
                    <div className="color-block" style={{ backgroundColor: product.color }}></div>
                  </Tooltip>
                </div>
                <div className="title">
                  <p>{product.brand.name}</p>
                </div>
                <div className="title">
                  <p>{product.category.name}</p>
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
            <div className="title-content-button">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <p>ADD TO CART</p>
              </button>
            </div>
          </div>
        </div>
        <div className="desc-container-product-details">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
