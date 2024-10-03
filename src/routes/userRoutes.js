const express = require("express");
const {
  registerController,
  loginController,
  updateBookmark,
  handleLikeButton,
  getUserData,
  getUserBookmarkedStories,
  getUserBookmarkedStoriesID,
  getUserLikedStoriesID,
  updateLike,
  likeStatus,
  toggleLike,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/updateBookmark", updateBookmark);
router.put("/handleLikeButton", handleLikeButton);
router.get("/getUserData", getUserData);
router.get("/:email/bookmarks", getUserBookmarkedStories);
router.get("/:email/bookmarksId", getUserBookmarkedStoriesID);
router.get("/:email/likedId", getUserLikedStoriesID);
router.put("/updateLike", updateLike);
router.get("/:storyId/likeStatus", likeStatus);
router.put("/:storyId/toggleLike", toggleLike);

module.exports = router;
