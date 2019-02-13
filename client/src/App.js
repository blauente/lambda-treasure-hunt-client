import React, { Component } from 'react';
import './App.css';
import Screen from './components/Screen';
import Map2 from './components/Map2';

class App extends Component {
  constructor() {
    super();
    this.state = {
      graph: {},
      room_id: 0,
      coordinates: []
    }
  }

  updateState = (graphUpdate, currentRoomUpdate, coordinatesUpdate) => {
    this.setState({graph: graphUpdate, room_id: currentRoomUpdate, coordinates: coordinatesUpdate})
  }

  render() {
    return (
      <div className="App">
        <h1>Lambda Treasure Hunt</h1>
        <Screen update={this.updateState}/>
        <Map2 graph={this.state.graph} room_id={this.state.room_id} coordinates={this.state.coordinates}/>
      </div>
    );
  }
}

export default App;
