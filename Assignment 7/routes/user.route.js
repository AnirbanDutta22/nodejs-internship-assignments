const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
// const { Error } = require("mongoose");
const auth = require("../middleware/auth");

//access token refresh token generating utility method
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    res
      .status(500)
      .send({ error: "Access token, refresh token generation failed !" });
  }
};

//register user
router.post("/signup", async (req, res, next) => {
  const { name, email, password, age } = req.body;

  //checking if any field is unfilled
  if (!name || !email || !password || !age) {
    res.status(400).send({ error: "All fields required" });
    return;
  }

  //checking if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).send({ error: "User already exists !" });
    return;
  }

  //creating new user
  const user = await User.create({
    name,
    email,
    password,
    age,
  });

  //checking if user is created successfully
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    res.status(500).send({ error: "Something went wrong" });
    return;
  }
  return res
    .status(200)
    .send({ mesage: "User registered successfully", user: createdUser });
});

//login user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  //checking if any field is unfilled
  if (!email || !password) {
    res.status(400).send({ error: "All fields are required" });
    return;
  }

  //checking if the user exists or not
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send({ error: "User doesn't exist ! Please sign up !" });
    return;
  }

  //checking if given password is valid
  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    res.status(409).send({ error: "Invalid login credentials" });
    return;
  }

  //generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  //fetching logged in user
  const loggedInUser = await User.findById(user._id).select("-refreshToken");

  //configuring cookie options
  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send({ message: "User logged in successfully", user: loggedInUser });
});

//logout user
router.post("/logout", auth, async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send({ message: "User logged Out" });
});

// Get authenticated user
router.get("/me", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Update a user by ID
router.patch("/me", auth, async (req, res) => {
  res.user = req.user;
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.age != null) {
    res.user.age = req.body.age;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete the authenticated user's profile
router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(200, { message: "User removed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
