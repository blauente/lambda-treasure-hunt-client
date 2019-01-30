import React, { Component } from 'react';
import axios from 'axios';

let graph = {};

class Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movesLog: [],
            input: '',
            currentRoom: '',
            prevRoom: '',
            prevID: 0,
            currentDesc: '',
            currentPlayers: [],
            currentInv: '',
            cooldown: 0,
            traversing: false,
            coords: (0,0),
            exits: [],
            room_id: 0
        }
    }

    componentDidMount = () => {
        axios
            .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', 
            {headers: {Authorization: 'Token 1ca713aa4805a973344e3bee86f39961d50927b8'}})
            .then(response => {
                console.log(response.data)
                this.setState(function () {return {currentRoom: response.data.title, currentDesc: response.data.description, cooldown: response.data.cooldown, coords: response.data.coordinates, exits: response.data.exits, room_id: response.data.room_id,
                movesLog: [...this.state.movesLog, 
                    {title: response.data.title,
                    description: response.data.description,
                    players: response.data.players,
                    room_id: response.data.room_id,
                    cooldown: response.data.cooldown,
                    errors: response.data.errors}]}})
            })
            .catch(error => {
                console.log("ERROR:", error, Object.getOwnPropertyNames(error));
                this.setState({ 
                    movesLog: [...this.state.movesLog, 
                    {errors: error.response.data.errors}],
                    cooldown: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100})
            })

            this.interval = setInterval(() => {this.setState(function () {return {cooldown: this.state.cooldown - 1}})}, 1000);
            
    }

    componentDidUpdate = () => {
        // console.log(this.state.cooldown)
        if (this.state.cooldown <= 0) {
            clearInterval(this.interval);
        }
        if (this.state.cooldown > 0) {
            this.interval = setInterval(() => {this.setState(function () {return {cooldown: this.state.cooldown - 1}})}, 1000);
        }
        clearInterval(this.interval);
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        if (this.state.input.toLowerCase() === "n" || this.state.input.toLowerCase() === "s" || this.state.input.toLowerCase() === "e" || this.state.input.toLowerCase() === "e") {
            const data = {"direction": this.state.input};
            
            axios
            .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', data, 
            {headers: {Authorization: 'Token 1ca713aa4805a973344e3bee86f39961d50927b8'}})
            .then(response => {
                console.log(response.data)
                this.setState({currentRoom: response.data.title, currentDesc: response.data.description, cooldown: response.data.cooldown, coords: response.data.coordinates, exits: response.data.exits, room_id: response.data.room_id,
                movesLog: [...this.state.movesLog, 
                    {title: response.data.title,
                    description: response.data.description,
                    players: response.data.players,
                    room_id: response.data.room_id,
                    cooldown: parseInt(response.data.cooldown),
                    errors: response.data.errors}]})
            })
            .catch(error => {
                console.log("ERROR:", error, Object.getOwnPropertyNames(error));
                this.setState({ 
                    cooldown: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100,
                    movesLog: [...this.state.movesLog, 
                    {errors: error.response.data.errors}],
                    cooldowns: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100})
            })
        }
    }

    handleInputChange = (event) => {
        this.setState({input: event.target.value})
    }

    startBFT = () => {
        // this.setState(function () {return {traversing: true}});
        // if (this.state.traversing) {
            
            this.interval2 = setInterval( () => {

                graph[this.state.currentRoom] = {"coords": this.state.coords, "exits": ["?", "?", "?", "?"]};
                console.log(graph);

                const direction = this.state.exits[Math.floor(Math.random() * this.state.exits.length)];
                let index = 0;
                let oppIndex = 0;
                if (direction === "n") {
                    index = 0;
                    oppIndex = 1;
                } else if (direction === "s") {
                    index = 1;
                    oppIndex = 0;
                } else if (direction === "e") {
                    index = 2;
                    oppIndex = 3;
                } else {
                    index = 3;
                    oppIndex = 2;
                }
                const data = {"direction": direction}
                console.log("direction selected", direction);
                this.setState(function () {return {prevRoom: this.state.currentRoom, prevID: this.state.room_id}});
                

                axios
                .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', data, 
                {headers: {Authorization: 'Token 1ca713aa4805a973344e3bee86f39961d50927b8'}})
                .then(response => {
                    console.log(response.data)
                    this.setState(function () {return {currentRoom: response.data.title, currentDesc: response.data.description, cooldown: response.data.cooldown, coords: response.data.coordinates, exits: response.data.exits, room_id: response.data.room_id, 
                    movesLog: [...this.state.movesLog, 
                        {title: response.data.title,
                        description: response.data.description,
                        players: response.data.players,
                        room_id: response.data.room_id,
                        cooldown: parseInt(response.data.cooldown),
                        errors: response.data.errors}]}})
                    graph[this.state.prevRoom]["exits"][index] = response.data.room_id;
                    graph[response.data.title] = {"coords": this.state.coords, "exits": ["?", "?", "?", "?"]};
                    graph[response.data.title]["exits"][oppIndex] = this.state.prevID;
                    // this.timeout2 = setTimeout(() => this.startBFT, this.state.cooldown * 1000);
                })
                .catch(error => {
                    console.log("ERROR:", error, Object.getOwnPropertyNames(error));
                    this.setState({ 
                        movesLog: [...this.state.movesLog, 
                        {error: error.response.data.error}],
                        cooldown: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100})
            })}, this.state.cooldown * 1500);

            // this.interval = setInterval(() => {this.setState(function () {return {cooldown: this.state.cooldown - 1}})}, 1000);
            this.timeout2 = setTimeout(() => this.startBFT, this.state.cooldown * 1000);
        // }
    }

    stopBFT = () => {
        // this.setState(function () {return {traversing: false}});
        // clearTimeout(this.timeout);
        clearInterval(this.interval2);
    }

    render() {
        if (this.state.cooldown <= 0) {
            clearInterval(this.interval);
        }
        const history = this.state.movesLog.slice().reverse();
        return (
            <div>
                <div className="screen">
                {history.map(move => 
                    <div>
                        {move.command ? <p className="commandP">{move.command}</p> : null}
                        {move.title ? <h4 className="titleH4">{move.title}</h4> : null}
                        {move.description ? <p className="descP">{move.description}</p> : null}
                        {/* Displays players if they are in the room and nothing if none are present. */}
                        {move.players ? move.players.length ? <p className="playersP">Players: {move.players.join(', ')}</p> : null : null}
                        {move.inventory ? move.inventory.length ? <p className="invP">This room contains: {move.inventory.join(', ')}</p> : null : null}
                        {move.message ? <p className="messageP">{move.message}</p> : null}
                        {move.cooldown ? <p className="cooldownP">Cooldown: {this.state.cooldown}</p> : null}
                        {move.cooldowns ? <p className="cooldownP">Cooldown: {this.state.cooldowns}</p> : null}
                        {move.error ? <p className="errorP">{move.error}</p> : null}
                        {move.errors ?  <p className="errorP">{move.errors}</p> : null}
                    </div>
                )}
                </div>
                <form onSubmit={this.handleFormSubmit}>
                <input type="text" value={this.state.input} onChange={this.handleInputChange}/>
                <button type="submit">Submit</button>
                <button onClick={this.startBFT}>Start mapping</button>
                <button onClick={this.stopBFT}>Stop mapping</button>
                <p>Cooldown: {this.state.cooldown}</p>
                </form>
            </div>
        );
    }
}

export default Screen;