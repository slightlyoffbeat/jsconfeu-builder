import React, {Component} from "react"
export  default  class ModulePanel extends Component {
    constructor(props) {
        super(props)
        this.listener = ()=>this.redraw()
    }
    componentDidMount() {
        this.props.store.on("changed",this.listener)
    }
    componentWillUnmount() {
        this.props.store.off('changed',this.listener)
    }

    redraw() {
        console.log("redrawing to the canvas", this.canvas)
    }
    render() {
        return <div className="module-panel">
            <label>name</label><span>{this.props.module.name}</span>
            <label>author</label><span>{this.props.module.author}</span>
            <canvas width={200} height={200} ref={(canvas)=>this.canvas = canvas}></canvas>
        </div>
    }
}