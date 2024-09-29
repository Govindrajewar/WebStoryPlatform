const User = require("../models/UserModels.js");
const Story = require("../models/StoriesModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({
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
    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        details: error.errors,
      });
    }

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "5d",
    });

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).send({
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
      return res.status(200).json({ message: "Like removed successfully." });
    } else {
      story.likes += 1;
      story.likedBy.push(userEmail);
      await story.save();
      return res.status(200).json({ message: "Story liked successfully." });
    }
  } catch (error) {
    console.error("Error updating like:", error);
    return res.status(500).json({ message: "Failed to update like." });
  }
};

module.exports = {
  registerController,
  loginController,
  updateBookmark,
  getUserData,
  getUserBookmarkedStories,
  updateLike,
};
