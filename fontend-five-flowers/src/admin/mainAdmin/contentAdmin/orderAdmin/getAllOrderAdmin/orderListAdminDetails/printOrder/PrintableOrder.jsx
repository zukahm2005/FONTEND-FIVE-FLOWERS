import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import "./printableOrder.scss";

const PrintableOrder = ({
  order,
  email,
  orderDate,
  total,
  subtotal,
  paymentMethod,
}) => {
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const qrRef = useRef();

  // Kiểm tra và lấy thông tin khách hàng từ order
  const firstName = order?.address?.firstName || "First Name";
  const lastName = order?.address?.lastName || "Last Name";

  // In ra đối tượng order để kiểm tra
  console.log('Order Object:', order);

  // Tạo chuỗi thông tin khách hàng để mã hóa QR
  const qrValue = `Order ID: ${order.orderId}
Email: ${email}
Order Date: ${orderDate}
Total: $${total}
Customer Name: ${firstName} ${lastName}
Shipping Address: ${order.address.address}, ${order.address.city}, ${order.address.postalCode}
Phone: ${order.address.phone}
Payment Method: ${paymentMethod}`;

  useEffect(() => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const imgUrl = canvas.toDataURL();
        setQrImageUrl(imgUrl);
      }
    }
  }, [qrValue]);

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="order-receive-container" id="printable-order">
      <div className="site-content1">
        <div className="checkout-or-header-container">
          <div className="title-checkout-header-container">
            <div className="checkout-or-header">
              <p>Order details</p>
            </div>
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
                <p>{firstName} {lastName}</p> {/* Show first name and last name */}
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
                <p>{`${order.address.address}, ${order.address.city}, ${order.address.postalCode}`}</p>
              </div>
              <div className="info-phone">
                <p>{order.address.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="woocommerce-order-overview">
          <div className="woocommerce-order-overview__order order">
            <p>ORDER NUMBER:</p>
            <p>{order.orderId || "N/A"}</p>
          </div>
          <div className="woocommerce-order-overview__date order">
            <p>DATE:</p>
            <p>{orderDate || "N/A"}</p>
          </div>
          <div className="woocommerce-order-overview__total order">
            <p>TOTAL:</p>
            <p>${total || "N/A"}</p>
          </div>
          <div className="woocommerce-order-overview__payment-method order">
            <p>PAYMENT METHOD:</p>
            <p>{paymentMethod || "N/A"}</p>
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
                        {detail.product.brand?.name || "N/A"} /{" "}
                        {detail.product.category?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="total-each-order-receive">
                    <p>${detail.price * detail.quantity}</p>
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
                  <p>${subtotal || "N/A"}</p>
                </div>
                <div className="sub-price-shopping-check-out">
                  <p>${order.shippingCost || "N/A"}</p>
                </div>
                <div className="total-money-shopping-check-out">
                  <p>${total || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="qr-code-container" ref={qrRef}>
          {qrImageUrl ? (
            <img src={qrImageUrl} alt="QR Code" />
          ) : (
            <QRCode value={qrValue} size={150} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintableOrder;
