const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const storySchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  category: { type: String, required: true },
  slides: [slideSchema],
  likedBy: { type: [String], default: [] },  // List of users who liked the story
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
