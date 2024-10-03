const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bookmarks: { type: [String], default: [] },
  likedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
});

const User = mongoose.model("WebUser", UserSchema);

module.exports = User;
