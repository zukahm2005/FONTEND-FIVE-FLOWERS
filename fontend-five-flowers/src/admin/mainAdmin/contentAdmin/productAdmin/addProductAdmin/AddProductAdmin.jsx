import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Modal, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import CustomCKEditor from "../../CKEditorComponent/CKEditorComponent";
import "./AddProductAdmin.scss";

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    color: "",
    brandId: "",
    categoryId: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/brands/all")
      .then((response) => setBrands(response.data.content))
      .catch((error) => console.error("Error fetching brands:", error));

    axios
      .get("http://localhost:8080/api/v1/categories/all")
      .then((response) => setCategories(response.data.content))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch existing images
    axios
      .get("http://localhost:8080/api/v1/product_images/all")
      .then((response) => {
        const images = response.data;
        setExistingImages(images);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    const plainText = data.replace(/<\/?[^>]+(>|$)/g, ""); // Loại bỏ thẻ HTML
    console.log('Description:', plainText);  // Thêm dòng log này để kiểm tra giá trị của description
    setProduct({ ...product, description: plainText });
  };

  const handleFileChange = (info) => {
    const fileList = info.fileList.map((file) => file.originFileObj);
    setImages(fileList);
  };

  const handleImageSelect = (image) => {
    setSelectedImages((prev) => {
      if (prev.includes(image)) {
        return prev.filter((img) => img !== image);
      } else {
        return [...prev, image];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting product:', product);  // Thêm dòng log này để kiểm tra giá trị của product

    try {
      const productResponse = await axios.post(
        "http://localhost:8080/api/v1/products/add",
        {
          name: product.name,
          description: product.description, // Đảm bảo mô tả được gửi đúng cách
          price: product.price,
          quantity: product.quantity,
          color: product.color,
          brand: {
            brandId: product.brandId,
          },
          category: {
            categoryId: product.categoryId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const productId = productResponse.data.productId;

      if (productId) {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
          formData.append("files", images[i]);
        }

        if (images.length > 0) {
          await axios.post(
            `http://localhost:8080/api/v1/products/add/images/${productId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        if (selectedImages.length > 0) {
          await axios.post(
            `http://localhost:8080/api/v1/products/add/existing-images/${productId}`,
            selectedImages,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
        }

        setMessage("Product and images added successfully");
      } else {
        setMessage("Product added but no images to upload");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to add product. Please try again.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-proadmin-container">
      <div className="layout-proadmin-container">
        <div className="header-proadmin-add-container">
          <Link to="/admin/product">
            <FaArrowLeft />
          </Link>
          <p>Add Product</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bottom-proadmin-add-container">
            <div className="left-proadmin-main">
              <div className="title-container-proadmin">
                <label htmlFor="">
                  <p>Title:</p>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="desc-container-proadmin">
                <label>
                  <p>Description</p>
                </label>
                <CustomCKEditor
                  data={product.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="info-proadmin-container">
                <div className="info-price-container">
                  <label>
                    <p>Price: </p>
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="info-quantity-container">
                  <label>
                    <p>Quantity: </p>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="info-color-container">
                  <label>
                    <p>Color: </p>
                  </label>
                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={product.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="media-image-container" onClick={showModal}>
                <label>
                  <p>Media: </p>
                </label>
                <div className="upload-image-container">
                  <p>Click to upload images</p>
                </div>
              </div>
              <div className="info-button-container">
                <button type="submit">
                  <p>Save</p>
                </button>
              </div>
            </div>
            <div className="right-proadmin-main">
              <select
                name="brandId"
                value={product.brandId}
                onChange={handleInputChange}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.brandId} value={brand.brandId}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {message && <p>{message}</p>}
        </form>
      </div>
      <Modal
        title="Upload or Select Images"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Upload
          listType="picture"
          multiple={true}
          beforeUpload={() => false} // Prevent automatic upload
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Select Images to Upload</Button>
        </Upload>
        <div className="existing-images">
          {existingImages.map((image, index) => (
            <div key={index}>
              <Checkbox
                checked={selectedImages.includes(image.imageUrl)}
                onChange={() => handleImageSelect(image.imageUrl)}
              >
                <img
                  src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                  alt="product"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </Checkbox>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AddProduct;
