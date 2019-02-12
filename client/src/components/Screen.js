import React, { Component } from 'react';
import axios from 'axios';

let graph = {};
if (localStorage.getItem("graph")) {
    graph = JSON.parse(localStorage.getItem("graph"));
}

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

        this.graph = {}
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

    startDFT = () => {
        // this.setState(function () {return {traversing: true}});
        // if (this.state.traversing) {
            
            this.interval2 = setInterval( () => {
                if (graph.length > 499) {
                    clearInterval(this.interval2);
                }
                if (!graph[`Room ${this.state.room_id}`]){
                    let object = {};
                    for (let i = 0; i < this.state.exits.length; i++) {
                        object[this.state.exits[i]] = "?"
                    }
                    graph[`Room ${this.state.room_id}`] = {"coords": this.state.coords, "exits": object};
                }
                console.log(graph);

                const unexplored = this.state.exits.filter(exit => graph[`Room ${this.state.room_id}`]["exits"][exit] === "?")
                console.log("unexplored", unexplored)
                let direction = "null";
                if (unexplored.length > 0) {
                    direction = unexplored[Math.floor(Math.random() * unexplored.length)];
                } else {
                    direction = this.findClosestUnexplored(this.state.room_id, this.state.exits);
                }
                // let index = 0;
                let oppDir = 'null';
                if (direction === "n") {
                    // index = 0;
                    oppDir = 's';
                } else if (direction === "s") {
                    // index = 1;
                    oppDir = 'n';
                } else if (direction === "e") {
                    // index = 2;
                    oppDir = 'w';
                } else {
                    // index = 3;
                    oppDir = 'e';
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
                    graph[`Room ${this.state.prevID}`]["exits"][direction] = response.data.room_id;
                    // if (!graph[response.data.title]) {
                    //     graph[response.data.title] = {"coords": this.state.coords, "exits": ["?", "?", "?", "?"]};
                    // }
                    if (!graph[`Room ${response.data.room_id}`]){
                        let object = {};
                        for (let i = 0; i < this.state.exits.length; i++) {
                            object[this.state.exits[i]] = "?"
                        }
                        graph[`Room ${response.data.room_id}`] = {"coords": this.state.coords, "exits": object};
                    }
                    graph[`Room ${response.data.room_id}`]["exits"][oppDir] = this.state.prevID;
                    // this.timeout2 = setTimeout(() => this.startBFT, this.state.cooldown * 1000);
                })
                .catch(error => {
                    console.log("ERROR:", error, Object.getOwnPropertyNames(error));
                    this.setState({ 
                        movesLog: [...this.state.movesLog, 
                        {error: error.response.data.error}],
                        cooldown: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100})
                })
            localStorage.setItem("graph", JSON.stringify(graph));
            }, 6000);
            
            // this.interval = setInterval(() => {this.setState(function () {return {cooldown: this.state.cooldown - 1}})}, 1000);
            // this.timeout2 = setTimeout(() => this.startBFT, this.state.cooldown * 1000);
        // }
    }

    stopDFT = () => {
        // this.setState(function () {return {traversing: false}});
        // clearTimeout(this.timeout);
        clearInterval(this.interval2);
    }

    findClosestUnexplored = (room_id, exits) => {
        let queue = [];
        let visited = new Set();
        queue.push(room_id);
        visited.add(room_id);
        while (queue.length > 0) {
            const v = queue.shift();
            let values = Object.values(graph[`Room ${room_id}`]["exits"]).filter(exit => exit !== "?");
            console.log("values:", values)
            if (v) {
                for (let i = 0; i < exits.length; i++) {
                    console.log("v:", v);
                    console.log("graph at v:", graph[`Room ${v}`]);
                    if (graph[`Room ${v}`]["exits"][exits[i]] === "?") {
                        return exits[i];
                    } else {
                        const backtrack = Object.keys(graph[`Room ${v}`]["exits"])
                        const random = backtrack[Math.floor(Math.random() * backtrack.length)];
                        return random;
                    }
                }
            }
            for (let i = 0; i < exits.length; i++) {
                if (graph[`Room ${v}`]) {
                    if (!visited.has(graph[`Room ${v}`]["exits"][exits[i]])) {
                        queue.push(graph[`Room ${v}`]["exits"][exits[i]]);
                        visited.add(graph[`Room ${v}`]["exits"][exits[i]]);
                    }
                }
            }
        }
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
                <button onClick={this.startDFT}>Start mapping</button>
                <button onClick={this.stopDFT}>Stop mapping</button>
                <p>Cooldown: {this.state.cooldown}</p>
                </form>
            </div>
        );
    }
}

export default Screen;