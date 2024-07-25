import { notification } from "antd";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [distinctProductCount, setDistinctProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      syncCartFromServer().then(() => setIsLoading(false));
    } else {
      fetchCartItems();
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tính toán lại Subtotal và Total Price khi cart thay đổi
    const newSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotalPrice(newSubtotal + shippingCost);
  }, [cart]);

  // Đồng bộ hóa giỏ hàng từ localStorage lên server
  useEffect(() => {
    const syncCartToServerOnReload = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await syncCartWithServer();
        await syncCartFromServer();
      }
    };

    window.addEventListener("beforeunload", syncCartToServerOnReload);

    return () => {
      window.removeEventListener("beforeunload", syncCartToServerOnReload);
    };
  }, []);

  const fetchCartItems = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      updateCartStateAndLocalStorage(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const fetchCartFromServer = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Failed to fetch cart from server:", error);
      }
    }
    return [];
  };

  const syncCartFromServer = async () => {
    const serverCartItems = await fetchCartFromServer();
    updateCartStateAndLocalStorage(serverCartItems);
  };

  const updateCartStateAndLocalStorage = (cartItems) => {
    const updatedCartItems = cartItems.map(item => ({
      ...item,
      totalPrice: item.price * item.quantity
    }));
    setCart(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setTotalPrice(calculateTotalPrice(updatedCartItems));
    setDistinctProductCount(updatedCartItems.length);
    setSubtotal(calculateSubtotal(updatedCartItems));
  };

  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateSubtotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const saveCartItems = (cartItems) => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCart(cartItems);
    setTotalPrice(calculateTotalPrice(cartItems));
    setDistinctProductCount(cartItems.length);
    setSubtotal(calculateSubtotal(cartItems));
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const login = async (token) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    await syncCartFromServer();
  };

  const logout = async () => {
    await syncCartWithServer();
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    setIsLoggedIn(false);
    setCart([]);
    setTotalPrice(0);
    setDistinctProductCount(0);
    setSubtotal(0);
  };

  const syncCartWithServer = async () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(
          "http://localhost:8080/api/v1/cart/sync",
          cartItems,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Failed to sync cart with server:", error);
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
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

      if (availableQuantity === 0) {
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
            imageUrl: response.data.productImages.length > 0 ? response.data.productImages[0].imageUrl : null,
            totalPrice: quantity * product.price,
            name: product.name,
            brand: response.data.brand?.name,
            category: response.data.category?.name,
            price: product.price
          });
        } else {
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
      const decodedToken = parseJwt(token);
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

      await axios.delete("http://localhost:8080/api/v1/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        message: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      saveCartItems([]);
      setTotalPrice(0);
      setDistinctProductCount(0);
      setSubtotal(0);
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

  const fetchProductDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/products/get/${id}`);
      setProductDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

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
        fetchProductDetails,
        productDetails,
        logout,
        login,
        isLoading,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
