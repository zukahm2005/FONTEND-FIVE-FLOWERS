import { motion } from "framer-motion";
import React, { useContext } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../../header/components/cart/cartContext/CartProvider";
import "./collectionGrid.scss";

const CollectionGrid = ({ displayType, products }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    await addToCart(product, 1);
  };

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className={`collection-grid ${displayType}`}>
      {products.length === 0 ? (
        <div className="no-products">
          <p>No product in stock!</p>
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.productId}
            className={`product-item ${displayType}-item`}
          >
            <motion.div
              className="product-card"
              whileHover="hover"
              initial="rest"
              animate="rest"
              onClick={() => handleNavigateToProductDetails(product.productId)}
            >
              <motion.div className="image-container">
                {product.productImages && product.productImages[0] && (
                  <div className="image1-container">
                    <img
                      src={`http://localhost:8080/api/v1/images/${product.productImages[0].imageUrl}`}
                      alt={product.productName}
                      className="main-image"
                    />
                    {product.isOnSale && (
                      <span className="sale-badge">Sale</span>
                    )}
                  </div>
                )}
                {product.productImages && product.productImages.length > 1 && (
                  <div className="image2-container">
                    <img
                      src={`http://localhost:8080/api/v1/images/${product.productImages[1].imageUrl}`}
                      alt={product.productName}
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
                  <div
                    className="icon-slide-product"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
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
                  <span className="current-price">Rs. {product.price}</span>
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
          </div>
        ))
      )}
    </div>
  );
};

export default CollectionGrid;
