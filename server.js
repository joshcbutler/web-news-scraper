//Dependencies
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static directory
app.use(express.static("public"));

// set up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// DB config with mongoose
mongoose.connect("mongodb://heroku_g5hnxs79:4goisqhn82ubkla435abp94ug7@ds157571.mlab.com:57571/heroku_g5hnxs79");
var db = mongoose.connection;

// Show mongoose errors
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// Log success message once logged into db through mongoose
db.on("open", function () {
    console.log("Mongoose connection successful.");
});

//Routes
app.get("/", function (req, res) {
    res.render("default");
});

app.post("/save", function (req, res) {
    var articleParam = {
        title: req.params.title,
        link: req.params.link
    };

    var entry = new Article(articleParam);
    entry.save(function (err, mongoRes) {
        if (err) {
            console.log(err);
            res.sendStatus(404);
        } else {
            console.log(mongoRes);
        }
        res.end();
    });    
});

// Get request to scrape theverge website
app.get("/scrape", function (req, res) {
    request("http://www.theverge.com/tech", function (error, response, html) {
        var $ = cheerio.load(html);

        var results = $("div.c-entry-box--compact__body h2 a").map(function (i, element) {
            var result = {};

            result.title = $(this).text();
            result.link = $(this).attr("href");

            return result;
        }).get();

        res.render("index", { layout: false, articles: results });
    });
});

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});


