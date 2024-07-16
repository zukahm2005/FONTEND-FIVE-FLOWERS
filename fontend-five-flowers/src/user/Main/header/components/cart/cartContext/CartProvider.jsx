import { notification } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct named import
import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCartItems();
    }
  }, []);

  const fetchCartItems = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCart(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/products/get/${id}`);
      setProductDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  const saveCartItems = (cartItems) => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCart(cartItems);
  };

  const login = async (token) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    fetchCartItems();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    setIsLoggedIn(false);
    setCart([]);
  };

  const addToCart = async (product, quantity = 1) => {
    console.log("addToCart called with product:", product, "and quantity:", quantity);
  
    if (!isLoggedIn) {
      notification.error({
        message: "Login Required",
        description: "Please log in to add products to your cart.",
      });
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/products/get/${product.productId}`);
      const availableQuantity = response.data.quantity;
  
      console.log(`Available quantity for product ${product.productId}: ${availableQuantity}`);
  
      if (availableQuantity === 0) {
        console.log(`Product ${product.productId} is out of stock.`);
        notification.error({
          message: "Out of Stock",
          description: `${product.name} is out of stock.`,
        });
        return;
      }
  
      const newCart = [...cart];
      const productInCart = newCart.find(item => item.productId === product.productId);
      if (productInCart) {
        if (productInCart.quantity + quantity <= availableQuantity) {
          productInCart.quantity += quantity;
          productInCart.totalPrice = productInCart.quantity * productInCart.price;
        } else {
          console.log(`Only ${availableQuantity} items left in stock for product ${product.productId}.`);
          notification.error({
            message: "Out of Stock",
            description: `Only ${availableQuantity} items left in stock.`,
          });
          return;
        }
      } else {
        if (quantity <= availableQuantity) {
          newCart.push({
            ...product,
            quantity,
            totalPrice: quantity * product.price,
          });
        } else {
          console.log(`Only ${availableQuantity} items left in stock for product ${product.productId}.`);
          notification.error({
            message: "Out of Stock",
            description: `Only ${availableQuantity} items left in stock.`,
          });
          return;
        }
      }
  
      saveCartItems(newCart);
      notification.success({
        message: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      notification.error({
        message: "Error",
        description: "There was an error adding the product to the cart. Please try again.",
      });
    }
  };
  

  const updateQuantity = (productId, quantity) => {
    const newCart = cart.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity, totalPrice: quantity * item.price };
      }
      return item;
    });
    saveCartItems(newCart);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Login Required",
        description: "Please log in to proceed with checkout.",
      });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const orderDetails = cart.map((product) => ({
        product: { productId: product.productId },
        quantity: product.quantity,
        price: product.price,
      }));

      const response = await axios.post(
        "http://localhost:8080/api/v1/orders/add",
        {
          user: { id: userId },
          orderDetails: orderDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product quantities in the database
      for (const product of cart) {
        await axios.put(
          `http://localhost:8080/api/v1/products/reduceQuantity/${product.productId}`,
          null,
          {
            params: {
              quantity: product.quantity,
            },
          }
        );
      }

      notification.success({
        message: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      saveCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: "Order Error",
        description: "Unable to place your order. Please try again.",
      });
    }
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    saveCartItems(newCart);
  };

  const totalPrice = cart.reduce(
    (total, product) => total + product.totalPrice,
    0
  );

  const distinctProductCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        handleCheckout,
        removeFromCart,
        isLoggedIn,
        setIsLoggedIn,
        setCart,
        totalPrice,
        distinctProductCount,
        logout,
        login,
        fetchProductDetails,
        productDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
