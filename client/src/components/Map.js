import React, {Component} from 'react';

class Map extends Component {
    constructor(props) {
        super(props);
        this.graph = {};
        if (localStorage.getItem("graph")) {
            this.graph = JSON.parse(localStorage.getItem("graph"));
        }
    }

    componentDidMount = () => {
        this.drawBoard();
        this.populateMap();
        
    }

    componentDidUpdate = () => {
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

        context.strokeStyle = "#fff";
        context.stroke();
        
    }

    populateMap = () => {
        let canvas = this.refs.canvas;
        let context = canvas.getContext('2d');
        // context.translate(0, canvas.height);
        // context.scale(1, -1);
        context.transform(1, 0, 0, -1, 0, canvas.height)
        let keys = Object.keys(this.graph);
        let values = Object.values(this.graph);
        console.log("values from Map.js", values);
        if (values.length > 0) {
            const coordinates = [];
            for (let i = 0; i < values.length; i++) {
                let string = values[i].coords;
                string = string.replace(/["()]/gi, '');
                coordinates.push(string.split(","));
                let exits = values[i].exits;
                let exitKeys = Object.keys(exits);
                for(let j = 0; j < exitKeys.length; j++) {
                    
                    if (exitKeys[j] === 'n') {
                        context.moveTo(Number(coordinates[i][0])*40-2000+30, Number(coordinates[i][1])*40-2000-20)
                        context.lineTo(Number(coordinates[i][0])*40-2000+10, Number(coordinates[i][1])*40-2000-20);
                        context.strokeStyle = "#000";
                        context.stroke();
                    } else if (exitKeys[j] === 's') {
                        context.moveTo(Number(coordinates[i][0])*40-2000-30, Number(coordinates[i][1])*40-2000-20)
                        context.lineTo(Number(coordinates[i][0])*40-2000-10, Number(coordinates[i][1])*40-2000-20);
                        context.strokeStyle = "#000";
                        context.stroke();
                    } else if (exitKeys[j] === 'e') {
                        context.moveTo(Number(coordinates[i][0])*40-2000+20, Number(coordinates[i][1])*40-2000+30)
                        context.lineTo(Number(coordinates[i][0])*40-2000+20, Number(coordinates[i][1])*40-2000+10);
                        context.strokeStyle = "#000";
                        context.stroke();
                    } else {
                        context.moveTo(Number(coordinates[i][0])*40-2000-20, Number(coordinates[i][1])*40-2000-30)
                        context.lineTo(Number(coordinates[i][0])*40-2000-20, Number(coordinates[i][1])*40-2000-10);
                        context.strokeStyle = "#000";
                        context.stroke();
                    }
                    
                }

            }
            console.log("coordinates", coordinates);
            for (let i = 0; i < coordinates.length; i++) {
                let newKey = keys[i].slice(5);
                // context.scale(1, -1);
                
                context.font = "12px Arial";
                context.fillText(newKey, Number(coordinates[i][0])*40-2000, Number(coordinates[i][1])*40-2000);
                // context.fillText("test", 500, 200)
                context.restore();
            }
        }


        // console.log("example", Number(coordinates[0][0]), Number(coordinates[0][1]))
    }

    render() {
        // this.populateMap();
        return (
            <div>
                <canvas id="canvas" ref="canvas" width="1001" height="1001"></canvas>
            </div>
        );
    }
}

export default Map;