const express = require("express");
const {
  addNewStory,
  updateStory, // Import the update function
  getAllStories,
  getStoriesByCategory,
  getStoriesByUser,
} = require("../controllers/storiesControllers.js");

const router = express.Router();

router.post("/addNewStory", addNewStory);
router.put("/:id", updateStory); // Add PUT route for updating a story
router.get("/allStories", getAllStories);
router.get("/category/:category", getStoriesByCategory);
router.get("/user/:userEmail", getStoriesByUser);

module.exports = router;
