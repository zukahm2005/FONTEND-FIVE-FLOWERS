import axios from 'axios';
import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CartContext } from '../../../../header/components/cart/cartContext/CartProvider';
import "./recomProduct.scss";

const RecommentProduct = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, isLoggedIn } = useContext(CartContext);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust this according to where you store your token
        const response = await axios.get('http://localhost:8080/api/v1/products/all', {
          params: { page: 0, size: 10 },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const productsWithDefaultPrice = response.data.content.map(product => ({
          ...product,
          originalPrice: product.originalPrice || 1000.00
        }));
        setProducts(productsWithDefaultPrice);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    addToCart(product, 1);
  };

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;

    if (!swiperInstance) return;

    const handleMouseEnter = () => {
      if (swiperInstance.autoplay && swiperInstance.autoplay.stop) {
        swiperInstance.autoplay.stop();
      }
    };

    const handleMouseLeave = () => {
      if (swiperInstance.autoplay && swiperInstance.autoplay.start) {
        swiperInstance.autoplay.start();
      }
    };

    swiperInstance.el.addEventListener('mouseenter', handleMouseEnter);
    swiperInstance.el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (swiperInstance.el) {
        swiperInstance.el.removeEventListener('mouseenter', handleMouseEnter);
        swiperInstance.el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const shouldLoop = products.length > 3; // Adjust this value based on your slidesPerView

  return (
    <div className="recommend-product-container">
      <div className="recommend-product-title-main">
        <div className="recommend-product-title">
          <h1>Recommended Products</h1>
        </div>
      </div>

      <div className="recommend-product-content">
        <Swiper
          ref={swiperRef}
          spaceBetween={30}
          slidesPerView={3}
          loop={shouldLoop}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{ 
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            990: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.productId}>
              <motion.div
                className="product-card"
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={{
                  hover: { scale: 1.02 },
                  rest: { scale: 1 },
                }}
              >
                <motion.div className="image-container" onClick={() => handleNavigateToProductDetails(product.productId)}>
                  {product.productImages && product.productImages[0] && (
                    <div className="image1-container">
                      <img
                        src={`http://localhost:8080/api/v1/images/${product.productImages[0].imageUrl}`}
                        alt={product.name}
                        className="main-image"
                      />
                      <span className="sale-badge">Sale</span>
                    </div>
                  )}
                  {product.productImages && product.productImages.length > 1 && (
                    <div className="image2-container">
                      <img
                        src={`http://localhost:8080/api/v1/images/${product.productImages[1].imageUrl}`}
                        alt={product.name}
                        className="hover-image"
                      />
                    </div>
                  )}

                  <motion.div
                    className="icon-slide-product-home"
                    variants={{
                      rest: { x: "100%", opacity: 0 },
                      hover: { x: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="icon-slide-product" onClick={(e) => handleAddToCart(e, product)}>
                      <IoCartOutline className="icon" />
                    </div>
                    <div className="icon-slide-product">
                      <IoIosSearch className="icon" />
                    </div>
                  </motion.div>
                </motion.div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="price">
                    <span className="current-price">
                      Rs. {product.price}
                    </span>
                    <span className="original-price">
                      Rs. {product.originalPrice}
                    </span>
                  </div>
                  {product.quantity === 0 && (
                    <span className="out-of-stock">
                      <p>Out of Stock</p>
                    </span>
                  )}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-container">
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default RecommentProduct;
