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

module.exports = {
  addNewStory,
  getAllStories,
  getStoriesByCategory,
};
