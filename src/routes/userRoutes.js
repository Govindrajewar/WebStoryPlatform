const express = require("express");
const {
  registerController,
  loginController,
  updateBookmark,
  getUserData,
  getUserBookmarkedStories,
  updateLike,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/updateBookmark", updateBookmark);
router.get("/getUserData", getUserData);
router.get("/:email/bookmarks", getUserBookmarkedStories);
router.put("/updateLike", updateLike);

module.exports = router;
