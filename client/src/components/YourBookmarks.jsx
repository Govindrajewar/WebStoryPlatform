import React from "react";
import "../style/components/YourBookmarks.css";
import sampleStories from "../assets/HomePage/sample-stories.png";

function YourBookmarks() {
  return (
    <div className="yourbookmarks">
      <h2>Your Bookmarks</h2>
      <div className="your-stories">
        <img src={sampleStories} alt="sampleStories Icon" />
      </div>
    </div>
  );
}

export default YourBookmarks;
