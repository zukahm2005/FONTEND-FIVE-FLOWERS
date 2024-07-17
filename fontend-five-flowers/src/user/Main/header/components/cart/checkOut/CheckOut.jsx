import { notification } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../cartContext/CartProvider";
import "./checkOut.scss";

const CheckOut = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, setCart } = useContext(CartContext);

  const [formFields, setFormFields] = useState({
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    phone: "",
    city: "",
    postalCode: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [sandboxMode, setSandboxMode] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/payments/all");
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy phương thức thanh toán:", error);
      }
    };

    const fetchSandboxStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/payments/sandbox-status");
        setSandboxMode(response.data);
      } catch (error) {
        console.error('Error fetching sandbox status:', error);
      }
    };

    fetchPaymentMethods();
    fetchSandboxStatus();
  }, []);

  useEffect(() => {
    if (formFields.paymentMethod === "paypal") {
      const paypalScript = document.createElement("script");
      paypalScript.src = sandboxMode 
        ? "https://www.paypal.com/sdk/js?client-id=ASoIba-pexbxQxYyFoU_YXosUuJm7ScuwQiYZOMnDYStlMgVN0WmPTPcMHyg3vWRmEJlbc00aCkfl2Io"
        : "https://www.paypal.com/sdk/js?client-id=AZI9cbp3UpTTl8BOM50Z3MXh9OqeE9sKNKdw2Ekj-e2gyaO9I2Cemn6iyxW6a2jX-uydpWUtw79Uzn1_";
      paypalScript.addEventListener("load", () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice.toString()
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              handleOrderCreation(true);
            });
          },
          onError: (err) => {
            console.error("Lỗi PayPal Checkout: ", err);
            notification.error({
              message: "Lỗi Thanh Toán",
              description: "Có lỗi xảy ra trong quá trình thanh toán bằng PayPal."
            });
          }
        }).render("#paypal-button-container");
      });
      document.body.appendChild(paypalScript);
    }
  }, [formFields.paymentMethod, sandboxMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formFields.country) newErrors.country = "Country is required";
    if (!formFields.firstName) newErrors.firstName = "First name is required";
    if (!formFields.lastName) newErrors.lastName = "Last name is required";
    if (!formFields.address) newErrors.address = "Address is required";
    if (!formFields.city) newErrors.city = "City is required";
    if (!formFields.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formFields.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formFields.phone)) {
      newErrors.phone = "Phone number must be digits only";
    }
    if (!formFields.paymentMethod) newErrors.paymentMethod = "Payment method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderCreation = async (paypalApproved = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Login Required",
        description: "Please log in to proceed with checkout.",
      });
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const selectedPaymentMethod = paymentMethods.find(
        (method) => method.paymentId === parseInt(formFields.paymentMethod)
      );

      if (!selectedPaymentMethod && !paypalApproved) {
        notification.error({
          message: "Payment Error",
          description: "Selected payment method is invalid.",
        });
        return;
      }

      const addressPayload = {
        country: formFields.country,
        firstName: formFields.firstName,
        lastName: formFields.lastName,
        address: formFields.address,
        apartment: formFields.apartment,
        phone: formFields.phone,
        city: formFields.city,
        postalCode: formFields.postalCode,
        user: { id: userId },
      };

      const addressResponse = await axios.post(
        "http://localhost:8080/api/v1/addresses/add",
        addressPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addressId = addressResponse.data.addressId;

      const orderDetails = cart.map((product) => ({
        product: { productId: product.productId },
        quantity: product.quantity,
        price: product.price,
      }));

      const orderPayload = {
        user: { id: userId },
        orderDetails: orderDetails,
        address: { addressId: addressId },
        payment: paypalApproved ? { paymentMethod: "PayPal" } : { paymentId: formFields.paymentMethod },
        status: paypalApproved ? "Paid" : "Pending",
      };

      const orderResponse = await axios.post(
        "http://localhost:8080/api/v1/orders/add",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await Promise.all(
        cart.map((product) =>
          axios.put(
            `http://localhost:8080/api/v1/products/reduceQuantity/${product.productId}`,
            null,
            {
              params: { quantity: product.quantity },
            }
          )
        )
      );

      const orderData = {
        orderId: orderResponse.data.orderId,
        orderDate: new Date().toLocaleDateString(),
        total: totalPrice,
        paymentMethod: paypalApproved ? "PayPal" : selectedPaymentMethod.paymentMethod,
        orderDetails: orderResponse.data.orderDetails,
      };

      notification.success({
        message: "Order Placed",
        description: "Your order has been placed successfully!",
      });

      setCart([]);
      navigate("/order-receive", { state: { order: orderData } });
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: "Order Error",
        description: "Unable to place your order. Please try again.",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (formFields.paymentMethod === "paypal") {
        // PayPal button will handle the order creation
      } else {
        handleOrderCreation();
      }
    }
  };

  return (
    <div className="container">
      <div className="top-shopping-container">
        <div className="name-top-shopping-container">
          <h1>YOUR CHECK OUT</h1>
        </div>
        <div className="name-bottom-shopping-container">
          <div className="home-name-bsc">
            <Link to="/">
              <p>Home</p>
            </Link>
          </div>
          <span className="breadcrumb__sep">
            <p>/</p>
          </span>
          <p>Your Check Out</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="checkout-big-container">
          <div className="checkout-address-container">
            <div className="info-address-container">
              <div className="title-address">
                <p>Delivery</p>
              </div>
              <div className="input-country-address">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formFields.country}
                  onChange={handleInputChange}
                />
                {errors.country && <p className="error">{errors.country}</p>}
              </div>
              <div className="input-name-address">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formFields.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && <p className="error">{errors.firstName}</p>}
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formFields.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}
              </div>
              <div className="input-country-address">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formFields.address}
                  onChange={handleInputChange}
                />
                {errors.address && <p className="error">{errors.address}</p>}
              </div>
              <div className="apartment-phone-address">
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment/Suite, etc."
                  value={formFields.apartment}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formFields.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
              <div className="input-city-code-address">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formFields.city}
                  onChange={handleInputChange}
                />
                {errors.city && <p className="error">{errors.city}</p>}
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formFields.postalCode}
                  onChange={handleInputChange}
                />
                {errors.postalCode && <p className="error">{errors.postalCode}</p>}
              </div>
              <div className="payment-method-container">
                <div className="title-payment">
                  <p>Payment</p>
                </div>
                <div className="all-transactions">
                  <p>All transactions are secure and encrypted.</p>
                </div>
                <div className="info-payment">
                  <select
                    name="paymentMethod"
                    value={formFields.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Payment Method</option>
                    {paymentMethods.map((method) => (
                      <option key={method.paymentId} value={method.paymentId}>
                        {method.paymentMethod}
                      </option>
                    ))}
                    <option value="paypal">PayPal</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="error">{errors.paymentMethod}</p>
                  )}
                </div>
                {formFields.paymentMethod === "paypal" ? (
                  <div id="paypal-button-container" className="paypal-button-container"></div>
                ) : (
                  <div className="order-now">
                    <button type="submit">
                      <p>ORDER NOW</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="info-order-container">
            <div className="checkout-details">
              {cart.map((item, index) => (
                <div key={index} className="checkout-item">
                  <div className="info-details-checkout">
                    <div className="image-checkout-container">
                      <div className="item-image">
                        <img
                          src={`http://localhost:8080/api/v1/images/${item.productImages[0].imageUrl}`}
                          alt={item.name}
                        />
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
                        <p>{item.category.name} / {item.brand.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="total-price">
                    <p>₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="total-price-check-out">
                <p>Total</p>
                <p>₹{totalPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;
