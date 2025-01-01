require("dotenv").config();
const express = require("express");
const app = require("./app");
const connectDB = require("./db/config");
const mongoose = require("mongoose");

const PORT = 8000;

//database connection
connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
  )
  .catch((err) => {
    console.log("MOngo DB connection failed", err);
  });
