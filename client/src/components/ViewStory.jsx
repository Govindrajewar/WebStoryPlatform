import React, { useState, useEffect } from "react";
import "../style/components/ViewStory.css";
import { useParams, useNavigate } from "react-router-dom";
import bookmarkWhite from "../assets/ViewStory/bookmarkWhite.png";
import bookmarkBlue from "../assets/ViewStory/bookmarkBlue.png";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../deploymentLink.js";
import likeWhite from "../assets/ViewStory/likeWhite.png";
import likeRed from "../assets/ViewStory/likeRed.png";
import share from "../assets/ViewStory/share.png";
import close from "../assets/ViewStory/close.png";
import download from "../assets/ViewStory/download.png";
import download_done from "../assets/ViewStory/download_done.png";

function ViewStory() {
  const { storyId, slideNumber } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const totalSlides = story?.slides.length || 0;
  const [isDownload, setIsDownload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("IsLoggedIn");
    if (isLoggedIn === "true") {
      setIsLoggedIn(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("IsLoggedIn");
    if (isLoggedInLocal === "true") {
      setIsLoggedIn(true);
    }

    // Fetch the story based on the storyId from the URL
    const fetchStory = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/stories/${storyId}`
        );
        setStory(response.data);

        if (slideNumber) {
          setCurrentSlide(parseInt(slideNumber, 10) - 1);
        } else {
          setCurrentSlide(0);
        }

        setIsLiked(
          response.data.likedBy.includes(localStorage.getItem("currentUser"))
        );
        setLikeCount(response.data.likedBy.length);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchStory();
  }, [storyId, slideNumber]);

  useEffect(() => {
    if (story) {
      const currentUser = localStorage.getItem("currentUser");

      // Fetch bookmarks for the logged-in user from the backend
      axios
        .get(`${BACKEND_URL}/api/users/${currentUser}/bookmarksId`)
        .then((response) => {
          const bookmarks = response.data.bookmarks;
          const isStoryBookmarked = bookmarks.includes(story._id);
          setIsBookmarked(isStoryBookmarked);
        })
        .catch((error) => {
          console.error("Error fetching bookmark status:", error);
        });
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
    const slideUrl = `${FRONTEND_URL}/stories/${storyId}/slide/${
      currentSlide + 1
    }`;
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
      // eslint-disable-next-line
      const response = await axios.put(
        `${BACKEND_URL}/api/users/updateBookmark`,
        {
          storyId,
          userEmail: currentUser,
        }
      );
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      alert("Failed to update bookmark. Please try again.");
    }
  };

  // Function to handle liking the story
  const handleLikeButton = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      console.error("No user found in local storage.");
      alert("You need to log in to like stories.");
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/updateLike`, {
        storyId: story._id,
        userEmail: currentUser,
      });
      setIsLiked((prev) => !prev);
      if (response.data.isLiked) {
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        setLikeCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Failed to update like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const renderSlideIndicators = () => {
    return [...Array(totalSlides)].map((_, index) => (
      <div
        key={index}
        className={`slide-indicator ${
          index === currentSlide ? "highlighted" : ""
        }`}
      ></div>
    ));
  };

  const handleDownloadButton = async () => {
    const imageUrl = story.slides[currentSlide]?.imageUrl;

    if (imageUrl) {
      try {
        const response = await fetch(imageUrl, {
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Image download failed");
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `slide-${currentSlide + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);

        setIsDownload(true);
        setTimeout(() => {
          setIsDownload(false);
        }, 1000);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download the image.");
      }
    } else {
      alert("Image not available for download.");
    }
  };

  const mobileBackgroundStyle = {
    backgroundImage: `url(${story.slides[currentSlide]?.imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
      className="view-story-modal"
      style={isMobile ? mobileBackgroundStyle : {}}
    >
      <div className="story-content-buttons">
        <div className="slide-indicators">{renderSlideIndicators()}</div>
        <div className="content-buttons">
          <img
            src={close}
            alt="close icon"
            className="close-btn"
            onClick={() => navigate("/")}
          />
          <img
            src={share}
            alt="share icon"
            className="share-btn"
            onClick={handleCopyLink}
          />
        </div>
      </div>
      {!isMobile && <div className="view-story-overlay" />}
      <div
        className="nav-arrow left-arrow"
        onClick={goToPreviousSlide}
        disabled={currentSlide === 0}
      >
        《
      </div>
      <div className="view-story-content">
        {!isMobile ? (
          <div
            className="story-image-container"
            style={{
              backgroundImage: `url(${story.slides[currentSlide]?.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        ) : (
          <div className="story-image-container"></div>
        )}
      </div>
      <div
        className="nav-arrow right-arrow"
        onClick={goToNextSlide}
        disabled={currentSlide === totalSlides - 1}
      >
        》
      </div>

      {/* common data */}
      <div className="story-details">
        {isDownload && (
          <div className="download-message">Downloaded Successfully</div>
        )}
        <h3>{story.slides[currentSlide]?.heading}</h3>
        <p>{story.slides[currentSlide]?.description}</p>
        <div className="story-actions">
          <img
            src={isBookmarked ? bookmarkBlue : bookmarkWhite}
            alt="Bookmark"
            className="bookmark-btn"
            onClick={handleYourBookmark}
          />
          {isLoggedIn && (
            <img
              src={isDownload ? download_done : download}
              alt="download"
              className="download-btn"
              onClick={handleDownloadButton}
            />
          )}
          <div className="like-btn" onClick={handleLikeButton}>
            <img
              src={isLiked ? likeRed : likeWhite}
              alt="like"
              className="likeIcon"
            />
            <div className="like-counter"> {likeCount} </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStory;
