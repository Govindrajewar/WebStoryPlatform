import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/pages/HomePage.css";
import NavBar from "../components/NavBar";
import LoginNavBar from "../components/LoginNavBar";
import YourBookmarks from "../components/YourBookmarks";
import { BACKEND_URL } from "../deploymentLink";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isShowBookmarks, setIsShowBookmarks] = useState(false);
  const [categories] = useState(["All", "Medical", "Fruits", "World", "India"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("IsLoggedIn");
    if (isLoggedInLocal === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch stories based on selected category
  useEffect(() => {
    const fetchStories = async () => {
      try {
        let response;
        if (selectedCategory === "All") {
          response = await axios.get(`${BACKEND_URL}/api/stories/allStories`);
        } else {
          response = await axios.get(
            `${BACKEND_URL}/api/stories/category/${selectedCategory}`
          );
        }

        console.log("Fetched stories:", response.data);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [selectedCategory]);

  return (
    <div className="homepage">
      {isLoggedIn ? (
        <LoginNavBar
          setIsLoggedIn={setIsLoggedIn}
          setIsShowBookmarks={setIsShowBookmarks}
        />
      ) : (
        <NavBar />
      )}

      {isShowBookmarks ? (
        <YourBookmarks />
      ) : (
        <>
          {/* categories list */}
          <div className="categories">
            {categories.map((category) => (
              <div
                key={category}
                className={`category-item ${category}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>

          {/* Display Stories */}
          <h4>Top Stories About {selectedCategory}</h4>
          <div className="stories">
            {stories.length > 0 ? (
              <div className="story-cards">
                {stories.map((story) => {
                  const imageUrl = story.slides[0].imageUrl;
                  return (
                    <div
                      key={story._id}
                      className={`story-card ${!imageUrl ? "no-image" : ""}`}
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
                })}
              </div>
            ) : (
              <p>No stories available for {selectedCategory}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
