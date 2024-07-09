import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./orderReceive.scss";

const OrderReceive = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="order-receive-container">
      <div className="site-content">
        <div className="order-receive-header-container">
          <div className="home-or-header">
            <Link>
              <p>Home </p>
            </Link>
          </div>
          <span> / </span>
          <div className="check-out-or-header">
            <p> Order received</p>
          </div>
        </div>
        <div className="checkout-or-header">
          <p>Checkout</p>
        </div>
        <div className="title-or-header">
          <p>Thank you. Your order has been received.</p>
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
            <p>₹{order.total}</p>
          </div>
          <div className="woocommerce-order-overview__payment-method order">
            <p>PAYMENT METHOD:</p>
            <p>{order.paymentMethod}</p>
          </div>
        </div>
        <div className="info-receive-container">
          <div className="title-info">
            <p>Order details</p>
          </div>
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
                      <p>Color: {detail.product.color}</p>
                    </div>
                    <div className="brand-category-pro-receive">
                      <p>
                        {detail.product.brand.name} /
                        {detail.product.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="total-each-order-receive">
                    <p>₹{detail.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-or-container">
              <div className="total-or">
                <p>Total</p>
              </div>
              <div className="price-total-or">
                <p>₹{order.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceive;