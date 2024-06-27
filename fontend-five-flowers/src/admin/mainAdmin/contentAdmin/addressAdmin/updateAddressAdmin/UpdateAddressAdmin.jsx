import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAddressAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState({});
  const [error, setError] = useState("");
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
        setError("Error fetching address");
      }
    };

    fetchAddress();
  }, [id]);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to be logged in to update address");
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
      setError("");
      navigate("/admin/addresses");
    } catch (error) {
      console.error("Error updating address", error);
      setError("Error updating address");
      setSuccess("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <h2>Update Address</h2>
      <form onSubmit={handleUpdateAddress}>
        <div>
          <label>Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            value={address.addressLine1 || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address Line 2:</label>
          <input
            type="text"
            name="addressLine2"
            value={address.addressLine2 || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={address.city || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={address.state || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={address.country || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Address</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default UpdateAddressAdmin;
