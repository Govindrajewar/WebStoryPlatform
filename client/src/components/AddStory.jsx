import React, { useState } from "react";
import "../style/components/AddStory.css";
import exit from "../assets/Register/exit.jpg";

function AddStory({ setIsAddingStory }) {
  const [slides, setSlides] = useState([
    { id: 1, heading: "", description: "", imageUrl: "", category: "" },
    { id: 2, heading: "", description: "", imageUrl: "", category: "" },
    { id: 3, heading: "", description: "", imageUrl: "", category: "" },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);

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
          category: slides[0].category, // Apply the category of the first slide to new slides
        },
      ]);
    } else {
      alert("You can add up to 6 slides only.");
    }
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
      setActiveSlide(Math.max(0, activeSlide > index ? activeSlide - 1 : activeSlide));
    }
  };

  // Function to update slide content
  const updateSlide = (index, field, value) => {
    const updatedSlides = [...slides];

    if (field === "category") {
      // Update category for all slides when it changes
      updatedSlides.forEach((slide) => {
        slide.category = value;
      });
    } else {
      updatedSlides[index][field] = value;
    }

    setSlides(updatedSlides);
  };

  const handlePost = () => {
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

    // Post the story
    alert("Story Posted");
    console.log(JSON.stringify(storyData, null, 2));

    // Clear all fields
    setSlides([
      { id: 1, heading: "", description: "", imageUrl: "", category: "" },
      { id: 2, heading: "", description: "", imageUrl: "", category: "" },
      { id: 3, heading: "", description: "", imageUrl: "", category: "" },
    ]);
    setActiveSlide(0);
    setIsAddingStory(false);
  };

  const handleCloseButton = () => {
    setIsAddingStory(false);
  };

  return (
    <div className="addstory">
      <div className="slide-selector">
        {slides.map((slide, index) => (
          <button
            key={index}
            className={`slide-btn ${index === activeSlide ? "active" : ""}`}
            onClick={() => setActiveSlide(index)}
          >
            {`Slide ${slide.id}`}

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
        <span className="slide-limit-msg">Add up to 6 slides</span>
        <img
          src={exit}
          className="close-btn"
          alt="exit icon"
          onClick={handleCloseButton}
        />
      </div>

      <div className="story-content">
        <div className="input-group">
          <label htmlFor="heading">Heading:</label>
          <input
            type="text"
            id="heading"
            value={slides[activeSlide].heading}
            onChange={(e) =>
              updateSlide(activeSlide, "heading", e.target.value)
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
              updateSlide(activeSlide, "description", e.target.value)
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
              updateSlide(activeSlide, "imageUrl", e.target.value)
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
            <option>food</option>
            <option>health and fitness</option>
            <option>travel</option>
            <option>movies</option>
            <option>education</option>
          </select>
        </div>
      </div>

      <div className="story-navigation">
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
        <button className="post-btn" onClick={handlePost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default AddStory;
