var fs = require("fs");
var path = require("path");

var express = require("express");

var app = express();

// Serve homepage
app.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname, "../home.html"));
});

app.listen(3141);
console.log("App is running at http://localhost:3141");

