import React, { Component } from 'react';
import axios from 'axios';

class Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movesLog: [],
            input: '',
            currentRoom: '',
            currentDesc: '',
            currentPlayers: [],
            currentInv: ''
        }
    }

    componentDidMount = () => {
        axios
            .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', 
            {headers: {Authorization: 'Token 1ca713aa4805a973344e3bee86f39961d50927b8'}})
            .then(response => {
                console.log(response.data)
                this.setState({currentRoom: response.data.title, currentDesc: response.data.description, 
                movesLog: [...this.state.movesLog, 
                    {title: response.data.title,
                    description: response.data.description,
                    players: response.data.players,
                    room_id: response.data.room_id}]})
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
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
                        {move.error ? <p className="errorP">{move.error}</p> : null}
                    </div>
                )}
                </div>
            </div>
        );
    }
}

export default Screen;