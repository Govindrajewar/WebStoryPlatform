const User = require("../models/UserModels.js");
const Story = require("../models/StoriesModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "5d",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({
      success: false,
      message: `Error occurred: ${error.message}`,
    });
  }
};

// Add/Remove Bookmark Controller
const updateBookmark = async (req, res) => {
  const { storyId, userEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error("User not found:", userEmail);
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id !== storyId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Bookmark removed successfully." });
    } else {
      user.bookmarks.push(storyId);
      await user.save();
      return res.status(200).json({ message: "Bookmark added successfully." });
    }
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return res.status(500).json({ message: "Failed to update bookmark." });
  }
};

// Handle Like Button Controller
const handleLikeButton = async (req, res) => {
  const { storyId, userEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error("User not found:", userEmail);
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = user.likedStories.includes(storyId);
    if (isLiked) {
      user.likedStories = user.likedStories.filter((id) => id !== storyId);
      await user.save();
      return res.status(200).json({ message: "Like removed successfully." });
    } else {
      user.likedStories.push(storyId);
      await user.save();
      return res.status(200).json({ message: "Like added successfully." });
    }
  } catch (error) {
    console.error("Error updating like:", error);
    return res.status(500).json({ message: "Failed to update like." });
  }
};

// Fetch all users data excluding Password
const getUserData = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch user data. Please try again." });
  }
};

// Fetch all saved bookmarks by user
const getUserBookmarkedStories = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any bookmarks
    if (!user.bookmarks || user.bookmarks.length === 0) {
      return res.status(200).json([]);
    }

    const bookmarkedStories = await Story.find({
      _id: { $in: user.bookmarks },
    });

    return res.status(200).json(bookmarkedStories);
  } catch (error) {
    console.error("Error fetching bookmarked stories:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch bookmarked stories" });
  }
};

const getUserBookmarkedStoriesID = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserLikedStoriesID = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ likedStories: user.likedStories });
  } catch (error) {
    console.error("Error fetching user Likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add/Remove Like Story
const updateLike = async (req, res) => {
  const { storyId, userEmail } = req.body;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isLiked = story.likedBy.includes(userEmail);
    if (isLiked) {
      story.likes -= 1;
      story.likedBy = story.likedBy.filter((email) => email !== userEmail);
      await story.save();
      return res.status(200).json({
        message: "Like removed successfully.",
        isLiked,
      });
    } else {
      story.likes += 1;
      story.likedBy.push(userEmail);
      await story.save();
      return res.status(200).json({
        message: "Story liked successfully.",
        isLiked,
      });
    }
  } catch (error) {
    console.error("Error updating like:", error);
    return res.status(500).json({ message: "Failed to update like." });
  }
};

const likeStatus = async (req, res) => {
  const { storyId } = req.params;
  const userEmail = req.query.userEmail;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isLikedByUser = story.likedBy.includes(userEmail);
    const likeCount = story.likedBy.length;

    res.json({ isLikedByUser, likes: likeCount });
  } catch (error) {
    console.error("Error fetching like status:", error);
    res.status(500).json({ message: "Failed to fetch like status" });
  }
};

const toggleLike = async (req, res) => {
  const { storyId } = req.params;
  const { userEmail } = req.body;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const userIndex = story.likedBy.indexOf(userEmail);
    if (userIndex === -1) {
      // User hasn't liked the story yet, so like it
      story.likedBy.push(userEmail);
    } else {
      // User already liked the story, so unlike it
      story.likedBy.splice(userIndex, 1);
    }

    await story.save();
    const updatedLikeCount = story.likedBy.length;
    const isLiked = userIndex === -1;

    res.json({ isLiked, likeCount: updatedLikeCount });
  } catch (error) {
    console.error("Error toggling like status:", error);
    res.status(500).json({ message: "Failed to toggle like status" });
  }
};

module.exports = {
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
};
