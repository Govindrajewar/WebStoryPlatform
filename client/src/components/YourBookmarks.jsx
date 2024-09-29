import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/components/YourBookmarks.css";
import { BACKEND_URL } from "../deploymentLink";

function YourBookmarks() {
  const [stories, setStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch bookmarked stories
  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      if (!currentUser) return;

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/users/${currentUser}/bookmarks`
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching bookmarked stories:", error);
      }
    };

    fetchBookmarkedStories();
  }, [currentUser]);

  return (
    <div className="yourbookmarks">
      <h2>Your Bookmarks</h2>
      <div className="your-stories">
        {stories.length > 0 ? (
          stories.map((story) => {
            const imageUrl = story.slides[0]?.imageUrl;
            return (
              <div
                key={story._id}
                className="story-card"
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                }}
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
