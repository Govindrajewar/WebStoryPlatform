import React, { useEffect, useState } from "react";
import "../style/components/LoginNavBar.css";
import bookmark from "../assets/HomePage/LoginNavBar/bookmark.jpg";
import hamburger from "../assets/HomePage/LoginNavBar/hamburger.png";
import AddStory from "./AddStory.jsx";

function LoginNavBar({ setIsLoggedIn, setIsShowBookmarks }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [currentUser, selectedUser] = useState("");

  const handleLogout = () => {
    alert("Logout Successful");
    setIsLoggedIn(false);
    localStorage.removeItem("IsLoggedIn");
    localStorage.removeItem("currentUser");
  };

  const handleHamburger = () => {
    setIsLoggingOut(!isLoggingOut);
  };

  const handleBookmarkPage = () => {
    setIsShowBookmarks(true);
  };

  const handleProfilePage = () => {
    setIsShowBookmarks(false);
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
