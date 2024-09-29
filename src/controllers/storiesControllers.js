const Story = require("../models/StoriesModels.js");

// Add a new story
const addNewStory = async (req, res) => {
  try {
    const newStory = new Story(req.body);
    await newStory.save();
    res
      .status(201)
      .json({ message: "Story created successfully", story: newStory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create story" });
  }
};

// Update an existing story
const updateStory = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedStory = await Story.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ message: "Story updated successfully", story: updatedStory });
  } catch (error) {
    res.status(500).json({ error: "Failed to update story" });
  }
};

// Fetch all stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// Fetch stories by category
const getStoriesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const stories = await Story.find({ category });
    if (stories.length > 0) {
      res.status(200).json(stories);
    } else {
      res.status(404).json({ message: "No stories found for this category" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories by category" });
  }
};

// Fetch stories by user
const getStoriesByUser = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const stories = await Story.find({ createdBy: userEmail });
    if (stories.length > 0) {
      res.status(200).json(stories);
    } else {
      res.status(404).json({ message: "No stories found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user stories" });
  }
};

module.exports = {
  addNewStory,
  updateStory,
  getAllStories,
  getStoriesByCategory,
  getStoriesByUser,
};
