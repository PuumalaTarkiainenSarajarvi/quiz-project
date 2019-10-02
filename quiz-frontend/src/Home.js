import React, { Component } from "react"
import {Button} from 'react-bootstrap';
import './home.css';
import { LinkContainer } from 'react-router-bootstrap';

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

                <LinkContainer to={{
                    pathname: '/quizgame',
                    state: { playable: true},
                }}>
                <Button variant={"outline-success"} size={"lg"} block>Play</Button>
                </LinkContainer>
                <Button variant={"outline-info"} size={"lg"} block className={"highScoresButton"} onClick={(e) => this.showHighScores(e)}>HighScores</Button>

            </div>
        )
    }

    showHighScores() {
        this.props.history.push('/high-scores');
    }

    async startGame() {
        console.log("StartGamed");
        

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
