import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = ({ switchToRegister }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      setError("Username or password cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        {
          userName,
          password,
        }
      );

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const roles = decodedToken.roles.split(",");

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Invalid login credentials", error);
      setError("Invalid username or password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") {
      setUserName(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setError(""); // Clear error when user starts typing
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
        </form>
      </div>
    </div>
  );
};

export default Login;
