const http = require("http");
const fs = require("fs");
const PORT = 8000;

const myServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });

  fs.readFile("index.html", (error, data) => {
    if (error) {
      res.writeHead(404);
      res.write("Error:File not found.");
    } else {
      res.write(data);
    }
    res.end();
  });
});

myServer.listen(PORT, (error) => {
  if (error) {
    console.error("Something went wrong", error);
  } else {
    console.log(`Server running at http://localhost:${PORT}`);
  }
});
