require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CATEGORIES_COLLECTION = "categories";
var QUESTIONS_COLLECTION = "questions";
var ANSWERS_COLLECTION = "answers";
var HIGH_SCORES_COLLECTION = "high_scores";
var SESSION_COLLECTION = "session";

var app = express();
app.use(bodyParser.json());

var db;


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

app.use(function(request, response, next) {
    response.header('X-XSS-Protection', 0);
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

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
function handleError(response, reason, message, code) {
    console.log("ERROR: " + reason);
    response.status(code || 500).json({ "error": message });
}


function validateSessionId(session_id){
    db.collection(SESSION_COLLECTION).find({_id: new ObjectID(session_id)})
    .toArray((err, result)=>{
        if(result &&result.length > 0){
            console.log(result[0])
        }
        else{
            console.log("ID INVALID")
        }
    })
}



app.post("/api/check_correct_answer", function (request, response) {
    //var session_id = request.body.session_id
    //validateSessionId(session_id)
    var _id = request.body._id
    var correct_answer = request.body.correct_answer
    console.log("ID ",_id)
    db.collection(QUESTIONS_COLLECTION).findOne(
        {
            _id: new ObjectID(_id)
        }, function(err, result){
        if(err) handleError(response, err.message, "Failed to check correct answer")
        else{
            if(result.correct_answer === correct_answer)response.status(200).json("true")
            else response.status(200).json("false")
        }
    });
});

app.get("/api/get_random_question", function (request, response) {
    db.collection(QUESTIONS_COLLECTION).aggregate([{$sample: {size: 1}}]).toArray(function(err, result){
        if(err){
            handleError(response, err.message, "Failed to get random question")
        }
        else{
            let answers = [result[0].correct_answer, result[0].incorrect_answers[0], result[0].incorrect_answers[1], result[0].incorrect_answers[2]]
            answers = shuffle(answers)
            const response = {
                _id: result[0]._id,
                category: result[0].category,
                difficulty: result[0].difficulty,
                question: result[0].question,
                answers
            }
            response.status(200).json(response)
        }
    });
});

app.put("/api/put_high_score_info", function (request, response) {
    // put high score
});

app.get("/api/get_all_high_scores", function (request, response) {
    db.collection(HIGH_SCORES_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(response, err.message, "Failed to get high scores.");
        } else {
            response.status(200).json(docs);
        }
    });
});

app.get("/api/get_personal_bests", function (request, response) {
    // return personal bests
});

app.put("/api/start_game_session", function (request, response) {

});