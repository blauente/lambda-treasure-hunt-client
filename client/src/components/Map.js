import React, {Component} from 'react';

class Map extends Component {

    componentDidMount = () => {
        this.drawBoard();
        this.graph = JSON.parse(localStorage.getItem("graph"));
        this.populateMap();
    }

    drawBoard = () => {
        let canvas = this.refs.canvas;
        let context = canvas.getContext('2d');

        for (let x = 0.5; x < 1005 * 20; x += 20) {
            context.moveTo(x, 0);
            context.lineTo(x, 1005 * 20);
        }

        for (let y = 0.5; y < 1005 * 20; y += 20) {
            context.moveTo(0, y);
            context.lineTo(1005 * 20, y);
        }

        context.strokeStyle = "#000";
        context.stroke();
    }

    populateMap = () => {
        let canvas = this.refs.canvas;
        let context = canvas.getContext('2d');
        let keys = Object.keys(this.graph);
        let values = Object.values(this.graph);
        console.log("values", values);
        const coordinates = [];
        for (let i = 0; i < values.length; i++) {
            let string = values[i].coords;
            string = string.replace(/["()]/gi, '');
            coordinates.push(string.split(","));
        }
        console.log("coordinates", coordinates);
        for (let i = 0; i < coordinates.length; i++) {
            let newKey = keys[i].slice(5);
            context.font = "12px Arial";
            context.fillText(newKey, Number(coordinates[i][0])*40-2000, Number(coordinates[i][1])*40-2000);
            // context.fillText("test", 500, 200)
        }

        console.log("example", Number(coordinates[0][0]), Number(coordinates[0][1]))
    }

    render() {
        return (
            <div>
                <canvas id="canvas" ref="canvas" width="1001" height="1001"></canvas>
            </div>
        );
    }
}

export default Map;