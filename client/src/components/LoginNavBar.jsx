import React, { useEffect, useState } from "react";
import "../style/components/LoginNavBar.css";
import bookmark from "../assets/HomePage/LoginNavBar/bookmark.jpg";
import hamburger from "../assets/HomePage/LoginNavBar/hamburger.png";
import AddStory from "./AddStory.jsx";
import { useNavigate } from "react-router-dom";

function LoginNavBar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [currentUser, selectedUser] = useState("");

  const handleLogout = () => {
    alert("Logout Successful");
    setIsLoggedIn(false);
    localStorage.removeItem("IsLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleHamburger = () => {
    setIsLoggingOut(!isLoggingOut);
  };

  const handleBookmarkPage = () => {
    navigate("/your-bookmarks");
  };

  const handleProfilePage = () => {
    navigate("/");
  };

  const handleAddStory = () => {
    setIsAddingStory(true);
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    selectedUser(currentUser);
  }, []);

  return (
    <div className="login-navbar">
      <div className="bookmarks-container" onClick={handleBookmarkPage}>
        <img src={bookmark} alt="Bookmark icon" />
        <div className="bookmarks-btn">Bookmarks</div>
      </div>
      <div className="add-story-btn" onClick={handleAddStory}>
        Add story
      </div>
      <div className="user-profile" onClick={handleProfilePage}></div>
      <img src={hamburger} alt="hamburger icon" onClick={handleHamburger} />

      {isLoggingOut && (
        <>
          <div className="logOut-div">
            <div className="current-user">{currentUser}</div>
            <div className="logout-btn" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </>
      )}

      {isAddingStory && <AddStory setIsAddingStory={setIsAddingStory} />}
    </div>
  );
}

export default LoginNavBar;
