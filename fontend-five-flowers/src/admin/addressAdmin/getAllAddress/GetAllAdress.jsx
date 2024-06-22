import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GetAllAddress = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
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

    fetchAddresses();
  }, []);

  return (
    <div>
      <h2>All User Addresses</h2>
      <ul>
        {addresses.map((address) => (
          <li key={address.addressId}>
            <p>User: {address.user.userName}</p>
            <p>Address Line 1: {address.addressLine1}</p>
            <p>Address Line 2: {address.addressLine2}</p>
            <p>City: {address.city}</p>
            <p>State: {address.state}</p>
            <p>Postal Code: {address.postalCode}</p>
            <p>Country: {address.country}</p>
            <Link to={`/admin/update-address/${address.addressId}`}>Update</Link>
            <Link to={`/admin/delete-address/${address.addressId}`}>Delete</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllAddress;
