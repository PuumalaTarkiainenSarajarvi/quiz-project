import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import './quizgame.css';

class ClockForGame extends Component {
    maximumTime = 60;
    constructor(props){
        super(props);
        this.state = {
            currentCount: 60,
            percentageCount: 100
        }
    }
    countPercentage(count) {
        count = ((count / this.maximumTime) * 100);
        return count;
    }
    timer() {
        let currentCount = this.state.currentCount;
        currentCount = currentCount - 1;
        this.setState({
            currentCount: currentCount,
            percentageCount: this.countPercentage(currentCount)
        });
        if(this.state.currentCount < 1) {
            clearInterval(this.intervalId);
        }
    }
    componentDidMount() {
        this.intervalId = setInterval(this.timer.bind(this), 1000);
    }
    componentWillUnmount(){
        clearInterval(this.intervalId);
    }

    timerDiv() {
        if(this.state.currentCount > 0) {

        } else {
            return <Redirect to={{
                pathname: '/game-over',
                state: { score: this.props.score, sessionId: this.props.sessionId },
}}/>
        }
    }

    render() {
        return(
            <div className={"progressBar"}>
                {this.timerDiv()}
                <div className={"filler"} style={{ width: `${this.state.percentageCount}%`}} />
            </div>
            );
    }
}

export default ClockForGame;
