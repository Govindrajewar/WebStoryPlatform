import React, { useEffect, useState } from "react";
import "../style/pages/HomePage.css";
import NavBar from "../components/NavBar";
import LoginNavBar from "../components/LoginNavBar";
import YourBookmarks from "../components/YourBookmarks";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line
  const [isShowBookmarks, setIsShowBookmarks] = useState(false);

  useEffect(() => {
    const isLoggedInLocal = localStorage.getItem("IsLoggedIn");
    if (isLoggedInLocal === "true") {
      setIsLoggedIn(true);
    }
  }, []);

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
            <div className="category-item" id="All">
              All
            </div>
            <div className="category-item" id="Medical">
              Medical
            </div>
            <div className="category-item" id="Fruits">
              Fruits
            </div>
            <div className="category-item" id="World">
              World
            </div>
            <div className="category-item" id="India">
              India
            </div>
          </div>

          <h4>Top Stories About food</h4>
          <div className="stories">No stories Available</div>

          <h4>Top Stories About Medical</h4>
          <div className="stories">No stories Available</div>
        </>
      )}
    </div>
  );
}

export default HomePage;
