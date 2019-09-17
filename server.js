require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CATEGORIES_COLLECTION = "categories";
var QUESTIONS_COLLECTION = "questions";
var ANSWERS_COLLECTION = "answers";
var HIGH_SCORES_COLLECTION = "high_scores";
var GAME_SESSIONS_COLLECTION = "game_sessions";

var app = express();
app.use(bodyParser.json());

var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get("/api/check_correct_answer", function (req, res) {
    res.status(200);
    // return points
});

app.get("/api/get_random_question", function (req, res) {
    // return random question
});

app.put("/api/put_high_score_info", function (req, res) {
    // put high score
});

app.get("/api/get_all_high_scores", function (req, res) {
    db.collection(HIGH_SCORES_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get high scores.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/api/get_personal_bests", function (req, res) {
    // return personal bests
});

app.put("/api/start_game_session", function (req, res) {

});