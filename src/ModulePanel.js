import React, {Component} from "react"
export  default  class ModulePanel extends Component {
    constructor(props) {
        super(props)
        this.listener = ()=>this.redraw()
    }
    componentDidMount() {
        this.props.commonProps.store.on("changed",this.listener)
    }
    componentWillUnmount() {
        this.props.commonProps.store.off('changed',this.listener)
    }
    
    redraw() {
        this.props.commonProps.store.drawCanvas(this.props.item,this.canvas)
    }

    delete = () => {
        this.props.commonProps.store.removeActiveModule(this.props.item)
    }

    store() {
        console.log('starting')
    }
    render() {
        return <div className="module-panel">
            {this.props.dragHandle(<i className="fa fa-bars handle action"/>)}
            <i className="fa fa-close action" onClick={this.delete}/>
            <label>name</label><span>{this.props.item.template.name}</span>
            <label>author</label><span>{this.props.item.template.author}</span>
            <canvas width={50*5} height={30*5} ref={(canvas)=>this.canvas = canvas}></canvas>
        </div>
    }
}