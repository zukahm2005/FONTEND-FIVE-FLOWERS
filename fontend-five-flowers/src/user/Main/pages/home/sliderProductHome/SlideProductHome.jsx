import axios from 'axios';
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./slideProductHome.scss";

const SlideProductHome = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/products/all', {
      params: { page: 0, size: 10 }
    })
      .then(response => {
        const productsWithDefaultPrice = response.data.content.map(product => ({
          ...product,
          originalPrice: product.originalPrice || 1000.00
        }));
        setProducts(productsWithDefaultPrice);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="slide-product-home-container">
      <div className="slide-product-home-title-main">
        <div className="slide-product-title">
          <h1>Let's Go Shopping</h1>
        </div>
      </div>

      <div className="slide-product-home-content">
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation]}
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
                  hover: { scale: 1.05 },
                  rest: { scale: 1 },
                }}
              >
                <motion.div className="image-container">
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
                    <div className="icon-slide-product">
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

export default SlideProductHome;
