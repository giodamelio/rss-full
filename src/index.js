var fs = require("fs");
var path = require("path");

var express = require("express");

var app = express();

// Serve homepage
app.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname, "../home.html"));
});

// Serve transformers
var transformerRouter = express.Router();
var transformerFiles = fs.readdirSync(path.join(__dirname, "transformers"));
for (var i in transformerFiles) {
    var transformer = require(path.join(__dirname, "transformers", transformerFiles[i]));
    transformerRouter.get(transformer.path, transformer.transformer);
}
app.use("/t", transformerRouter);

// Handle undefined transformers
app.get("/t/*", function(req, res) {
    res.send("Transformer not found");
});

var PORT = process.env.PORT || 3141;
app.listen(PORT);
console.log("App is running at http://localhost:" + PORT);

