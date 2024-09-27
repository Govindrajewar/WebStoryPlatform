const User = require("../models/userModels");
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

module.exports = {
  registerController,
  loginController,
};
