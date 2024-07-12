import { Button, Checkbox, Input, Modal, Select, Table, notification } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./addOrder.scss";

const { Option } = Select;

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "gold";
    case "Paid":
      return "green";
    case "Packaging":
      return "blue";
    case "Shipping":
      return "cyan";
    case "Delivered":
      return "lime";
    case "Cancelled":
      return "red";
    case "Refunded":
      return "purple";
    default:
      return "default";
  }
};

const StyledSelect = styled(Select)`
  width: 110px !important;
  .ant-select-selection-item {
    color: ${(props) => getStatusColor(props.status)} !important;
  }
`;

const AddOrder = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [address, setAddress] = useState({
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    phone: "",
    city: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/payments/all");
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleSearch = async (value, page = 1, pageSize = 5) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/search?query=${value}&page=${page - 1}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data.content);
      setPagination({ current: page, pageSize: pageSize, total: response.data.totalElements });
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleAddProduct = () => {
    if (selectedProducts.length > 0) {
      const newOrderDetails = selectedProducts.map((product) => ({
        orderDetailId: Date.now() + Math.random(),
        product: product,
        quantity: 1,
        price: product.price,
        status: "Pending",
      }));

      setOrderDetails([...orderDetails, ...newOrderDetails]);
      setIsModalVisible(false);
    }
  };

  const handleRemoveOrderDetail = (orderDetailId) => {
    setOrderDetails(orderDetails.filter((detail) => detail.orderDetailId !== orderDetailId));
  };

  const calculateTotalPrice = () => {
    return orderDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
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
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";
    if (!address.country) newErrors.country = "Country is required";
    if (!address.firstName) newErrors.firstName = "First name is required";
    if (!address.lastName) newErrors.lastName = "Last name is required";
    if (!address.address) newErrors.address = "Address is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.postalCode) newErrors.postalCode = "Postal code is required";
    if (!address.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(address.phone)) {
      newErrors.phone = "Phone number must be digits only";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrder = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Ensure 'userId' is correct from token

      const addressPayload = {
        country: address.country,
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        apartment: address.apartment,
        phone: address.phone,
        city: address.city,
        postalCode: address.postalCode,
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

      const orderPayload = {
        user: { id: userId },
        orderDetails: orderDetails.map((detail) => ({
          product: { productId: detail.product.productId },
          quantity: detail.quantity,
          price: detail.price,
          status: detail.status,
        })),
        address: { addressId: addressId },
        payment: { paymentId: parseInt(paymentMethod) },
        status: "Pending",
      };

      console.log("Order Payload:", orderPayload);

      const orderResponse = await axios.post(
        `http://localhost:8080/api/v1/orders/add`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Order created:", orderResponse.data);
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      notification.error({
        message: "Order Error",
        description: "Unable to place your order. Please try again.",
      });
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Brand",
      dataIndex: ["brand", "name"],
      key: "brand",
      render: (text) => text || "N/A",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => text || "N/A",
    },
    {
      title: "Image",
      dataIndex: ["productImages"],
      key: "productImages",
      render: (productImages) =>
        productImages && productImages.length > 0 ? (
          <img src={`http://localhost:8080/api/v1/images/${productImages[0]?.imageUrl}`} alt="Product" style={{ width: 50, height: 50 }} />
        ) : (
          <p>No Image</p>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts([...selectedProducts, record]);
            } else {
              setSelectedProducts(selectedProducts.filter((product) => product.productId !== record.productId));
            }
          }}
        />
      ),
    },
  ];

  return (
    <div className="add-order-container">
      <div className="arrow-id-order">
        <div className="arrow-order" onClick={() => navigate(-1)}>
          <p>
            <FaArrowLeft />
          </p>
        </div>
        <div className="id-order">
          <p>Add Order</p>
        </div>
      </div>

      <div className="info-add-order-container">
        <div className="search-product-to-add-container">
          <div className="title-add-product">
            <p>Add product</p>
          </div>
          <div className="input-add-product">
            <Input.Search
              placeholder="Search product to add"
              onSearch={(value) => handleSearch(value, pagination.current, pagination.pageSize)}
              enterButton
            />
          </div>
        </div>
        {orderDetails.map((detail) => (
          <div key={detail.orderDetailId} className="add-product">
            <div className="product-info">
              <div className="image-ordtails">
                {detail.product.productImages && detail.product.productImages.length > 0 ? (
                  <img
                    src={`http://localhost:8080/api/v1/images/${detail.product.productImages[0]?.imageUrl}`}
                    alt={detail.product.name}
                    className="product-image"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <div className="product-details">
                <div className="name-info-ordetails">
                  <h3>{detail.product.name}</h3>
                </div>
                <div className="color-info-ordtails">
                  <p>Color: {detail.product.color || "N/A"}</p>
                </div>
                <div className="category-brand-info-ordetails">
                  <p>
                    {detail.product.brand ? detail.product.brand.name : "N/A"} /{" "}
                    {detail.product.category
                      ? detail.product.category.name
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="price-info-ordtails">
                <p>
                  ₹{detail.price} x {detail.quantity}
                </p>
              </div>
              <div className="product-price">
                <p>₹{detail.price * detail.quantity}</p>
              </div>
              <div className="remove-detail">
                <div onClick={() => handleRemoveOrderDetail(detail.orderDetailId)}>
                  <p>X</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="total-price-ordtails">
          <div className="price-title">
            <h3>Total Price</h3>
          </div>
          <div className="price-title">
            <h3> ₹{calculateTotalPrice()}</h3>
          </div>
        </div>

        <div className="address-info-container">
          <h3>Address Information</h3>
          <div className="input-group">
            <Input
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleInputChange}
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </div>
          <div className="input-group">
            <Input
              name="firstName"
              placeholder="First Name"
              value={address.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>
          <div className="input-group">
            <Input
              name="lastName"
              placeholder="Last Name"
              value={address.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>
          <div className="input-group">
            <Input
              name="address"
              placeholder="Address"
              value={address.address}
              onChange={handleInputChange}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          <div className="input-group">
            <Input
              name="apartment"
              placeholder="Apartment/Suite, etc."
              value={address.apartment}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <Input
              name="phone"
              placeholder="Phone"
              value={address.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
          <div className="input-group">
            <Input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleInputChange}
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>
          <div className="input-group">
            <Input
              name="postalCode"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={handleInputChange}
            />
            {errors.postalCode && <p className="error">{errors.postalCode}</p>}
          </div>
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
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              {paymentMethods.map((method) => (
                <option key={method.paymentId} value={method.paymentId}>
                  {method.paymentMethod}
                </option>
              ))}
            </select>
            {errors.paymentMethod && <p className="error">{errors.paymentMethod}</p>}
          </div>
        </div>

        <Button type="primary" onClick={handleCreateOrder}>
          Create Order
        </Button>
      </div>

      <Modal
        title="Select Product"
        visible={isModalVisible}
        onOk={handleAddProduct}
        onCancel={() => setIsModalVisible(false)}
      >
        <Table
          dataSource={searchResults}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => handleSearch(searchProduct, page, pageSize),
          }}
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

export default AddOrder;
