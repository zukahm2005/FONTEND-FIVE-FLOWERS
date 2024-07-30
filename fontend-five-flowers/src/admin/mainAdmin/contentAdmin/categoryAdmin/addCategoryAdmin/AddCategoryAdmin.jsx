import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CKEditorComponent from "../../CKEditorComponent/CKEditorComponent";
import "./AddCategoryAdmin.scss";

const AddCategoryAdmin = () => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setCategory((prevState) => ({
      ...prevState,
      description: data,
    }));
    setErrors((prevState) => ({
      ...prevState,
      description: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!category.name) newErrors.name = "Name is required";
    if (!category.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const categoryData = {
      name: category.name,
      description: category.description,
    };

    axios
      .post("http://localhost:8080/api/v1/categories/add", categoryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setMessage("Category added successfully!");
        setCategory({ name: "", description: "" }); // Clear the form
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to add category. Please try again.");
      });
  };

  return (
    <div className="add-category-admin">
      <div className="title-category-container" onClick={() => navigate(-1)}>
        <div className="arrow-back-category">
          <p>
            <FaArrowLeft />
          </p>
        </div>
        <div className="title-add-category">
          <p>Add Category</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            placeholder="e.g. Summer collection, Under $100, Staff picks"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Description:</label>
          <CKEditorComponent
            data={category.description}
            onChange={handleDescriptionChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div
          className="submit-button"
          onClick={handleSubmit}
          role="button"
          tabIndex="0"
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSubmit(e);
            }
          }}
        >
          <p>Add Category</p>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddCategoryAdmin;
