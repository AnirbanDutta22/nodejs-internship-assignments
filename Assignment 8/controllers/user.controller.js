const User = require("../models/user.model");
const {
  AppError,
  ValidationError,
  NotFoundError,
} = require("../errors/errorHandler");

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
    throw new AppError(500, "Access token, refresh token generation failed !");
  }
};

//register user
const register = async (req, res, next) => {
  const { name, email, password, age } = req.body;

  //checking if any field is unfilled
  if (!name || !email || !password || !age) {
    throw new ValidationError("All fields are required !");
  }

  //checking if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, "User already exists !");
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
    throw new AppError(500);
  }
  return res
    .status(200)
    .send({ mesage: "User registered successfully", user: createdUser });
};

//login user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  //checking if any field is unfilled
  if (!email || !password) {
    throw new ValidationError("All fields are required !");
  }

  //checking if the user exists or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User doesn't exist ! Please signup !");
  }

  //checking if given password is valid
  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    throw new AppError(409, "Invalid user login credentials !");
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
};

//logout user
const logout = async (req, res, next) => {
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
};

// Get authenticated user
const getUser = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Update a user by ID
const updateUser = async (req, res) => {
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
};

// Delete the authenticated user's profile
const deleteUser = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(200, { message: "User removed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//upload avatar for authenticated user's profile
const uploadAvatar = async (req, res) => {
  try {
    req.user.avatar = req.file.path;
    await req.user.save();
    res.send(200, { message: "User avatar updated successfully !" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
};
