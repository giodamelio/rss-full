module.exports.name = "medium";
module.exports.path = "/medium/:username";
module.exports.transformer = function(req, res) {
    res.send("Hello World");
};

