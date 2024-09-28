const express = require("express");
const {
  addNewStory,
  getAllStories,
  getStoriesByCategory,
} = require("../controllers/storiesControllers.js");

const router = express.Router();

router.post("/addNewStory", addNewStory);
router.get("/allStories", getAllStories);
router.get("/category/:category", getStoriesByCategory);

module.exports = router;
