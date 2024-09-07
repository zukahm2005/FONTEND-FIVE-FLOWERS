import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../../header/components/cart/cartContext/CartProvider";
import "./collectionGrid.scss";

const CollectionGrid = ({ displayType, products }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // State to control Dialog open/close
  const [selectedDescription, setSelectedDescription] = useState(""); // State to store selected product description

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    await addToCart(product, 1);
  };

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleOpenDialog = (description) => {
    setSelectedDescription(description);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const productsWithCalculatedPrice = products.map((product) => ({
    ...product,
    originalPrice: product.price * 2,
  }));

  return (
    <div className={`collection-grid ${displayType}`}>
      {productsWithCalculatedPrice.length === 0 ? (
        <div className="no-products">
          <p>No product in stock!</p>
        </div>
      ) : (
        productsWithCalculatedPrice.map((product) => (
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
                <div className="name-product-info">
                  <p>{product.name}</p>
                </div>
                <div className="price">
                  <span className="current-price">${product.price}</span>
                  <span className="original-price">
                    ${product.originalPrice}
                  </span>
                </div>
                {product.quantity === 0 && (
                  <span className="out-of-stock">
                    <p>Out of Stock</p>
                  </span>
                )}

                {/* Updated Read More logic */}
                {displayType === 'list' && (
                  <div className="description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${product.description.substring(0, 200)}...`
                      }}
                    />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(product.description);
                      }}
                      style={{ color: "rgb(250, 93, 50)", textDecoration: "underline", cursor: "pointer" }}
                    >
                      Read more
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ))
      )}

      {/* Dialog to display full product description */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          Product Description
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionGrid;
