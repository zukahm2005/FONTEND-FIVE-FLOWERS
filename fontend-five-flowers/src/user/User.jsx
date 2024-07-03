import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Error from "../error/Error";
import Footer from "./Main/footer/Footer";
import Header from "./Main/header/Header";
import CartProvider from "./Main/header/components/cart/cartContext/CartProvider";
import ShoppingCart from "./Main/header/components/cart/shoppingCart/ShoppingCart";
import Profile from "./Main/header/components/profile/Profile";
import AboutUs from "./Main/pages/aboutUs/AboutUs";
import Home from "./Main/pages/home/Home";
import BlogDetail from "./Main/pages/news/Blog/BlogDetail";
import News from "./Main/pages/news/News";
import Shop from "./Main/pages/shop/Shop";
import ProductDetail from "./Main/pages/shop/productDetails/ProductDetails";
import "./user.scss";

const User = () => {
  const [cart, setCart] = useState([]);

  return (
    <CartProvider>
      <div className="user-container">
        <Header cart={cart} setCart={setCart} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/home"
              element={<Home setCart={setCart} cart={cart} />}
            />
            <Route path="/news" element={<News />} />
            <Route path="/news/:blogId" element={<BlogDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shopping-cart" element={<ShoppingCart/>}/>
            <Route path="*" element={<Error/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default User;
