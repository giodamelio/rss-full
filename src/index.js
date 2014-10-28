var express = require("express");

var app = express();

app.get("/", function(req, res) {
    res.send("Hello World");
});

app.listen(3141);
console.log("App is running at http://localhost:3141");

