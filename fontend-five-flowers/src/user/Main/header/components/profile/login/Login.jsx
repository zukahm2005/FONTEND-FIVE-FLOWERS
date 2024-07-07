import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct named import
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../cart/cartContext/CartProvider";
import "./login.scss";

const Login = ({ switchToRegister }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(CartContext); // Use CartContext

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      setError("Username or password cannot be empty");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/user/login", { userName, password });
      const token = response.data.token;
      if (token) {
        await login(token); // Call the login method with the token

        setSuccess("Login successful");
        setError("");

        // Clear input fields
        setUserName("");
        setPassword("");

        const decodedToken = jwtDecode(token); // Decode the token
        const roles = decodedToken.roles.split(",");

        setTimeout(() => {
          setSuccess("");
          navigate(roles.includes("ROLE_ADMIN") ? "/admin" : "/home");
        }, 2000);
      } else {
        setError("Invalid username or password");
        setSuccess("");
      }
    } catch (error) {
      setError("Invalid username or password");
      setSuccess("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") {
      setUserName(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setError(""); 
    setSuccess(""); 
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <p>LOGIN</p>
      </div>
      <div className="form-login">
        <form onSubmit={handleLogin}>
          <div className="form-login-content">
            <div className="input-username-form-login">
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={handleInputChange}
                placeholder="Username"
              />
            </div>
            <div className="input-password-form-login">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Password"
              />
            </div>
            <div className="button-form-login">
              <div className="button-login">
                <button type="submit"><p>LOGIN</p></button>
              </div>
              <div className="button-to-register">
                <p onClick={switchToRegister}>Create an account</p>
              </div>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
