import React, { useEffect, useState } from "react";
import "../style/components/YourBookmarks.css";
import { BACKEND_URL } from "../deploymentLink";

function YourBookmarks() {
  const [stories, setStories] = useState([]);

  // TODO: Instead of displaying all stories only display the bookmarked stories by currentUser
  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/stories/allStories`);
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="yourbookmarks">
      <h2>Your Bookmarks</h2>
      <div className="your-stories">
        {stories.length > 0 ? (
          stories.map((story) => {
            const imageUrl = story.slides[0].imageUrl;
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
