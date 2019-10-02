import React, { Component } from "react"
import ClockForGame from "./ClockForGame";
import {Button, Card} from "react-bootstrap";

class QuizGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            gameOver: false,
            questionId: undefined,
            question: undefined,
            answers: undefined,
            category: undefined,
            difficulty: undefined,
            points: 0,
            sessionId: undefined,
        }
    }
    componentDidMount(){
        let sessionId = sessionStorage.getItem('session_id');

        this.startGameSession();
        this.checkIfSessionIsValid();
    }

    startGameSession() {
        console.log("START");
        let urlAddress = "http://localhost:5000/api/start_game_session";
        fetch(urlAddress, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'

            },
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
                console.log("DATA", data);
                if(data.hasOwnProperty('session_id'))
                    sessionStorage.setItem('session_id', data.session_id);
                this.props.history.push('/quizgame');
            })
            .catch((error) => {
                console.log(error);
                alert("Try again :)");
            });
    }


    async checkIfSessionIsValid() {
        let sessionId = sessionStorage.getItem('session_id');
        if (sessionId) {
            this.setState({
                sessionId: sessionId
            });
            await this.getRandomQuestion();
        } else {
            this.props.history.push('/');
        }
        console.log("SESSIONID", sessionId);
    }

    getRandomQuestion() {
        let sessionIdentifier = [];
        let sessionId = sessionStorage.getItem('session_id');
        console.log("SESSIONID", sessionId.length);
        sessionIdentifier['session_id'] = sessionId;
        console.log("SE", sessionIdentifier);
        let urlAddress = "http://localhost:5000/api/get_random_question";
        fetch(urlAddress, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: sessionId,
            },
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
               if(data.hasOwnProperty('question') &&
                   data.hasOwnProperty('difficulty') &&
                   data.hasOwnProperty('answers') &&
                   data.hasOwnProperty('_id') &&
                   data.hasOwnProperty('category')
               ) {
                   console.log("Received response", data);

                   this.setState({
                       question: this.htmlEntities(data.question),
                       difficulty: data.difficulty,
                       answers: data.answers,
                       questionId: data._id,
                       category: data.category,
                       isLoading: false,
                   });
               } else {
                   console.log("error");
               }

            });
    }

    async checkCorrectAnswer(itm) {
        let jsonStr = {};
        let body ={
            question_id: this.state.questionId,
            correct_answer: itm,
            session_id: this.state.sessionId,
        };
        jsonStr['_id'] = this.state.questionId;
        jsonStr['correct_answer'] = itm;
        console.log(jsonStr);
        await this.checkJsonObjectFromApi(body);
        this.newQuestion();
    }

    checkJsonObjectFromApi(jsonStr) {
        console.log(jsonStr);
        let sessionId = sessionStorage.getItem('session_id');
        let urlAddress = "http://localhost:5000/api/check_correct_answer";
        fetch(urlAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId,

            },
            body: JSON.stringify(jsonStr)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
                console.log("CURRENT", data);
                this.markCorrectWrongForUser(data)
            })
    }

    markCorrectWrongForUser(data) {
        if(data.hasOwnProperty('current_score')) {
            this.setState({
                points: data.current_score,
            });
        }
    }

    htmlEntities(encodedString) {
        let translate_re = /&(nbsp|amp|quot|lt|gt);/g;
        let translate = {
            "nbsp":" ",
            "amp" : "&",
            "quot": "\"",
            "lt"  : "<",
            "gt"  : ">"
        };
        return encodedString.replace(translate_re, function(match, entity) {
            return translate[entity];
        }).replace(/&#(\d+);/gi, function(match, numStr) {
            let num = parseInt(numStr, 10);
            return String.fromCharCode(num);
        });
    }

    getQuestionContent() {
        return(<div>
            <Card style={{ width: '25rem', height: '350px', margin: '0 auto', padding: '2rem' }}>
                <Card.Body>
                    <Card.Title>{this.state.question}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Category: {this.state.category}</Card.Subtitle>
                    <Card.Text>
                        Difficulty: {this.state.difficulty}
                    </Card.Text>
                    <Card.Text>
                        Points: {this.state.points}
                    </Card.Text>
                </Card.Body>
            </Card>

        </div>)
    }

    getAnswerData() {
        if(this.state.answers) {
            return this.state.answers.map((itm, i) => {
               return(<Button key={i} variant={"outline-success"} size={"sm"} block  onClick={() => this.checkCorrectAnswer(itm)}>{itm}</Button>)
            });
        }
        console.log(this.state.answers);
    }

    newQuestion() {
        this.setState({
            isLoading: false
        });
        this.getRandomQuestion();
    }

    render() {
        if(this.state.isLoading){
            return(<div>
                <h1>Loading...</h1>
            </div>)
        }
        return (
            <div>
                <h1 className={"quizH"}>Quiz Game</h1>
                {this.getQuestionContent()}
                <ClockForGame
                score = {this.state.points}
                sessionId = {sessionStorage.getItem('session_id')}
                />
                <div className={"gameAnswerButtons"}>
                {this.getAnswerData()}
                </div>
            </div>
        )
    }
}

export default QuizGame
