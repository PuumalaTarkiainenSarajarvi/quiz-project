import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class ClockForGame extends Component {
    constructor(props){
        super(props);
        this.state = {currentCount: 10}
    }
    timer() {
        this.setState({
            currentCount: this.state.currentCount - 1
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
        return(
            <div>{this.state.currentCount}</div>
        );
        } else {
            return <Redirect to={'/'}/>
        }
    }

    render() {
        return(
            <div>
            {this.timerDiv()}
            </div>
            );
    }
}

export default ClockForGame;
