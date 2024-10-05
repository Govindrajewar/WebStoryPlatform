import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/components/YourBookmarks.css";
import { BACKEND_URL } from "../deploymentLink";
import LoginNavBar from "./LoginNavBar";
import { useNavigate } from "react-router-dom";

function YourBookmarks() {
  const [stories, setStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  // eslint-disable-next-line
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch bookmarked stories
  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/users/${currentUser}/bookmarks`
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching bookmarked stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedStories();
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots === 3 ? 1 : prevDots + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleViewStory = (story) => {
    navigate(`/stories/${story._id}`);
  };

  return (
    <div className="your-bookmarks">
      <LoginNavBar setIsLoggedIn={setIsLoggedIn} />
      <h2>Your Bookmarks</h2>
      <div className="your-stories">
        {loading ? (
          <p>Fetching Data{".".repeat(dots)}</p>
        ) : stories.length > 0 ? (
          stories.map((story) => {
            const imageUrl = story.slides[0]?.imageUrl;
            return (
              <div
                key={story._id}
                className="story-card"
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                }}
                onClick={() => handleViewStory(story)}
              >
                {imageUrl ? (
                  <div className="story-data">
                    <h3>{story.slides[0].heading}</h3>
                    <p>{story.slides[0].description}</p>
                  </div>
                ) : (
                  <div className="no-image">
                    <p>No image available</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No bookmarked stories found.</p>
        )}
      </div>
    </div>
  );
}

export default YourBookmarks;
