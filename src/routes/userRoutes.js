const express = require("express");
const { 
registerController, 
loginController,
updateBookmark,
getUserData,
getUserBookmarkedStories,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/updateBookmark", updateBookmark);
router.get("/getUserData", getUserData);
router.get("/:email/bookmarks", getUserBookmarkedStories);

module.exports = router;
