const express = require("express");
const {
  addNewStory,
  updateStory,
  getAllStories,
  getStoriesByCategory,
  getStoriesByUser,
  getStoryById,
  getStorySlideByNumber,
} = require("../controllers/storiesControllers.js");

const router = express.Router();

router.post("/addNewStory", addNewStory);
router.put("/:id", updateStory);
router.get("/allStories", getAllStories);
router.get("/category/:category", getStoriesByCategory);
router.get("/user/:userEmail", getStoriesByUser);
router.get("/:storyId", getStoryById);
router.get("/:storyId/slide/:slideNumber", getStorySlideByNumber);

module.exports = router;
