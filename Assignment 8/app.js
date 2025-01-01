const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//local import
const userRouter = require("./routes/user.route");
const defaultErrorHandler = require("./middleware/defaultErrorHandler");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/users", userRouter);

//error handling
app.use(defaultErrorHandler);

module.exports = app;
