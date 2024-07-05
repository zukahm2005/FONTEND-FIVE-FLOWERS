import React from "react";
import { useLocation } from "react-router-dom";
import "./checkOut.scss";

const CheckOut = () => {
  const location = useLocation();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  return (
    <div className="checkout-big-container">
      <div className="checkout-address-container">
        <div className="info-address-container">
          <div className="title-address">
            <p>Delivery</p>
          </div>
          <div className="input-country-address">
            <input type="text" name="" id="" />
          </div>
          <div className="input-name-address">
            <div className="input-fn-address">
              <input type="text" name="" id="" placeholder="First name" />
            </div>
            <div className="input-ln-address">
              <input type="text" name="" id="" placeholder="last name" />
            </div>
          </div>
          <div className="input-address-address">
            <input type="text" name="" id="" placeholder="Address" />
          </div>

        
          <p>Address: 123 Main St, City, State, Zip</p>
        </div>
      </div>
      <div className="info-order-container">
        <div className="checkout-details">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} className="checkout-item">
                <div className="info-details-checkout">
                  <div className="image-checkout-container">
                    <div className="item-image">
                      {item.productImages[0]?.imageUrl && (
                        <img
                          src={`http://localhost:8080/api/v1/images/${item.productImages[0].imageUrl}`}
                          alt={item.name}
                        />
                      )}{" "}
                      <div className="quantity-item-checkout">
                        <p>{item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <div className="name-item-details">
                      <p>{item.name}</p>
                    </div>
                    <div className="title-item-details">
                      <p>
                        {item.category.name} / {item.brand.name}
                      </p>
                    </div>
                  </div>{" "}
                </div>

                <div className="total-price">
                  <p>₹</p>
                  <p> {item.price * item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items in cart</p>
          )}
          <div className="total-price-check-out">
            <p>Total</p>
            <p>₹{totalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
