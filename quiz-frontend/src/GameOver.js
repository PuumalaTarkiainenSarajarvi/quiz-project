import React, { Component } from "react";
import './gameover.css';
import {nickName} from "./variables/Variables";
class GameOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            nickName: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNickName = this.handleChangeNickName.bind(this);
    }

    componentDidMount() {
        console.log("DDD", this.props.location.state.score);
    }

    getContent() {
        let sessionId = sessionStorage.getItem("session_id");

    }

    handleChange(event) {
        this.setState({ email: event.target.value })
    }

    checkIfValid() {
        console.log("HELOO");
    }

    handleChangeNickName(event) {
        this.setState({
           nickName: event.target.value
        });
    }
    goHome() {
        this.props.history.push('/');
    }
    sendDataToServer() {
        let body = {};
        body['email'] = this.state.email;
        body[nickName] = this.state.nickName;
        this.startSendingData(body);
    }

    startSendingData(body) {

        let urlAddress = "http://localhost:5000/api/post_high_score_info";
        let sessionId = this.props.location.state.sessionId;
        console.log("SESSIONID", sessionId);
        fetch(urlAddress, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization': sessionId,
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if(response.status === 200) {
                    this.props.history.push('/');
                }
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .catch((error) => {
                console.log(error);
                alert("Try again :)");
            });
    }

    render() {
        return (
            <div className={"overLay"}>
                <button onClick={() => {this.goHome()}}>Back to home page</button>
                <div className={"gameOverContent"}>
                    <h1>Game over :( </h1>
                    <br/>
                    <p>Your score was: {this.props.location.state.score}</p>
                    <br/>
                    <p>Email: </p>
                    <input type={'email'} name={'email'} value={this.state.email} placeholder={'Email'}
                    onChange={this.handleChange}/>
                    <br/>
                    <p>Nickname: </p>
                    <input type={'text'} name={'text'} value={this.state.nickName} placeholder={'Nickname'}
                           onChange={this.handleChangeNickName}/>
                           <br/>
                           <input onClick={() => {this.sendDataToServer()}} type={'submit'} name={'submit'} value={'submit'}/>
                </div>
            </div>
        )
    }
}

export default GameOver
