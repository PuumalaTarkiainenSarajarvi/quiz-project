import React, { Component } from "react";
import './gameover.css';
import {nickName} from "./variables/Variables";
import {Redirect} from "react-router-dom";
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

    }

    handleChange(event) {
        this.setState({ email: event.target.value })
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
                alert("Try again :)");
            });
    }

    render() {
        if(sessionStorage.getItem('session_id')) {
        return (
            <div className={"overLay"}>
                <button className={'homepagebutton'} onClick={() => {this.goHome()}}>Back to home page</button>
                <div className={"gameOverContent"}>
                    <h1>Game over :( </h1>
                    <br/>
                    <h2>Your score was: {this.props.location.state.score}</h2>
                    <br/>
                    <p>Email: </p>
                    <input className={'gameoverInput'} type={'email'} name={'email'} value={this.state.email} placeholder={'Email'}
                    onChange={this.handleChange}/>
                    <br/>
                    <p>Nickname: </p>
                    <input className={'gameoverInput'} type={'text'} name={'text'} value={this.state.nickName} placeholder={'Nickname'}
                           onChange={this.handleChangeNickName}/>
                           <br/>
                           <input className={'submitInput'} onClick={() => {this.sendDataToServer()}} type={'submit'} name={'submit'} value={'Submit'}/>
                </div>
            </div>
        )
        }return (<Redirect to={{
            pathname: '/',
        }}/>)
    }
}

export default GameOver
