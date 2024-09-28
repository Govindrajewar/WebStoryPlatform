const express = require("express");
const {
  addNewStory,
  getAllStories,
  getStoriesByCategory,
  getStoriesByUser,
} = require("../controllers/storiesControllers.js");

const router = express.Router();

router.post("/addNewStory", addNewStory);
router.get("/allStories", getAllStories);
router.get("/category/:category", getStoriesByCategory);
router.get("/user/:userEmail", getStoriesByUser);

module.exports = router;
