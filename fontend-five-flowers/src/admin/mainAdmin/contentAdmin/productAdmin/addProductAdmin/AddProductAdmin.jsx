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
  const { id } = useParams(); // Lấy id từ URL nếu có
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
  const [images, setImages] = useState([]);
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
          console.log("Fetching product with id:", id);
          const response = await axios.get(
            `http://localhost:8080/api/v1/products/get/${id}`
          );
          const productData = response.data;
          console.log("Fetched product data:", productData);
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
    const plainText = data.replace(/<\/?[^>]+(>|$)/g, ""); // Loại bỏ thẻ HTML
    setProduct((prevState) => ({
      ...prevState,
      description: plainText,
    }));
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

  const handleRemoveImage = (imageUrl, e) => {
    e.stopPropagation(); // Ngăn không cho mở popup khi nhấn nút X
    setSelectedImages(selectedImages.filter((img) => img !== imageUrl));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = "Product name is required";
    if (!product.description) newErrors.description = "Description is required";
    if (product.price <= 0) newErrors.price = "Price must be greater than 0";
    if (product.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
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

      if (id) {
        productResponse = await axios.put(
          `http://localhost:8080/api/v1/products/update/${id}`,
          {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            color: product.color,
            brand: {
              brandId: product.brandId,
            },
            category: {
              categoryId: product.categoryId,
            },
            productImages: selectedImages.map((url) => ({ imageUrl: url })),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (images.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < images.length; i++) {
            formData.append("files", images[i]);
          }

          const uploadResponse = await axios.put(
            `http://localhost:8080/api/v1/products/update/${id}/images`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const newImages = uploadResponse.data.productImages.map(
            (img) => img.imageUrl
          );
          setSelectedImages((prevSelectedImages) => [
            ...prevSelectedImages,
            ...newImages,
          ]);
        }

        setMessage("Product updated successfully");
        navigate("/admin/product");
      } else {
        productResponse = await axios.post(
          "http://localhost:8080/api/v1/products/add",
          {
            name: product.name,
            description: product.description,
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

            const newImages = uploadResponse.data.productImages.map(
              (img) => img.imageUrl
            );
            setSelectedImages((prevSelectedImages) => [
              ...prevSelectedImages,
              ...newImages,
            ]);
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
          navigate("/admin/product");
        } else {
          setMessage("Product added but no images to upload");
        }
      }
    } catch (error) {
      console.error("Error in add/update product:", error);
      setMessage("Failed to add/update product. Please try again.");
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

  // Logic for displaying current images
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = existingImages.slice(
    indexOfFirstImage,
    indexOfLastImage
  );

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
                  {errors.price && (
                    <span className="error">{errors.price}</span>
                  )}
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
                  {errors.color && (
                    <span className="error">{errors.color}</span>
                  )}
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
                          src={`http://localhost:8080/api/v1/images/${image}`}
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
          multiple={true}
          beforeUpload={() => false} // Prevent automatic upload
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
          showSizeChanger={false} // Ẩn phần lựa chọn số lượng mục trên mỗi trang
        />
      </Modal>
    </div>
  );
};

export default AddProductAdmin;