import React, { Component } from "react"
import {Tab, Table, Tabs} from "react-bootstrap";
import './highscores.css';
import {email, highScore, nickName, tenBestScores} from "./variables/Variables";

class HighScores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            emailHandling: false,
            personalJson: undefined,
            inputValue: "",
            allHighScore: undefined,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        await this.getHighScores();
    }

    getHighScores() {
        let urlAddress = "http://localhost:5000/api/get_all_high_scores";
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
                console.log("data",data);
                this.setState({
                   isLoading: false,
                    allHighScore: data,
                });
            });
    }

    emailJsonBody(emailString) {
        let jsonStr = {};
        jsonStr[email] = emailString;
        this.apiGetPersonalBest(jsonStr);
    }



    apiGetPersonalBest(jsonStr) {
        console.log("TT");
        let urlAddress = "http://localhost:5000/api/get_personal_bests";
        fetch(urlAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(jsonStr)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
                console.log("PERSONAL",data);
                this.setState({
                    personalJson: data,
                });
            })
            .catch((error) => {
                console.log(error);
                alert("User doesn't have any personal records yet.. Go play yeye ! :)")
            });
    }

    renderPersonalBest() {
        if(this.state.emailHandling && this.state.personalJson) {
            return (<div className={"allTimeTableView"}>
                <p className={"tableHeader"}>All time</p>
                <Table responsive="md">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nick</th>
                        <th>Date</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderPersonalScores()}
                    </tbody>
                </Table>
            </div>)
        } else {
            return(
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            )
        }
    }

    sortJsonScores(json) {
        return json.sort(function(a,b) {
           return a[highScore] - b[highScore];
        });
    }
    renderHighScores() {
        let sortedJsonData = this.sortJsonScores(this.state.allHighScore);
        if(sortedJsonData) {
            return sortedJsonData.map((itm, i) => {
                return(<tr key={i}>
                    <td>{i}</td>
                    <td>{itm[nickName]}</td>
                    <td>Testi</td>
                    <td>{itm[highScore]}</td>
                </tr>)
            });
        }
    }
    renderPersonalScores() {
        let sortedJsonData = this.sortJsonScores(this.state.personalJson[0][tenBestScores]);
        let userNickName = this.state.personalJson[0][nickName];
        if(sortedJsonData) {
        return sortedJsonData.map((itm, i) => {
            return(<tr key={i}>
                <td>{i}</td>
                <td>{userNickName}</td>
                <td>{itm.date}</td>
                <td>{itm[highScore]}</td>
            </tr>)
        });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setEmailHandling().then(r => this.setState({emailHandling: true}));
    }

    handleChange(event) {
        this.setState({inputValue: event.target.value});
    }

    renderScores() {
        if(this.state.allHighScore) {
            return (<div className={"allTimeTableView"}>
                <p className={"tableHeader"}>All time</p>
                <Table responsive="md">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nick</th>
                        <th>Date</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderHighScores()}
                    </tbody>
                </Table>
            </div>)
        }
    }

    async setEmailHandling() {
        await this.emailJsonBody(this.state.inputValue);
        await this.emailJsonBody(this.state.inputValue);
        if(this.state.personalJson) {
        this.setState({
            emailHandling: true,
        });
        }
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        if(this.state.isLoading) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }
        return (
            <div>
                <img onClick={() => {this.goBack()}} alt={""} src={"/images/back.png"}/>
                <Tabs defaultActiveKey="allTime">
                    <Tab eventKey="allTime" title="All time">
                        {this.renderScores()}
                    </Tab>
                    <Tab eventKey="personalBest" title="Personal Best">
                        {this.renderPersonalBest()}
                    </Tab>
                </Tabs>


            </div>
        )
    }
}

export default HighScores
