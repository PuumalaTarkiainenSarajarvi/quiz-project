import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route} from "react-router-dom";
import QuizGame from "./QuizGame";
import HighScores from "./HighScores";
import GameOver from "./GameOver";

class App extends Component {
    render() {
        return (
            <Router>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/quizgame" component={QuizGame}/>
                    <Route exact path="/high-scores" component={HighScores}/>
                    <Route exact path="/game-over" component={GameOver}/>
            </Router>
        );
    }
}

export default App;
