const express = require("express");
const {
  addNewStory,
  getAllStories,
} = require("../controllers/storiesControllers.js");

const router = express.Router();

router.post("/addNewStory", addNewStory);
router.get("/allStories", getAllStories);

module.exports = router;
