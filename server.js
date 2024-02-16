// var express = require("express");
// var app = express();
// var path = require("path");

// app.use(express.static(path.join(__dirname)));

// app.get("/", function (req, res) {
//     res
// 		.status(200)
// 		.sendFile(path.join(__dirname, "/index.html"));
// });
// app.listen(3000, function () {
//     console.log("The server is running at localhost:3000");
// });




const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
