import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./orderListAdminDetails.scss";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    console.log('Order ID from URL params:', id); // Debug log
    if (!id) {
      console.error("Order ID is undefined");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching order details for ID:", id);
        const response = await axios.get(`http://localhost:8080/api/v1/orders/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Order data:", response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="order-list-details-admin-container">
      <h1>Chi tiết đơn hàng</h1>
      <p>ID đơn hàng: {order.orderId}</p>
      <p>Người đặt: {order.user ? order.user.userName : "null"}</p>
      <p>Email: {order.user ? order.user.email : "null"}</p>
      <p>Tổng giá: {order.price}</p>
      <p>Ngày tạo: {order.createdAt}</p>
      <p>Ngày cập nhật: {order.updatedAt}</p>
      <h2>Sản phẩm</h2>
      <ul>
        {order.orderDetails.length > 0 ? order.orderDetails.map((detail) => (
          <li key={detail.orderDetailId}>
            <h3>{detail.product ? detail.product.name : "null"}</h3>
            <p>Số lượng: {detail.quantity}</p>
            <p>Giá: {detail.price}</p>
            <p>Trạng thái: {detail.status}</p>
            <h4>Thông tin sản phẩm</h4>
            <p>Mô tả: {detail.product ? detail.product.description : "null"}</p>
            <p>Màu sắc: {detail.product ? detail.product.color : "null"}</p>
            <p>Giá sản phẩm: {detail.product ? detail.product.price : "null"}</p>
            <p>Số lượng còn lại: {detail.product ? detail.product.quantity : "null"}</p>
            <h5>Hình ảnh sản phẩm:</h5>
            <div className="product-images">
              {detail.product && detail.product.productImages ? detail.product.productImages.map((image) => (
                <img
                  key={image.productImageId}
                  src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                  alt={detail.product.name}
                  className="product-image"
                />
              )) : "null"}
            </div>
            <h4>Thông tin thương hiệu</h4>
            <p>Thương hiệu: {detail.product && detail.product.brand ? detail.product.brand.name : "null"}</p>
            <p>Mô tả thương hiệu: {detail.product && detail.product.brand ? detail.product.brand.description : "null"}</p>
            <h4>Thông tin danh mục</h4>
            <p>Danh mục: {detail.product && detail.product.category ? detail.product.category.name : "null"}</p>
            <p>Mô tả danh mục: {detail.product && detail.product.category ? detail.product.category.description : "null"}</p>
          </li>
        )) : "Không có sản phẩm nào trong đơn hàng"}
      </ul>
    </div>
  );
};

export default OrderDetails;
