import React, { useState } from "react";
import "../style/pages/RegisterPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../deploymentLink.js";
import exit from "../assets/Register/exit.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onFinishHandler = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/login`, {
        email,
        password,
      });
      if (response.data.success) {
        setErrorMessage("");
        localStorage.setItem("IsLoggedIn", true);
        navigate("/");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        setErrorMessage(
          error.response.data.message || "Server error. Please try again."
        );
      } else {
        console.error("Error Request:", error.request);
        setErrorMessage(
          "No response from server. Please check if the backend is running."
        );
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      <div className="register-form">
        <img
          src={exit}
          alt="Exit"
          className="exit-img"
          onClick={() => navigate("/")}
        />
        <h3>Login</h3>
        <div className="data-field">
          <label htmlFor="email">Username</label>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
              className="input-field"
              required
            />
          </div>
        </div>
        <div className="data-field">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input-field"
              required
            />
            <span
              className="show-password-icon"
              onClick={togglePasswordVisibility}
            >
              &#128065;
            </span>
          </div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="register-button" onClick={onFinishHandler}>
          Login
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
