import React, { Component } from "react";
import './gameover.css';
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

    render() {
        return (
            <div className={"overLay"}>
                <div className={"gameOverContent"}>
                    <input type={'email'} name={'email'} value={this.state.email}
                    onChange={this.handleChange}/>
                    <input type={'text'} name={'text'} value={this.state.nickName}
                           onChange={this.handleChangeNickName}/>
                </div>
            </div>
        )
    }
}

export default GameOver
