import React, { useState } from "react";
import "../style/components/LoginNavBar.css";
import { useNavigate } from "react-router-dom";
import bookmark from "../assets/HomePage/LoginNavBar/bookmark.jpg";
import hamburger from "../assets/HomePage/LoginNavBar/hamburger.png";
import AddStory from "./AddStory.jsx";

function LoginNavBar({ setIsLoggedIn, setIsShowBookmarks }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAddingStory, setIsAddingStory] = useState(false);

  const handleLogout = () => {
    alert("Logout Successful");
    setIsLoggedIn(false);
    localStorage.setItem("IsLoggedIn", false);
    navigate("/");
  };

  const handleHamburger = () => {
    setIsLoggingOut(!isLoggingOut);
  };

  const handleBookmarkPage = () => {
    setIsShowBookmarks(true);
  };

  const handleProfilePage = () => {
    setIsShowBookmarks(false);
    // navigate("/");
  };

  const handleAddStory = () => {
    setIsAddingStory(true);
  };

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
            <div className="current-user">Your Name</div>
            <div className="logout-btn" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </>
      )}

      {isAddingStory && <AddStory setIsAddingStory={setIsAddingStory}/>}
    </div>
  );
}

export default LoginNavBar;
