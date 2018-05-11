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
            <span className="title">{this.props.item.template.name}</span>
            <canvas width={44*5} height={36*5} ref={(canvas)=>this.canvas = canvas}></canvas>
            {this.props.dragHandle(<i className="fa fa-bars handle action"/>)}
            <i className="fa fa-close action" onClick={this.delete}/>
        </div>
    }
}