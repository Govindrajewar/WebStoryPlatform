const express = require("express");
const { addNewStory } = require("../controllers/storiesControllers.js");

const router = express.Router();

router.post("/addNewStory", addNewStory);

module.exports = router;
