import React, { useState, useEffect } from "react";
import "../style/components/ViewStory.css";
import bookmarkWhite from "../assets/ViewStory/bookmarkWhite.png";
import bookmarkBlue from "../assets/ViewStory/bookmarkBlue.png";
import axios from "axios";
import { BACKEND_URL } from "../deploymentLink.js";

function ViewStory({ story, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const totalSlides = story?.slides.length || 0;

  useEffect(() => {
    if (story) {
      setCurrentSlide(0);
      setLikeCount(story.likes || 0); // Initialize like count from story data
      setIsLiked(story.likedBy.includes(localStorage.getItem("currentUser"))); // Check if the user has already liked the story
      setIsBookmarked(false); // Placeholder; you can implement the bookmark logic similarly
    }
  }, [story]);

  if (!story) return null;

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevSlide) => prevSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const storyId = story._id;
    const slideUrl = `${baseUrl}/stories/view/${storyId}/slide/${currentSlide + 1}`;
    navigator.clipboard.writeText(slideUrl).then(() => {
      alert("Story slide URL copied to clipboard!");
    });
  };

  // Toggle the bookmark status
  const handleYourBookmark = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      console.error("No user found in local storage.");
      alert("You need to log in to bookmark stories.");
      return;
    }

    const storyId = story._id;

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/updateBookmark`, {
        storyId,
        userEmail: currentUser,
      });
      setIsBookmarked((prev) => !prev);
      alert(response.data.message);
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      alert("Failed to update bookmark. Please try again.");
    }
  };

  // Toggle the like status and update the like count
  const handleLikeButton = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      console.error("No user found in local storage.");
      alert("You need to log in to like stories.");
      return;
    }

    const storyId = story._id;

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/updateLike`, {
        storyId,
        userEmail: currentUser,
      });
      setIsLiked((prevLiked) => {
        const newLiked = !prevLiked;
        setLikeCount((prevCount) => (newLiked ? prevCount + 1 : prevCount - 1));
        return newLiked;
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Failed to update like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  return (
    <div className="view-story-modal">
      <div className="view-story-overlay" onClick={onClose} />
      <div className="view-story-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="story-image-container">
          <button
            className="nav-arrow left-arrow"
            onClick={goToPreviousSlide}
            disabled={currentSlide === 0}
          >
            &lt;
          </button>

          <div className="story-image">
            <img
              src={story.slides[currentSlide]?.imageUrl}
              alt={story.slides[currentSlide]?.heading}
            />
          </div>

          <button
            className="nav-arrow right-arrow"
            onClick={goToNextSlide}
            disabled={currentSlide === totalSlides - 1}
          >
            &gt;
          </button>
        </div>

        <div className="story-details">
          <h3>{story.slides[currentSlide]?.heading}</h3>
          <p>{story.slides[currentSlide]?.description}</p>
          <div className="story-actions">
            <img
              src={isBookmarked ? bookmarkBlue : bookmarkWhite}
              alt="Bookmark"
              className="bookmark-btn"
              onClick={handleYourBookmark}
            />
            {/* Like functionality */}
            <div className="like-btn" onClick={handleLikeButton}>
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span> {likeCount} </span>
            </div>
            <div className="share-btn" onClick={handleCopyLink}>
              ⇗
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStory;
