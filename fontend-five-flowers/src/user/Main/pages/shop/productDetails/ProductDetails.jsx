import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../../header/components/cart/cartContext/CartProvider";
import "./productDetails.scss";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Thêm state để quản lý số lượng
  const { addToCart } = useContext(CartContext); // Sử dụng CartContext

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
              <span aria-hidden="true" class="breadcrumb__sep">
                /
              </span>

              <span> {product.name}</span>
            </div>
          </div>
        </div>
        <div className="shopify-section-template">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Color: {product.color}</p>
          <p>Brand: {product.brand.name}</p>
          <p>Category: {product.category.name}</p>
          <h2>Images</h2>
          <div>
            {product.productImages && product.productImages.length > 0 ? (
              product.productImages.map((image) => (
                <img
                  key={image.productImageId}
                  src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                  alt={product.name}
                  style={{ width: "100px", height: "100px" }}
                />
              ))
            ) : (
              <p>No Images Available</p>
            )}
          </div>
          <div>
            <button onClick={() => handleQuantityChange(quantity - 1)}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(quantity + 1)}>
              +
            </button>
          </div>
          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
