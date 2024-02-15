var express = require("express");
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
    res
		.status(200)
		.sendFile(path.join(__dirname, "/index.html"));
});
app.listen(3000, function () {
    console.log("The server is running at localhost:3000");
});