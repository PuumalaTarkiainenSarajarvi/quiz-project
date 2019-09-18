import React, { Component } from "react"
import {Button} from 'react-bootstrap';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailInput: undefined,
            showHighScorePopup: false,
        }
    }

    componentDidMount() {
        //this.fetchData()
    }

    renderButtons() {
        return(
            <div className={"homeButtons"}>
                <Button variant={"outline-success"} size={"lg"} block  onClick={(e) => this.startGame(e)}>Play</Button>
                <Button variant={"outline-info"} size={"lg"} block className={"highScoresButton"} onClick={(e) => this.showHighScores(e)}>HighScores</Button>

            </div>
        )
    }

    showHighScores() {
        console.log("HighScores");
    }

    startGame() {
        console.log("StartGamed");
        this.props.history.push('/quizgame');
    }

    fetchData() {
        let urlAddress = "http://localhost:8080/api/get_all_high_scores";
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
            console.log("Received response", data)
        })
    }

    render() {
        return (
           <div className={"outer"}>
               <h1 className={"homeTitle"}>QUIZ GAME</h1>
               {this.renderButtons()}
           </div>
        )
    }
}

export default Home
