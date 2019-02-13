import React, { Component } from 'react';
import axios from 'axios';

let graph = {};
if (localStorage.getItem("graph")) {
    graph = JSON.parse(localStorage.getItem("graph"));
}

let visited = new Set();

let backtrackArray = [];

const inverse = {"n": "s", "s": "n", "e": "w", "w": "e"};

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
            coords: [],
            exits: [],
            room_id: 0,
            graphLength: 0
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
                    if (!graph[`Room ${response.data.room_id}`]){
                        let object = {};
                        for (let i = 0; i < response.data.exits.length; i++) {
                            object[response.data.exits[i]] = "?"
                        }
                        graph[`Room ${response.data.room_id}`] = {"coords": response.data.coordinates, "exits": object};
                    }
                    this.props.update(graph, this.state.room_id, this.state.coords.replace(/["()]/gi, '').split(","));
            })
            .catch(error => {
                console.log("ERROR:", error, Object.getOwnPropertyNames(error));
                this.setState({ 
                    movesLog: [...this.state.movesLog, 
                    {errors: error}],
                    // cooldown: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100
                })
            })
            console.log("coords from Screen.js", this.state.coords)
            if (graph) {
                this.setState({graphLength: Object.keys(graph).length})
            }
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
                    {errors: error}],
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
                console.log("exits in DFT", this.state.exits)
                const unexplored = this.state.exits.filter(exit => graph[`Room ${this.state.room_id}`]["exits"][exit] === "?")
                console.log("unexplored", unexplored)
                let direction = "null";
                if (unexplored.length > 0) {
                    direction = unexplored.pop();
                    backtrackArray.push(direction);
                } else if (backtrackArray.length > 0) {
                    direction = inverse[backtrackArray.pop()];
                } else {
                    direction = this.findClosestUnexplored(this.state.room_id, this.state.exits);

                }

                if (Array.isArray(direction)) {
                    this.continueDFT(direction[0]);
                    this.continueDFT(direction[1]);
                } else {
                    this.continueDFT(direction);
                }
                
            }, 6000);
            this.setState({graphLength: Object.keys(graph).length})
            // this.interval = setInterval(() => {this.setState(function () {return {cooldown: this.state.cooldown - 1}})}, 1000);
            // this.timeout2 = setTimeout(() => this.startBFT, this.state.cooldown * 1000);
        // }
    }

    continueDFT = (direction) => {
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
            if (!graph[`Room ${response.data.room_id}`]){
                let object = {};
                for (let i = 0; i < this.state.exits.length; i++) {
                    object[this.state.exits[i]] = "?"
                }
                graph[`Room ${response.data.room_id}`] = {"coords": this.state.coords, "exits": object};
            }
            graph[`Room ${response.data.room_id}`]["exits"][oppDir] = this.state.prevID;
            // this.timeout2 = setTimeout(() => this.startBFT, this.state.cooldown * 1000);
            this.props.update(graph, this.state.room_id, this.state.coords.replace(/["()]/gi, '').split(","));
        })
        .catch(error => {
            console.log("ERROR:", error, Object.getOwnPropertyNames(error));
            this.setState({ 
                movesLog: [...this.state.movesLog, 
                {error: error}],
                // cooldown: Math.round((parseFloat(error.response.data.cooldown)) * 100)/100
            })
        })
    localStorage.setItem("graph", JSON.stringify(graph));
    }

    stopDFT = () => {
        // this.setState(function () {return {traversing: false}});
        // clearTimeout(this.timeout);
        clearInterval(this.interval2);
    }

    findClosestUnexplored = (room_id, exits) => {
        let queue = [];
        // let visited = new Set();
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
                        const backtrack = Object.keys(graph[`Room ${v}`]["exits"]) // directions
                        const otherIDs = Object.values(graph[`Room ${v}`]["exits"]) // room ids
                        for (let j = 0; j < otherIDs.length; j++) {
                            for (let k = 0; k < Object.keys(graph[`Room ${otherIDs[j]}`]["exits"]).length; k++) {
                                // console.log("graph Room otherIDs[j][exits]", graph[`Room ${otherIDs[j]}`]["exits"])
                                if (Object.values(graph[`Room ${otherIDs[j]}`]["exits"])[k] === "?") {
                                    console.log("line 246 in Screen.js")
                                    return [Object.keys(graph[`Room ${v}`]["exits"])[j], Object.keys(graph[`Room ${otherIDs[j]}`]["exits"])[k]]
                                } else {
                                    // break;
                                    const random = backtrack[Math.floor(Math.random() * backtrack.length)];
                                    return random;
                                    // this.findClosestUnexplored(otherIDs[j], graph[`Room ${otherIDs[j]}`]["exits"])
                                }
                            }
                        }
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
                <div>{this.state.graphLength} out of 500 rooms explored</div>
                <div className="screen">
                {history.map(move => 
                    <div>
                        {move.command ? <p className="commandP">{move.command}</p> : null}
                        {move.title ? <h4 className="titleH4">{move.title}-Room {move.room_id}</h4> : null}
                        {move.description ? <p className="descP">{move.description}</p> : null}
                        {/* Displays players if they are in the room and nothing if none are present. */}
                        {move.players ? move.players.length ? <p className="playersP">Players: {move.players.join(', ')}</p> : null : null}
                        {move.inventory ? move.inventory.length ? <p className="invP">This room contains: {move.inventory.join(', ')}</p> : null : null}
                        {move.message ? <p className="messageP">{move.message}</p> : null}
                        {move.cooldown ? <p className="cooldownP">Cooldown: {this.state.cooldown}</p> : null}
                        {move.cooldowns ? <p className="cooldownP">Cooldown: {this.state.cooldowns}</p> : null}
                        {/* {move.error ? <p className="errorP">{move.error}</p> : null}
                        {move.errors ?  <p className="errorP">{move.errors}</p> : null} */}
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