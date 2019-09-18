import React, { Component } from "react"
import ClockForGame from "./ClockForGame";

class QuizGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            question: undefined,
            answers: undefined,
            gameOver: false,
        }
    }

    componentDidMount() {
        //this.getRandomQuestion()
    }

    getRandomQuestion() {
        //Random question

        this.getAnswers();
    }

    getAnswers() {

    }

    render() {
        return (
            <div>
                <h1>Quiz Game</h1>
                <ClockForGame />
            </div>
        )
    }
}

export default QuizGame
