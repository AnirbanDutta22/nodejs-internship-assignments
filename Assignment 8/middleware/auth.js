const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    // const token =
    //   req.cookies?.accessToken ||
    //   req.header("Authorization")?.replace("Bearer ", "");

    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).send({ error: "Unauthorized user !" });
      return;
    }

    //verifying token using jwt
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //finding the user
    const user = await User.findById(decodedToken?.id).select("-refreshToken");

    //checking if the user exists
    if (!user) {
      res.status(401).send({ error: "Invalid access token ! user not exists" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid access token !" });
  }
};

module.exports = auth;
