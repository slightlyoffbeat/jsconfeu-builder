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
        this.props.store.drawCanvas(this.props.module,this.canvas)
    }

    store() {
        console.log('starting')
    }
    render() {
        return <div className="module-panel">
            <label>name</label><span>{this.props.module.template.name}</span>
            <label>author</label><span>{this.props.module.template.author}</span>
            <canvas width={50*5} height={30*5} ref={(canvas)=>this.canvas = canvas}></canvas>
        </div>
    }
}