import React, { useState, useEffect } from "react";
import "../style/components/ViewStory.css";
import { useParams, useNavigate } from "react-router-dom";
import bookmarkWhite from "../assets/ViewStory/bookmarkWhite.png";
import bookmarkBlue from "../assets/ViewStory/bookmarkBlue.png";
import axios from "axios";
import { BACKEND_URL } from "../deploymentLink.js";
import likeWhite from "../assets/ViewStory/likeWhite.png";
import likeRed from "../assets/ViewStory/likeRed.png";
import share from "../assets/ViewStory/share.png";
import download from "../assets/ViewStory/download.png";
import download_done from "../assets/ViewStory/download_done.png";

function ViewStory() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const totalSlides = story?.slides.length || 0;
  const [isDownload, setIsDownload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("IsLoggedIn");
    if (isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
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
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    if (story) {
      setCurrentSlide(0);
      setIsBookmarked(false);

      // Fetch initial like count and liked status from the backend
      axios
        .get(`${BACKEND_URL}/api/users/${story._id}/likeStatus`)
        .then((response) => {
          const { isLikedByUser, likes } = response.data;
          setIsLiked(isLikedByUser);
          setLikeCount(likes);
        })
        .catch((error) => {
          console.error("Error fetching like status:", error);
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
    const baseUrl = window.location.origin;
    const storyId = story._id;
    const slideUrl = `${baseUrl}/stories/view/${storyId}/slide/${
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
      const response = await axios.put(
        `${BACKEND_URL}/api/users/updateBookmark`,
        {
          storyId,
          userEmail: currentUser,
        }
      );
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

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/users/${story._id}/toggleLike`,
        {
          userEmail: currentUser,
        }
      );

      const { isLiked: newLikeStatus, likeCount: updatedLikeCount } =
        response.data;

      setIsLiked(newLikeStatus);
      setLikeCount(updatedLikeCount);
    } catch (error) {
      console.error("Failed to update like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const renderSlideIndicators = () => {
    return [...Array(totalSlides)].map((_, index) => (
      <span
        key={index}
        className={`dash ${index === currentSlide ? "highlighted" : ""}`}
      >
        _
      </span>
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

  return (
    <div className="view-story-modal">
      <div className="view-story-overlay" />
      <div
        className="nav-arrow left-arrow"
        onClick={goToPreviousSlide}
        disabled={currentSlide === 0}
      >
        《
      </div>
      <div className="view-story-content">
        <button className="close-btn" onClick={() => navigate("/")}>
          ✖
        </button>
        <div
          className="story-image-container"
          style={{
            backgroundImage: `url(${story.slides[currentSlide]?.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
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
              <div />
            </div>
          </div>
          <div className="slide-indicators">{renderSlideIndicators()}</div>
        </div>

        <img
          src={share}
          alt="share icon"
          className="share-btn"
          onClick={handleCopyLink}
        />
      </div>
      <div
        className="nav-arrow right-arrow"
        onClick={goToNextSlide}
        disabled={currentSlide === totalSlides - 1}
      >
        》
      </div>
    </div>
  );
}

export default ViewStory;
