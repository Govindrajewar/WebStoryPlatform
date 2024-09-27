const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  category: { type: String, required: true },
  slides: [
    {
      id: { type: Number, required: true },
      heading: { type: String, required: true },
      description: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
  ],
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
