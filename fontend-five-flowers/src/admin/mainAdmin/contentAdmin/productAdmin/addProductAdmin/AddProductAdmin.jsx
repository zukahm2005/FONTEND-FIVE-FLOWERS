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

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/brands/all")
      .then((response) => setBrands(response.data.content))
      .catch((error) => console.error("Error fetching brands:", error));

    axios
      .get("http://localhost:8080/api/v1/categories/all")
      .then((response) => setCategories(response.data.content))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleDescriptionChange = (data) => {
    setProduct({ ...product, description: data });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productResponse = await axios.post(
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

      if (productId && images.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
          formData.append("files", images[i]);
        }

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

        setMessage("Product and images added successfully");
      } else {
        setMessage("Product added but no images to upload");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to add product. Please try again.");
    }
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
              </div>{" "}
              <div className="media-image-cotainer">
                <label>
                  <p>Media: </p>
                </label>

                <div className="upload-image-container">
                  <input type="file" multiple onChange={handleFileChange} />
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
    </div>
  );
};

export default AddProduct;
