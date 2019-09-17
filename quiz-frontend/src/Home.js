import React, { Component } from "react"

class Home extends Component {
    constructor() {
        super()
        this.state = {
            text: undefined
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        var urlAddress = "http://localhost:8080/api/get_all_high_scores"
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
           <div>

           </div>
        )
    }
}

export default Home