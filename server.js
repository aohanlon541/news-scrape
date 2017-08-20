var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var logger = require("morgan");
var cheerio = require("cheerio");



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


request("https://www.nytimes.com/section/technology?WT.nav=page&action=click&contentCollection=Tech&module=HPMiniNav&pgtype=Homepage&region=TopBar", function(error, response, html) {
    var $ = cheerio.load(html);
    var results = [];
    $("h2.headline").each(function(i, element) {
        var title = $(element).text();
        var link = $(element).children().attr("href");

        $("p.summary").each(function(i, element) {
            var summary = $(element).text();

            results.push({
                title: title,
                link: link,
                summary: summary
            });
        });
    });
    console.log(results);
});


app.listen(3080, function() {
    console.log("App running on port 3080!");
});