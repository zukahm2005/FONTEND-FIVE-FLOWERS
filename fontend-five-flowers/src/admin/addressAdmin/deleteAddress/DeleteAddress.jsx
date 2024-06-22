import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const deleteAddress = async () => {
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
        navigate("/admin/addresses");
      } catch (error) {
        console.error("Error deleting address", error);
        setError("Error deleting address");
        setSuccess("");
      }
    };

    deleteAddress();
  }, [id, navigate]);

  return (
    <div>
      <h2>Delete Address</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default DeleteAddress;
