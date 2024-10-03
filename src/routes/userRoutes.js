const express = require("express");
const {
  registerController,
  loginController,
  updateBookmark,
  updateLikes,
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
router.put("/updateLikes", updateLikes);
router.get("/getUserData", getUserData);
router.get("/:email/bookmarks", getUserBookmarkedStories);
router.get("/:email/bookmarksId", getUserBookmarkedStoriesID);
router.get("/:email/LikedId", getUserLikedStoriesID);
router.put("/updateLike", updateLike);
router.get("/:storyId/likeStatus", likeStatus);
router.put("/:storyId/toggleLike", toggleLike);

module.exports = router;
