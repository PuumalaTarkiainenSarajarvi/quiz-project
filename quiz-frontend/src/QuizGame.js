import React, { Component } from "react"
import ClockForGame from "./ClockForGame";
import {Button} from "react-bootstrap";

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
                       question: data.question,
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

            <p>{this.state.difficulty}</p>
            <br/>
            <p>{this.state.category}</p>
            <br/>
            <h1>{this.htmlEntities(this.state.question)}</h1>

        </div>)
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
                <h1>Quiz Game</h1>
                <ClockForGame />
                {this.getQuestionContent()}
                <Button variant={"outline-success"} size={"lg"} block  onClick={(e) => this.newQuestion(e)}>New</Button>
            </div>
        )
    }
}

export default QuizGame
