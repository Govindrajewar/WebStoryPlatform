import React from "react";
import "../style/components/NavBar.css";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="register-btn" onClick={() => navigate("/register")}>
        Register Now
      </div>
      <div className="signIn-btn" onClick={() => navigate("/login")}>
        Sign In
      </div>
    </div>
  );
}

export default NavBar;
