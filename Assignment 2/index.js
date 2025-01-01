const fs = require("fs");
const path = require("path");

// Function to create a new file
function createFile(fileName, content) {
  fs.writeFile(fileName, content, (error) => {
    if (error) {
      console.error("Error creating file:", error);
      return;
    }
    console.log(`${fileName} created successfully.`);
  });
}

// Function to read a file
function readFile(fileName) {
  fs.readFile(fileName, "utf8", (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }
    console.log(`Contents of ${fileName}:`);
    console.log(data);
  });
}

// Function to update a file
function updateFile(fileName, newContent) {
  fs.writeFile(fileName, content, (err) => {
    if (err) {
      console.error("Error updating file:", err);
      return;
    }
    console.log(`${fileName} updated successfully.`);
  });
}

// Function to delete a file
function deleteFile(fileName) {
  fs.unlink(fileName, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log(`${fileName} deleted successfully.`);
  });
}

// Test the file management functions
const fileName = "index.html";
const generateContent = (newContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic HTML File</title>
</head>
<body>
    <h1>${newContent}!</h1>
</body>
</html>
`;
const initialContent = "Hello this is test html file";

/*Update your content here */
const updatedContent = "Hello this is updated test html file !";

/*Just change the parameter in function generateContent as you want*/
const content = generateContent(initialContent);

// createFile(fileName, content);

/*Read content of the file in console*/
// readFile(fileName);

// updateFile(fileName, content);

/*Read updated content of the file in console*/
// readFile(fileName);

// deleteFile(fileName);
