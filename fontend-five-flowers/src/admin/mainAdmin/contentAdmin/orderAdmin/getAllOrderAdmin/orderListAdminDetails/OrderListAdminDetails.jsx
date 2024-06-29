import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./orderListAdminDetails.scss";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching order details for ID:", id);
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Order data:", response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-list-details-admin-container">
      <h1>Order Details</h1>
      <p>Order ID: {order.orderId}</p>
      <p>Placed by: {order.user ? order.user.userName : "null"}</p>
      <p>Email: {order.user ? order.user.email : "null"}</p>
      <p>Total Price: {order.price}</p>
      <p>Created At: {order.createdAt}</p>
      <p>Updated At: {order.updatedAt}</p>
      <h2>Products</h2>
      <ul>
        {order.orderDetails.length > 0
          ? order.orderDetails.map((detail) => (
              <li key={detail.orderDetailId}>
                <h3>{detail.product ? detail.product.name : "null"}</h3>
                <p>Quantity: {detail.quantity}</p>
                <p>Price: {detail.price}</p>
                <p>Status: {detail.status}</p>
                <h4>Product Information</h4>
                <p>Description: {detail.product ? detail.product.description : "null"}</p>
                <p>Color: {detail.product ? detail.product.color : "null"}</p>
                <p>Product Price: {detail.product ? detail.product.price : "null"}</p>
                <p>Remaining Quantity: {detail.product ? detail.product.quantity : "null"}</p>
                <h5>Product Images:</h5>
                <div className="product-images">
                  {detail.product && detail.product.productImages
                    ? detail.product.productImages.map((image) => (
                        <img
                          key={image.productImageId}
                          src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                          alt={detail.product.name}
                          className="product-image"
                        />
                      ))
                    : "null"}
                </div>
                <h4>Brand Information</h4>
                <p>Brand: {detail.product && detail.product.brand ? detail.product.brand.name : "null"}</p>
                <p>Brand Description: {detail.product && detail.product.brand ? detail.product.brand.description : "null"}</p>
                <h4>Category Information</h4>
                <p>Category: {detail.product && detail.product.category ? detail.product.category.name : "null"}</p>
                <p>Category Description: {detail.product && detail.product.category ? detail.product.category.description : "null"}</p>
              </li>
            ))
          : "No products in the order"}
      </ul>
    </div>
  );
};

export default OrderDetails;
