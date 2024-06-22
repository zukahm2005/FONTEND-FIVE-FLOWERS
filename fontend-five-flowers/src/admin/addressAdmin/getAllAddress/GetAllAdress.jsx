import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const GetAllAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("You need to be logged in to view addresses");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/addresses/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddresses(response.data.content || response.data); // Điều chỉnh nếu bạn sử dụng phân trang hoặc không
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("You need to be logged in to delete address");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/v1/addresses/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Address deleted successfully");
      setError("");
      fetchAddresses(); // Refresh the addresses list after deletion
    } catch (error) {
      console.error("Error deleting address", error);
      setError("Error deleting address");
      setSuccess("");
    }
  };

  const filteredAddresses = addresses.filter((address) =>
    address.user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>All User Addresses</h2>
      <input
        type="text"
        placeholder="Search by user name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredAddresses.map((address) => (
          <li key={address.addressId}>
            <p>User: {address.user.userName}</p>
            <p>Address Line 1: {address.addressLine1}</p>
            <p>Address Line 2: {address.addressLine2}</p>
            <p>City: {address.city}</p>
            <p>State: {address.state}</p>
            <p>Postal Code: {address.postalCode}</p>
            <p>Country: {address.country}</p>
            <Link to={`/admin/update-address/${address.addressId}`}>Update</Link>
            <button onClick={() => handleDelete(address.addressId)}>Delete</button>
          </li>
        ))}
      </ul>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default GetAllAddress;
