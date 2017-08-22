var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var logger = require("morgan");
var cheerio = require("cheerio");

var Article = require("./models/articles.js");

mongoose.Promise = Promise;


var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/news-scraper");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.get("/scrape", function(req, res) {

request("https://www.nytimes.com/section/technology?WT.nav=page&action=click&contentCollection=Tech&module=HPMiniNav&pgtype=Homepage&region=TopBar", function(error, response, html) {
    var $ = cheerio.load(html);
    $("h2.headline").each(function(i, element) {

        var result = {};

        result.title = $(element).text();
        result.link = $(element).children().attr("href");
        result.summary = $(element).next().text();

            var entry = new Article(result);
        
            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                console.log(err);
                }
                // Or log the doc
                else {
                console.log(doc);
                }
            });
        });
    });
});

app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});




app.listen(3080, function() {
    console.log("App running on port 3080!");
});