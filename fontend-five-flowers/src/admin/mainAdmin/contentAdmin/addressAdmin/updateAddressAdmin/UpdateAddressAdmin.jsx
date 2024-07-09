import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './UpdateAddressAdmin.scss';

const UpdateAddressAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("You need to be logged in to update address");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/addresses/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddress(response.data);
      } catch (error) {
        console.error("Error fetching address", error);
        setErrors({ fetch: "Error fetching address" });
      }
    };

    fetchAddress();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!address.firstName) newErrors.firstName = "First Name is required";
    if (!address.lastName) newErrors.lastName = "Last Name is required";
    if (!address.address) newErrors.address = "Address is required";
    if (!address.apartment) newErrors.apartment = "Apartment is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.country) newErrors.country = "Country is required";
    if (!address.postalCode) newErrors.postalCode = "Postal Code is required";
    if (!address.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d+$/.test(address.phone)) {
      newErrors.phone = "Phone must contain only numbers";
    }

    return newErrors;
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ token: "You need to be logged in to update address" });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/v1/addresses/update/${id}`,
        address,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Address updated successfully");
      setErrors({});
      navigate("/admin/address");
    } catch (error) {
      console.error("Error updating address", error);
      setErrors({ update: "Error updating address" });
      setSuccess("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
  };

  return (
    <div className="update-address-admin">
      <h2>Update Address</h2>
      <form onSubmit={handleUpdateAddress}>
        <div className={`form-group ${errors.firstName ? "error" : ""}`}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={address.firstName || ""}
            onChange={handleChange}
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>
        <div className={`form-group ${errors.lastName ? "error" : ""}`}>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={address.lastName || ""}
            onChange={handleChange}
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
        <div className={`form-group ${errors.address ? "error" : ""}`}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={address.address || ""}
            onChange={handleChange}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
        </div>
        <div className={`form-group ${errors.apartment ? "error" : ""}`}>
          <label>Apartment:</label>
          <input
            type="text"
            name="apartment"
            value={address.apartment || ""}
            onChange={handleChange}
          />
          {errors.apartment && <p className="error-message">{errors.apartment}</p>}
        </div>
        <div className={`form-group ${errors.city ? "error" : ""}`}>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={address.city || ""}
            onChange={handleChange}
          />
          {errors.city && <p className="error-message">{errors.city}</p>}
        </div>
        <div className={`form-group ${errors.country ? "error" : ""}`}>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={address.country || ""}
            onChange={handleChange}
          />
          {errors.country && <p className="error-message">{errors.country}</p>}
        </div>
        <div className={`form-group ${errors.postalCode ? "error" : ""}`}>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode || ""}
            onChange={handleChange}
          />
          {errors.postalCode && <p className="error-message">{errors.postalCode}</p>}
        </div>
        <div className={`form-group ${errors.phone ? "error" : ""}`}>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={address.phone || ""}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>
        <button type="submit">Update Address</button>
        {errors.update && <p style={{ color: "red" }}>{errors.update}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default UpdateAddressAdmin;
