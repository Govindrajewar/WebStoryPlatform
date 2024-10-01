import React, { useState, useEffect } from "react";
import "../style/components/AddStory.css";
import exit from "../assets/Register/exit.jpg";
import axios from "axios";
import { BACKEND_URL } from "../deploymentLink.js";

function AddStory({ setIsAddingStory, initialStoryData }) {
  const [slides, setSlides] = useState([
    { id: 1, heading: "", description: "", imageUrl: "", category: "" },
    { id: 2, heading: "", description: "", imageUrl: "", category: "" },
    { id: 3, heading: "", description: "", imageUrl: "", category: "" },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle adding a new slide
  const addSlide = () => {
    if (slides.length < 6) {
      setSlides([
        ...slides,
        {
          id: slides.length + 1,
          heading: "",
          description: "",
          imageUrl: "",
          category: slides[0].category,
        },
      ]);
    } else {
      alert("You can add up to 6 slides only.");
    }
  };

  // Prefill story data when in edit mode
  useEffect(() => {
    if (initialStoryData) {
      setSlides(initialStoryData.slides);
    }
  }, [initialStoryData]);

  const handleSlideChange = (slideIndex, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex][field] = value;
    setSlides(updatedSlides);
  };

  // Function to handle removing a slide
  const removeSlide = (index) => {
    if (slides.length > 3) {
      let newSlides = slides.filter((_, i) => i !== index);
      newSlides = newSlides.map((slide, i) => ({
        ...slide,
        id: i + 1,
      }));
      setSlides(newSlides);
      setActiveSlide(
        Math.max(0, activeSlide > index ? activeSlide - 1 : activeSlide)
      );
    }
  };

  // Function to update slide content
  const updateSlide = (index, field, value) => {
    const updatedSlides = [...slides];
    if (field === "category") {
      updatedSlides.forEach((slide) => {
        slide.category = value;
      });
    } else {
      updatedSlides[index][field] = value;
    }
    setSlides(updatedSlides);
  };

  const handlePost = async () => {
    // Validation: Ensure no field in any slide is empty
    for (const slide of slides) {
      if (!slide.heading || !slide.description || !slide.imageUrl) {
        alert(`Please fill in all fields for Slide ${slide.id}.`);
        return;
      }
    }

    const selectedCategory = slides[0].category;

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    const storyData = {
      createdBy: localStorage.getItem("currentUser"),
      category: selectedCategory,
      slides: slides.map(({ category, ...rest }) => rest),
    };

    try {
      let response;

      if (initialStoryData) {
        response = await axios.put(
          `${BACKEND_URL}/api/stories/${initialStoryData._id}`,
          storyData
        );
        alert("Story Updated Successfully");
        console.log(response.data);
      } else {
        response = await axios.post(
          `${BACKEND_URL}/api/stories/addNewStory`,
          storyData
        );
        alert("Story Posted Successfully");
        console.log(response.data);
      }

      // Clear all fields
      setSlides([
        { id: 1, heading: "", description: "", imageUrl: "", category: "" },
        { id: 2, heading: "", description: "", imageUrl: "", category: "" },
        { id: 3, heading: "", description: "", imageUrl: "", category: "" },
      ]);
      setActiveSlide(0);
      setIsAddingStory(false);
    } catch (error) {
      console.error("Error posting the story", error);
      alert("Failed to post the story");
    }
  };

  const handleCloseButton = () => {
    setIsAddingStory(false);
  };

  return (
    <div className="addstory-container">
      <div className="view-story-overlay" />
      <div className="addstory">
        <div className="slide-selector">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`slide-btn ${activeSlide === index ? "active" : ""}`}
              onClick={() => setActiveSlide(index)}
            >
              Slide {index + 1}
              {slide.id > 3 && (
                <>
                  <img
                    src={exit}
                    alt="exit icon"
                    className="remove-slide"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(index);
                    }}
                  />
                </>
              )}
            </button>
          ))}
          <button className="add-slide-btn" onClick={addSlide}>
            Add +
          </button>
          {!isMobile && (
            <span className="slide-limit-msg">Add up to 6 slides</span>
          )}
          <img
            src={exit}
            className="close-btn"
            alt="exit icon"
            onClick={handleCloseButton}
          />
        </div>

        <div className="story-handler">
          <div className="story-content">
            <div className="input-group">
              <label htmlFor="heading">Heading:</label>
              <input
                type="text"
                id="heading"
                value={slides[activeSlide].heading}
                onChange={(e) =>
                  handleSlideChange(activeSlide, "heading", e.target.value)
                }
                placeholder="Your heading"
              />
            </div>
            <div className="input-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={slides[activeSlide].description}
                onChange={(e) =>
                  handleSlideChange(activeSlide, "description", e.target.value)
                }
                placeholder="Story Description"
              ></textarea>
            </div>
            <div className="input-group">
              <label htmlFor="image">Image:</label>
              <input
                type="text"
                id="image"
                value={slides[activeSlide].imageUrl}
                onChange={(e) =>
                  handleSlideChange(activeSlide, "imageUrl", e.target.value)
                }
                placeholder="Add Image url"
              />
            </div>
            <div className="input-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={slides[0].category}
                onChange={(e) =>
                  updateSlide(activeSlide, "category", e.target.value)
                }
              >
                <option>Select category</option>
                <option>Medical</option>
                <option>Fruits</option>
                <option>World</option>
                <option>India</option>
              </select>
            </div>
          </div>

          <div className="story-navigation">
            {!isMobile && (
              <div className="nav-btn-container">
                <button
                  className="nav-btn previous"
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                >
                  Previous
                </button>
                <button
                  className="nav-btn next"
                  onClick={() =>
                    setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))
                  }
                  disabled={activeSlide === slides.length - 1}
                >
                  Next
                </button>
              </div>
            )}
            <button className="post-btn" onClick={handlePost}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStory;
