import React, {Component} from 'react';

class Map2 extends Component {
    constructor(props) {
        super(props);
        this.graph = {};
        if (localStorage.getItem("graph")) {
            this.graph = JSON.parse(localStorage.getItem("graph"));
        }
    }

    componentDidMount = () => {
        // this.drawBoard();
        // this.populateMap();
        
    }

    componentDidUpdate = () => {
        // this.populateMap();
    }

    populateMap = () => {
        // let canvas = this.refs.canvas;
        // let context = canvas.getContext('2d');
        // context.translate(0, canvas.height);
        // context.scale(1, -1);
        // context.transform(1, 0, 0, -1, 0, canvas.height)
        let divs = [];
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
                const divStyle = {
                    marginTop: -(string.split(",")[1]*40-2000)+1000,
                    marginLeft: string.split(",")[0]*40-2000
                }
                divs.push(<div className="mapNode" style={divStyle}>{keys[i].slice(5)}</div>)
                for(let j = 0; j < exitKeys.length; j++) {
                    
                    if (exitKeys[j] === 'n') {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+986,
                            marginLeft: string.split(",")[0]*40-1990
                        }
                        divs.push(<div className="mapEdgeVert" style={edgeStyle}></div>)
                    } else if (exitKeys[j] === 's') {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+1026,
                            marginLeft: string.split(",")[0]*40-1990,
                            // backgroundColor: 'red'
                        }
                        divs.push(<div className="mapEdgeVert" style={edgeStyle}></div>)
                    } else if (exitKeys[j] === 'e') {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+1010,
                            marginLeft: string.split(",")[0]*40-1974,
                            // backgroundColor: 'red'
                        }
                        divs.push(<div className="mapEdgeHoriz" style={edgeStyle}></div>)
                    } else {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+1010,
                            marginLeft: string.split(",")[0]*40-2014,
                            // backgroundColor: 'red'
                        }
                        divs.push(<div className="mapEdgeHoriz" style={edgeStyle}></div>)
                    }
                    
                }

            }
            // console.log("coordinates", coordinates);
            // for (let i = 0; i < coordinates.length; i++) {
            //     let newKey = keys[i].slice(5);
            //     // context.scale(1, -1);
                
            //     // context.font = "12px Arial";
            //     // context.fillText(newKey, Number(coordinates[i][0])*40-2000, Number(coordinates[i][1])*40-2000);
            //     // // context.fillText("test", 500, 200)
            //     // context.restore();
            // }
            return divs;
        }


        // console.log("example", Number(coordinates[0][0]), Number(coordinates[0][1]))
    }

    render() {
        return (
            <div>
                {/* <canvas id="canvas" ref="canvas" width="1001" height="1001"></canvas> */}
                <div className="mapBoard">
                    {this.populateMap()}
                </div>
            </div>
        );
    }
}

export default Map2;