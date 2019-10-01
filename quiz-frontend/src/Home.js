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
        this.removeSessionStorage();
    }

    removeSessionStorage() {
        sessionStorage.removeItem('session_id');
    }

    renderButtons() {
        return(
            <div className={"homeButtons"}>
                <Button variant={"outline-success"} size={"lg"} block  onClick={() => {this.startGame()}}>Play</Button>
                <Button variant={"outline-info"} size={"lg"} block className={"highScoresButton"} onClick={(e) => this.showHighScores(e)}>HighScores</Button>

            </div>
        )
    }

    showHighScores() {
        this.props.history.push('/high-scores');
    }

    async startGame() {
        console.log("StartGamed");
        this.props.history.push('/quizgame');

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
