const express = require("express");
const path = require("path");
const app = express();
const PORT = 8000;

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Home page route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// About page route
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Error handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error.html"));
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Something went wrong", error);
  } else {
    console.log(`Server running at http://localhost:${PORT}`);
  }
});
