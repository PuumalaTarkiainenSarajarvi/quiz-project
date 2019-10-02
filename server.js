require('dotenv').config();
const { check, validationResult } = require('express-validator');

var cors = require("cors");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
var mongodb = require("mongodb");
var cors = require('cors')
var ObjectID = mongodb.ObjectID;

var CATEGORIES_COLLECTION = "categories";
var QUESTIONS_COLLECTION = "questions";
var ANSWERS_COLLECTION = "answers";
var HIGH_SCORES_COLLECTION = "high_scores";
var PERSONAL_HIGH_SCORES_COLLECTION = "personal_high_scores";
var SESSION_COLLECTION = "session";

var app = express();
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
  }));
app.use(cookieParser())


var db;


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



app.use(function (request, response, next) {
    response.header('X-XSS-Protection', 0);
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.header('Access-Control-Allow-Methods',  'POST, GET, PUT, OPTIONS');
    response.header('Access-Control-Allow-Credentials', 'true');
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
    var server = app.listen(process.env.PORT || 5000, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Generic error handler used by all endpoints.
function handleError(response, reason, message, code) {
    console.log("ERROR: " + reason);
    response.status(code || 500).json({ "error": message });
}

function validateSessionId(session_id) {
    return new Promise(function (resolve, reject) {
        db.collection(SESSION_COLLECTION).find({ _id: new ObjectID(session_id) })
            .toArray((err, result) => {
                if (result && result.length > 0) {
                    resolve(true)
                }
                else {
                    reject("Unauthorized")
                }
            })
    })
}
function updateScores(difficulty, status, session_id) {
    return new Promise(function (resolve, reject) {
        var score = 0;

        switch (difficulty) {
            case "easy":
                if (status) score = 5;
                else if (!status) score = -15;
                console.log("Question was ", difficulty, " user was ", status, " rewarding ", score);
                break;
            case "medium":
                if (status) score = 10;
                else if (!status) score = -10;
                console.log("Question was ", difficulty, " user was ", status, " rewarding ", score);
                break;
            case "hard":
                if (status) score = 15;
                else if (!status) score = -5;
                console.log("Question was ", difficulty, " user was ", status, " rewarding ", score);
                break;
        }
        db.collection(SESSION_COLLECTION).findOne(
            {
                _id: new ObjectID(session_id)
            }, function (err, result) {
                if (err) handleError(response, err.message, "Failed to get session data")
                else if (!Number.isInteger(result.current_score)) reject("Current score is corrupted")
                else {
                    
                    var newScore = result.current_score + score
                    if(newScore < 0) newScore = 0
                    db.collection(SESSION_COLLECTION).update({ _id: new ObjectID(session_id) }, { current_score: newScore }, () => {
                        resolve(newScore)
                    })

                }
            }
        );
    });

}

app.get("/api/get_all_high_scores", function (request, response) {
    db.collection(HIGH_SCORES_COLLECTION).find({},{fields:{nickname: 1, score: 1, timestamp:1,_id: 0}}).toArray(function (err, docs) {
        if (err) {
            handleError(response, err.message, "Failed to get high scores.");
        } else {
            response.status(200).json(docs)
        }
    });
});

app.post("/api/start_game_session", async function (request, response) {
    db.collection(SESSION_COLLECTION).insertOne({ 
        _id: new ObjectID(), 
        current_score: 0,
        createdAt: new Date()
    }, (err, result) => {
        if (result) {
            var dataToReturn = {
                session_id: result.insertedId
            }
            response.status(200).json(dataToReturn)
        }
        else if (err) {
            handleError(response, err.message, "Failed to start new game")
        }
    });
});
app.post("/api/get_personal_bests", function (request, response) {

    let email = request.body.email;
    if(email) {
        console.log("EMAILEMAIL", email);
        db.collection(PERSONAL_HIGH_SCORES_COLLECTION).find({ email })
            .toArray((err, result) => {
                if(err) {
                    handleError(response, err.message, "Failed to get high score");
                }
                if (result.length > 0) {
                    console.log("EMAIL FOUND", email);
                    response.status(200).json(result);
                }
                else {
                    response.status(404).json(result);
                }
            })
    }
});
app.use(function(req,res,next){
    if(!req.headers.authorization){
        
        return res.status(403).json("No authorization header")
    }
    console.log("AUTHORIZATION HEADER",req.headers.authorization)
    next();
});

app.post("/api/check_correct_answer",[
    check('question_id').isLength({ min: 24, max: 24 }),
    check('correct_answer').isString()
], async function (request, response) {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() })
    }

    var session_id = request.headers.authorization
    var _id = request.body.question_id
    validateSessionId(session_id).then(function (data) {
        if (data) {
            var correct_answer = request.body.correct_answer
            var dataToReturn;
            db.collection(QUESTIONS_COLLECTION).findOne(
                {
                    _id: new ObjectID(_id)
                }, function (err, result) {
                    if (err) handleError(response, err.message, "Failed to check correct answer")
                    else {
                        if (result.correct_answer === correct_answer) dataToReturn = { status: true }

                        else dataToReturn = { status: false }

                        updateScores(result.difficulty, dataToReturn.status, session_id).then((data) => {
                            dataToReturn.current_score = data
                            response.status(200).json(dataToReturn)
                        })

                    }
                }
            );
        }
        else {
            response.status(401).send({status: "Authentication failed"})
        }

    }).catch((error)=>{
        handleError(error)
    })

});

app.get("/api/get_random_question", function (request, response) {

    var session_id = request.headers.authorization
        validateSessionId(session_id).then(function(data){
            console.log("SESSION VALIDATED")
            if(data){
                db.collection(QUESTIONS_COLLECTION).aggregate([{ $sample: { size: 1 } }]).toArray(function (err, result) {
                    if (err) {
                        handleError(response, err.message, "Failed to get random question")
                    }
                    else {
                        let answers = [result[0].correct_answer, result[0].incorrect_answers[0], result[0].incorrect_answers[1], result[0].incorrect_answers[2]]
                        answers = shuffle(answers)
                        const responseData = {
                            _id: result[0]._id,
                            category: result[0].category,
                            difficulty: result[0].difficulty,
                            question: result[0].question,
                            answers
                        }
                        response.status(200).json(responseData)
                    }
                });
            }
        }).catch((error)=>{
            response.status(403).send({status: "Unauthorized"})
            handleError(error)
        })
});

app.post("/api/post_high_score_info", [
    check('email').isEmail(),
    check('nickname').isString({ min: 4 })
], async function (request, response) {

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() })
    }
    var session_id = request.headers.authorization
    var email = request.body.email
    var nickname = request.body.nickname
    var score;

    var getCurrentScore = new Promise((resolve, reject) => {
        db.collection(SESSION_COLLECTION).findOne(
            {
                _id: new ObjectID(session_id)
            }, function (err, result) {
                if (err) {
                    handleError(response, err.message, "Failed to check correct answer")
                    reject()
                }

                else {
                    score = result.current_score
                    resolve(score)}
            }
        )
    });
    getCurrentScore.then((score) => {
        db.collection(PERSONAL_HIGH_SCORES_COLLECTION).findOne({ email: email }, function (err, result) {
            if (err) {
                handleError(err)
            }
            else if (result != null) {          
                var smallestScore;
                var smallestIndex;
                if (result.tenBestScores.length == 10) {
                    var newScoreArray = result.tenBestScores
                    newScoreArray.forEach((arrayScore, index) => {
                        if (smallestScore === undefined) {
                            smallestScore = arrayScore.score
                            smallestIndex = index
                        }
                        else if (smallestScore > arrayScore.score) {
                            smallestScore = arrayScore.score
                            smallestIndex = index
                        }
                    });

                    newScoreArray[smallestIndex].score = score
                    newScoreArray[smallestIndex].date = new Date()
                    db.collection(PERSONAL_HIGH_SCORES_COLLECTION).updateOne(
                        { email: email },
                        { $set: { tenBestScores: newScoreArray } }, (err, res) => {
                            if (err) handleError(err.message)
                            else {
                                response.status(200).send({status: "Succesfully updated high scores"})
                            }
                        });
                }

                else if(result.tenBestScores.length < 10){
                    var newScoreArray = result.tenBestScores
                    newScoreArray.push({score: score, date: new Date()})
                    db.collection(PERSONAL_HIGH_SCORES_COLLECTION).updateOne(
                        { email: email },
                        { $set: { tenBestScores: newScoreArray } }, (err, res) => {
                            if (err) handleError(err.message)
                            else {
                                response.status(200).send({status: "Succesfully inserted new high score"})
                            }
                        });
                }



            }
            else {
                console.log("RESULT",result)
                db.collection(PERSONAL_HIGH_SCORES_COLLECTION).insertOne(
                    {
                        email: email,
                        nickname: nickname,
                        tenBestScores: [{
                            score: score,
                            date: new Date()
                        }]
                    })
                    var responseString = "Created new high scores for email "+email
                    response.status(200).json({status: responseString})
                    db.collection(HIGH_SCORES_COLLECTION).insertOne({
                        nickname: nickname,
                        score: score,
                        timestamp: new Date()
                    })
            }
        });
    }).catch((err) => {
            console.log(err)
        });

});




