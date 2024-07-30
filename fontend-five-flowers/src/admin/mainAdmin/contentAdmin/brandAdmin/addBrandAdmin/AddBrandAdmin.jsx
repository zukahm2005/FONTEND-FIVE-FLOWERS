import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CKEditorComponent from "../../CKEditorComponent/CKEditorComponent";
import "./AddBrandAdmin.scss";

const AddBrandAdmin = () => {
  const [brand, setBrand] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrand((prevState) => ({
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
    setBrand((prevState) => ({
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
    if (!brand.name) newErrors.name = "Name is required";
    if (!brand.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const brandData = {
      name: brand.name,
      description: brand.description,
    };

    axios
      .post("http://localhost:8080/api/v1/brands/add", brandData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setMessage("Brand added successfully!");
        setBrand({ name: "", description: "" }); // Clear the form
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to add brand. Please try again.");
      });
  };

  return (
    <div className="add-brand-admin">
      <div className="title-brand-container" onClick={() => navigate(-1)}>
        <div className="arrow-back-brand">
          <p>
            <FaArrowLeft />
          </p>
        </div>
        <div className="title-add-brand">
          <p>Add Brand</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={brand.name}
            onChange={handleInputChange}
            placeholder="e.g. Apple, Samsung"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Description:</label>
          <CKEditorComponent
            data={brand.description}
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
          <p>Add Brand</p>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddBrandAdmin;
