const Story = require("../models/StoriesModels.js");

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

module.exports = {
  addNewStory,
};
