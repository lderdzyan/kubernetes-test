const express = require("express");
const os = require("os");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Hello from backend",
    hostname: os.hostname(), 
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});