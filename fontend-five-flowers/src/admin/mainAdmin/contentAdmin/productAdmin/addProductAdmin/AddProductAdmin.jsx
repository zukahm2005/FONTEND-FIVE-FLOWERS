import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Image,
  Modal,
  Pagination,
  Upload,
  message as antMessage,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomCKEditor from "../../CKEditorComponent/CKEditorComponent";
import "./AddProductAdmin.scss";

const AddProductAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [newImages, setNewImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const imagesPerPage = 20;

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/products/get/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          const productData = response.data;
          setProduct({
            name: productData.name || "",
            description: productData.description || "",
            price: productData.price || 0,
            quantity: productData.quantity || 0,
            color: productData.color || "",
            brandId: productData.brand?.brandId || "",
            categoryId: productData.category?.categoryId || "",
          });
          setSelectedImages(
            productData.productImages.map((img) => img.imageUrl)
          );
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse, imagesResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/v1/brands/all"),
            axios.get("http://localhost:8080/api/v1/categories/all"),
            axios.get("http://localhost:8080/api/v1/product_images/all"),
          ]);

        setBrands(brandsResponse.data.content);
        setCategories(categoriesResponse.data.content);
        setExistingImages(imagesResponse.data);
      } catch (error) {
        console.error("Error fetching brands, categories or images:", error);
      }
    };

    fetchProduct();
    fetchBrandsAndCategories();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    const plainText = data.replace(/<\/?[^>]+(>|$)/g, "");
    setProduct((prevState) => ({
      ...prevState,
      description: plainText,
    }));
  };

  const handleFileChange = (info) => {
    const fileList = info.fileList.map((file) => file.originFileObj);
    setNewImages(fileList);
  };

  const handleImageSelect = (image) => {
    setSelectedImages((prev) =>
      prev.includes(image) ? prev.filter((img) => img !== image) : [...prev, image]
    );
  };

  const handleRemoveImage = (imageUrl, e) => {
    e.stopPropagation();
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.filter((img) => img !== imageUrl)
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = "Product name is required";
    if (!product.description) newErrors.description = "Description is required";
    if (product.price <= 0) newErrors.price = "Price must be greater than 0";
    if (product.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!product.color) newErrors.color = "Color is required";
    if (!product.brandId) newErrors.brandId = "Brand is required";
    if (!product.categoryId) newErrors.categoryId = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      antMessage.error("Please correct the errors in the form");
      return;
    }

    try {
      let productResponse;
      let productId;

      console.log("Submitting product:", product);

      if (id) {
        productResponse = await axios.put(
          `http://localhost:8080/api/v1/products/update/${id}`,
          {
            ...product,
            brand: { brandId: product.brandId },
            category: { categoryId: product.categoryId },
            productImages: selectedImages.map((url) => ({ imageUrl: url })),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        productId = id;

        if (newImages.length > 0) {
          await uploadImages(productId);
        }

      } else {
        productResponse = await axios.post(
          "http://localhost:8080/api/v1/products/add",
          {
            ...product,
            brand: { brandId: product.brandId },
            category: { categoryId: product.categoryId },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        productId = productResponse.data.productId;

        console.log("Product created with ID:", productId);

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

        if (newImages.length > 0) {
          await uploadImages(productId);
        }
      }

      setMessage("Product and images added successfully");
      navigate("/admin/product");
    } catch (error) {
      console.error("Error in add/update product:", error);
      setMessage("Failed to add/update product. Please try again.");
    }
  };

  const uploadImages = async (productId) => {
    if (!productId) {
      throw new Error("Product ID is not defined for uploading images.");
    }

    const formData = new FormData();
    newImages.forEach((image) => formData.append("files", image));

    try {
      console.log("Uploading images for product ID:", productId);

      const uploadResponse = await axios.post(
        `http://localhost:8080/api/v1/products/add/images/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newImageUrls = uploadResponse.data.productImages.map(
        (img) => img.imageUrl
      );
      setSelectedImages((prevSelectedImages) => [
        ...prevSelectedImages,
        ...newImageUrls,
      ]);
    } catch (error) {
      console.error("Error uploading images:", error);
      antMessage.error("Failed to upload images. Please try again.");
    }
  };

  const showModal = () => setIsModalVisible(true);

  const handleOk = async () => {
    setSelectedImages((prevSelectedImages) => [
      ...prevSelectedImages,
      ...newImages.map((file) => URL.createObjectURL(file)),
    ]);
    setNewImages([]);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setNewImages([]);
    setIsModalVisible(false);
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = existingImages.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="add-proadmin-container">
      <div className="layout-proadmin-container">
        <div className="header-proadmin-add-container">
          <Link to="/admin/product">
            <FaArrowLeft />
          </Link>
          <p>{id ? "Edit Product" : "Add Product"}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bottom-proadmin-add-container">
            <div className="left-proadmin-main">
              <div className="title-container-proadmin">
                <label>
                  <p>Title:</p>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleInputChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="desc-container-proadmin">
                <label>
                  <p>Description</p>
                </label>
                <CustomCKEditor
                  data={product.description}
                  onChange={handleDescriptionChange}
                />
                {errors.description && (
                  <span className="error">{errors.description}</span>
                )}
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
                  {errors.price && <span className="error">{errors.price}</span>}
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
                  {errors.quantity && (
                    <span className="error">{errors.quantity}</span>
                  )}
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
                  {errors.color && <span className="error">{errors.color}</span>}
                </div>
              </div>
              <div className="media-image-container" onClick={showModal}>
                <label>
                  <p>Media: </p>
                </label>
                <div className="upload-image-container">
                  {selectedImages.length === 0 ? (
                    <p>Select Images to Upload</p>
                  ) : (
                    selectedImages.map((image, index) => (
                      <div key={index} className="selected-image">
                        <Image
                          width={100}
                          src={image.startsWith("blob:") ? image : `http://localhost:8080/api/v1/images/${image}`}
                          alt={`Image ${index}`}
                        />
                        <Button
                          type="text"
                          onClick={(e) => handleRemoveImage(image, e)}
                          className="button-delete-image"
                        >
                          X
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="info-button-container">
                <button type="submit">
                  <p>Save</p>
                </button>
              </div>
            </div>
            <div className="right-proadmin-main">
              <div className="proadmin-components">
                <label>
                  <p>Brand: </p>
                </label>
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
                {errors.brandId && (
                  <span className="error">{errors.brandId}</span>
                )}
              </div>
              <div className="proadmin-components">
                <label>
                  <p>Category: </p>
                </label>
                <select
                  name="categoryId"
                  value={product.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="error">{errors.categoryId}</span>
                )}
              </div>
            </div>
          </div>
          {message && <p>{message}</p>}
        </form>
      </div>
      <Modal
        title="Upload or Select Images"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Upload
          listType="picture"
          multiple
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Select Images to Upload</Button>
        </Upload>
        <div className="existing-images-container">
          {currentImages.map((image, index) => (
            <div key={index} className="existing-images">
              <Checkbox
                checked={selectedImages.includes(image.imageUrl)}
                onChange={() => handleImageSelect(image.imageUrl)}
              >
                <img
                  src={`http://localhost:8080/api/v1/images/${image.imageUrl}`}
                  alt="product"
                />
              </Checkbox>
            </div>
          ))}
        </div>
        <Pagination
          current={currentPage}
          pageSize={imagesPerPage}
          total={existingImages.length}
          onChange={paginate}
          showSizeChanger={false}
        />
      </Modal>
    </div>
  );
};

export default AddProductAdmin;
