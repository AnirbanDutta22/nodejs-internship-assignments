const fs = require("fs");

function readFileCallback(filePath, callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, data);
  });
}

function processFile(filePath, callback) {
  readFileCallback(filePath, (err, data) => {
    if (err) {
      return callback(err);
    }
    console.log("File content:", data);
    callback(null, data);
  });
}

// Usage
processFile("example.txt", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  } else {
    console.log("File processed successfully:", data);
  }
});
