const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes.js");
const storiesRoutes = require("./src/routes/storiesRoutes.js");

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/stories", storiesRoutes);

const date = new Date();
const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Web Story Platform running",
    date: formattedDate,
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to MongoDB Server`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });
