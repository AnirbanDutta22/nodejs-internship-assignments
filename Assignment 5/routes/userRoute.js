const express = require("express");
const router = express.Router();
const UserData = require("../models/userData");

// Create a new user data
router.post("/", async (req, res) => {
  const data = new UserData({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    const newUserData = await data.save();
    res.status(201).json(newUserData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all user datas
router.get("/", async (req, res) => {
  try {
    const data = await UserData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user data
router.get("/:id", getUserData, (req, res) => {
  res.json(res.data);
});

// Update a data
router.patch("/:id", getUserData, async (req, res) => {
  if (req.body.title != null) {
    res.data.title = req.body.title;
  }
  if (req.body.content != null) {
    res.data.content = req.body.content;
  }
  try {
    const updatedData = await res.data.save();
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a data
router.delete("/:id", getUserData, async (req, res) => {
  try {
    const data = await UserData.findByIdAndDelete(req.params.id);
    if (data == null) {
      return res.status(404).json({ message: "Cannot find entry" });
    }
    res.json({ message: "Deleted Entry" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get user data by ID
async function getUserData(req, res, next) {
  let data;
  try {
    data = await UserData.findById(req.params.id);
    if (data == null) {
      return res.status(404).json({ message: "Cannot find entry" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.data = data;
  next();
}

module.exports = router;
