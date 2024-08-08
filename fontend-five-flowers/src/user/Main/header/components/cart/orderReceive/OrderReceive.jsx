import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./orderReceive.scss";

const OrderReceive = () => {
  const location = useLocation();
  const { order } = location.state || {};
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/v1/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEmail(response.data.email);
        } catch (error) {
          console.error("Error fetching user email:", error);
        }
      }
    };

    fetchUserEmail();

    const isPageReloaded = sessionStorage.getItem("isPageReloaded");
    if (!isPageReloaded) {
      sessionStorage.setItem("isPageReloaded", "true");
      window.location.reload();
    }
  }, []);

  if (!order) {
    return <div>Order not found</div>;
  }

  console.log("Order details:", order);

  return (
    <div className="order-receive-container">
      <div className="site-content">
        <div className="order-receive-header-container">
          <div className="home-or-header">
            <Link to="/">
              <p>Home </p>
            </Link>
          </div>
          <span> / </span>
          <div className="check-out-or-header">
            <p> Order received</p>
          </div>
        </div>
        <div className="checkout-or-header-container">
          <div className="title-checkout-header-container">
            <div className="checkout-or-header">
              <p>Order details</p>
            </div>{" "}
            <div className="title-or-header">
              <p>Thank you. Your order has been received.</p>
            </div>
          </div>
          <div className="info-details-user-checkout-container">
            <div className="customer-name-container-checkout">
              <div className="customer-name-bill">
                <p>Customer name</p>
              </div>
              <div className="info-customer-name">
                <p>{order.user?.name || "N/A"}</p>
              </div>

              <div className="info-email">
                <p>{email || "Email not provided"}</p>
              </div>
            </div>
            <div className="address-bill-container">
              <div className="address-bill">
                <p>Shipping address</p>
              </div>
              <div className="info-address-bill">
                <p>{order.user?.address || "N/A"}</p>
              </div>
              <div className="info-phone">
                <p>{order.user?.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="woocommerce-order-overview">
          <div className="woocommerce-order-overview__order order">
            <p>ORDER NUMBER:</p>
            <p>{order.orderId}</p>
          </div>
          <div className="woocommerce-order-overview__date order">
            <p>DATE:</p>
            <p>{order.orderDate}</p>
          </div>
          <div className="woocommerce-order-overview__total order">
            <p>TOTAL:</p>
            <p>${order.total}</p>
          </div>
          <div className="woocommerce-order-overview__payment-method order">
            <p>PAYMENT METHOD:</p>
            <p>{order.paymentMethod}</p>
          </div>
        </div>
        <div className="info-receive-container">
          <div className="info-details-receive-container">
            <div className="product-name-total">
              <div className="product-name">
                <p>Product</p>
              </div>
              <div className="product-total">
                <p>Total</p>
              </div>
            </div>
            <div className="woocomerce-table-container">
              {order.orderDetails.map((detail, index) => (
                <div key={index} className="woocommerce-table__product-name">
                  <div className="info-product-receive">
                    <div className="name-pro-receive">
                      <p>
                        {detail.product.name} x {detail.quantity}
                      </p>
                    </div>
                    <div className="color-pro-receive">
                      <p>Color: {detail.product.color || "N/A"}</p>
                    </div>
                    <div className="brand-category-pro-receive">
                      <p>
                        {detail.product.brand} / {detail.product.category}
                      </p>
                    </div>
                  </div>
                  <div className="total-each-order-receive">
                    <p>${detail.total}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-price-check-out">
              <div className="container-title-price-check-out">
                <div className="title-checkout">
                  <p>Subtotal</p>
                </div>
                <div className="title-checkout">
                  <p>Shipping</p>
                </div>

                <div className="total-price-check-out">
                  <p>Total</p>
                </div>
              </div>
              <div className="container-price-check-out">
                <div className="sub-price-shopping-check-out">
                  <p>${order.subtotal}</p>
                </div>
                <div className="sub-price-shopping-check-out">
                  <p>${order.shippingCost}</p>
                </div>
                <div className="total-money-shopping-check-out">
                  <p>${order.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceive;