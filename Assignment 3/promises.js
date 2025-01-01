const fs = require("fs").promises;

// Function to read a file using Promises
async function readFileAsync(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    throw new Error(`Error reading file: ${err.message}`);
  }
}

// Function to process a file using async/await
async function processFile(filePath) {
  try {
    const data = await readFileAsync(filePath);
    console.log("File content:", data);
    return data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Usage
(async () => {
  try {
    const data = await processFile("example.txt");
    console.log("File processed successfully:", data);
  } catch (err) {
    console.error("Error processing file:", err);
  }
})();
