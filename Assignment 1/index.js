const http = require("http");
const PORT = 8000;

const myServer = http.createServer((req, res) => {
  res.end("Hello World");
});

myServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
