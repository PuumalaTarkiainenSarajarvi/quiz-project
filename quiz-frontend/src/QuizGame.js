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
        }
    }

   async componentDidMount() {
        await this.getRandomQuestion();
    }

    getRandomQuestion() {

        let urlAddress = "http://localhost:8080/api/get_random_question";
        fetch(urlAddress, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
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
            _id: this.state.questionId,
            correct_answer: itm
        };
        jsonStr['_id'] = this.state.questionId;
        jsonStr['correct_answer'] = itm;
        console.log(jsonStr);
        await this.checkJsonObjectFromApi(body);
        this.newQuestion();
    }

    checkJsonObjectFromApi(jsonStr) {
        console.log(jsonStr);
        let urlAddress = "http://localhost:8080/api/check_correct_answer";
        fetch(urlAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

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
                this.markCorrectWrongForUser(data)
            })
    }

    markCorrectWrongForUser(data) {
        if(data) {
            let points = this.state.points;
            if(data === "true") {
                points = points + 5;
            }
            if(data === "false") {
                points = points - 1;
            }
            this.setState({
                points: points
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
                <ClockForGame />
                <div className={"gameAnswerButtons"}>
                {this.getAnswerData()}
                </div>
            </div>
        )
    }
}

export default QuizGame
