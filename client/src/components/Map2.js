import React, {Component} from 'react';

class Map2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: {}
        }
        // this.graph = {};
        // if (localStorage.getItem("graph")) {
        //     this.graph = JSON.parse(localStorage.getItem("graph"));
        // }
    }

    componentDidMount = () => {
        // this.drawBoard();
        // this.populateMap();
        
    }

    componentDidUpdate = () => {
        // this.populateMap();
    }

    checkIfArraysAreEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        } else {
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
        }
        return true;
    }

    populateMap = () => {
        this.graph = this.props.graph;
        // if (localStorage.getItem("graph")) {
        //     this.graph = JSON.parse(localStorage.getItem("graph"));
        // }
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
                let divStyle = {
                    marginTop: -(string.split(",")[1]*40-2000)+1000,
                    marginLeft: string.split(",")[0]*40-1800,
                }
                console.log("are they equal?", this.props.coordinates, string.split(","))
                if (this.checkIfArraysAreEqual(this.props.coordinates, string.split(","))) {
                    Object.assign(divStyle, {
                        backgroundColor: 'red'
                    })
                } else {
                    Object.assign(divStyle, {
                        backgroundColor: 'white'
                    })
                }
                divs.push(<div className="mapNode" style={divStyle}>{keys[i].slice(5)}</div>)
                for(let j = 0; j < exitKeys.length; j++) {
                    
                    if (exitKeys[j] === 'n') {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+986,
                            marginLeft: string.split(",")[0]*40-1790
                        }
                        divs.push(<div className="mapEdgeVert" style={edgeStyle}></div>)
                    } else if (exitKeys[j] === 's') {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+1026,
                            marginLeft: string.split(",")[0]*40-1790,
                            // backgroundColor: 'red'
                        }
                        divs.push(<div className="mapEdgeVert" style={edgeStyle}></div>)
                    } else if (exitKeys[j] === 'e') {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+1010,
                            marginLeft: string.split(",")[0]*40-1774,
                            // backgroundColor: 'red'
                        }
                        divs.push(<div className="mapEdgeHoriz" style={edgeStyle}></div>)
                    } else {
                        const edgeStyle= {
                            marginTop: -(string.split(",")[1]*40-2000)+1010,
                            marginLeft: string.split(",")[0]*40-1814,
                            // backgroundColor: 'red'
                        }
                        divs.push(<div className="mapEdgeHoriz" style={edgeStyle}></div>)
                    }
                    
                }

            }

            return divs;
        }
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