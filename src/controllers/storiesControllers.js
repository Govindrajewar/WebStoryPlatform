const Story = require("../models/StoriesModels.js");

// add new story
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

// fetch all stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

module.exports = {
  addNewStory,
  getAllStories,
};
