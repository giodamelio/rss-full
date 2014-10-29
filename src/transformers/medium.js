var request = require("request");
var async = require("async");
var rss = require("rss");
var cheerio = require("cheerio");
var xml2js = require("xml2js");

module.exports.name = "medium";
module.exports.path = "/medium/:username";
module.exports.transformer = function(req, res) {
    // Get the feed url
    var feedUrl;
    if (req.param("username")[0] === "@") {
        feedUrl = "https://medium.com/feed/" + req.param("username");
    } else {
        feedUrl = "https://medium.com/feed/@" + req.param("username");
    }

    // Request the feed
    request.get(feedUrl, function(error, response, body) {
        replaceDiscription(body, function(err, feed) {
            res.send(feed);
        });
    });
};

// Replace short discription with full one
var replaceDiscription = function(originalDescription, callback) {
    xml2js.parseString(originalDescription, function(err, json) {
        // Get orignal feed data
        var orignalFeed = json.rss.channel[0];

        // Add all the info to the feed
        var feed = new rss({
            title: orignalFeed.title[0],
            description: orignalFeed.description[0],
            site_url: orignalFeed.link[0],
            webMaster: orignalFeed.webMaster[0]
        });

        // Loop through items and replace with full content
        async.map(orignalFeed.item, function(item, callback) {
            // Get the items full content
            getPostContent(item, function(err, item) {
                callback(null, item);
            });
        }, function(err, items) {
            // Loop through the items and add them to the feed
            for (var i in items) {
                feed.item({
                    title: items[i].title[0],
                    description: items[i].description[0],
                    url: items[i].link[0],
                    guid: items[i].guid[0]._,
                    date: items[i].pubDate[0],
                    author: items[i]["dc:creator"][0]
                });
            }

            // Return the content to the request
            callback(null, feed.xml("  "));
        });
    });
};

// Get the full html from a medium url
var getPostContent = function(item, callback) {
    // Request the main page
    request.get(item.link[0], function(error, response, body) {
        // Parse with cheerio and get the main content
        var $ = cheerio.load(body);
        item.description = [$(".section--last").html()];
        callback(null, item);
    });
};

