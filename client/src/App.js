import React, { Component } from 'react';
import './App.css';
import Screen from './components/Screen';
import Map2 from './components/Map2';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Lambda Treasure Hunt</h1>
        <Screen />
        <Map2 />
      </div>
    );
  }
}

export default App;
