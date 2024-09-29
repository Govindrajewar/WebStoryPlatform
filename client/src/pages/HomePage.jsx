import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/pages/HomePage.css";
import NavBar from "../components/NavBar";
import LoginNavBar from "../components/LoginNavBar";
import YourBookmarks from "../components/YourBookmarks";
import { BACKEND_URL } from "../deploymentLink";
import EditButton from "../assets/HomePage/EditButton.png";
import AddStory from "../components/AddStory";
import ViewStory from "../components/ViewStory";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isShowBookmarks, setIsShowBookmarks] = useState(false);
  const [categories] = useState(["All", "Medical", "Fruits", "World", "India"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [visibleUserStoriesCount, setVisibleUserStoriesCount] = useState(4);
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewStory, setViewStory] = useState(null);

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

  // Fetch stories created by the logged-in user
  useEffect(() => {
    const fetchUserStories = async () => {
      if (isLoggedIn) {
        try {
          const currentUser = localStorage.getItem("currentUser");
          const response = await axios.get(
            `${BACKEND_URL}/api/stories/user/${currentUser}`
          );
          setUserStories(response.data);
        } catch (error) {
          console.error("Error fetching user stories:", error);
        }
      }
    };

    fetchUserStories();
  }, [isLoggedIn]);

  const handleSeeMoreStories = () => {
    setVisibleStoriesCount(stories.length);
  };

  const handleSeeMoreUserStories = () => {
    setVisibleUserStoriesCount(userStories.length);
  };

  // Handle edit button click for user stories
  const handleEditStory = (story) => {
    setSelectedStory(story);
    setIsAddingStory(true);
  };

  const handleViewStory = (story) => {
    setViewStory(story);
  };

  const closeViewStory = () => {
    setViewStory(null);
  };

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

          {isLoggedIn && (
            <>
              <h4>Your Stories</h4>
              <div className="user-stories">
                {userStories.length === 0 ? (
                  <p className="no-stories">No stories available</p>
                ) : (
                  userStories.slice(0, visibleUserStoriesCount).map((story) => {
                    const imageUrl = story.slides[0].imageUrl;
                    return (
                      <div
                        key={story._id}
                        className={`user-story-card ${
                          !imageUrl ? "no-image" : ""
                        }`}
                        style={{
                          backgroundImage: imageUrl
                            ? `url(${imageUrl})`
                            : "none",
                        }}
                        onClick={() => handleViewStory(story)}
                      >
                        {imageUrl ? (
                          <div className="user-story-data">
                            <h3>{story.slides[0].heading}</h3>
                            <p>{story.slides[0].description}</p>
                          </div>
                        ) : (
                          <div className="no-image">
                            <p>No image available</p>
                          </div>
                        )}
                        <div
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStory(story);
                          }}
                        >
                          <img src={EditButton} alt="Edit icon" />
                          <div>Edit</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {userStories.length > visibleUserStoriesCount && (
                <div className="see-more-container">
                  <button
                    className="see-more-btn"
                    onClick={handleSeeMoreUserStories}
                  >
                    See More
                  </button>
                </div>
              )}
            </>
          )}

          {isLoggedIn && isAddingStory && (
            <AddStory
              setIsAddingStory={setIsAddingStory}
              initialStoryData={selectedStory}
            />
          )}

          {/* Display Stories */}
          <h4>Top Stories About {selectedCategory}</h4>
          <div className="stories">
            {stories.length === 0 ? (
              <p className="no-stories">No stories available</p>
            ) : (
              stories.slice(0, visibleStoriesCount).map((story) => {
                const imageUrl = story.slides[0].imageUrl;
                return (
                  <div
                    key={story._id}
                    className={`story-card ${!imageUrl ? "no-image" : ""}`}
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
                    <div
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStory(story);
                      }}
                    >
                      <img src={EditButton} alt="Edit icon" />
                      <div>Edit</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {stories.length > visibleStoriesCount && (
            <div className="see-more-container">
              <button className="see-more-btn" onClick={handleSeeMoreStories}>
                See More
              </button>
            </div>
          )}

          {viewStory && (
            <ViewStory story={viewStory} onClose={closeViewStory} />
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
