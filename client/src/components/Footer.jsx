import React from "react";
import "../style/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Me</h3>
          <p>Email: abhirajewar87@gmail.com</p>
          <p>Phone: (+91) 8766549929</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Govind Rajewar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
