import React, { Component } from 'react';
import ModuleStore from './ModuleStore'
import QueueModulePanel from './QueueModulePanel'

export default class QueueEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modules:[]
        }
    }
    addToQueue = (m) => ModuleStore.addModuleToQueue(m)
    componentDidMount() {
        ModuleStore.on('queue',(queue)=>this.setState({queue:queue}))
        ModuleStore.findAllModules().then(modules => this.setState({modules:modules}))
    }
    render() {
        const queueModules = ModuleStore.getQueueModules()
        const allModules = this.state.modules
        return <article
            style={{
                height:'80vh',
                display:'grid',
                gridTemplateColumns:'[left]1fr [right]1fr [end]',
                gridTemplateRows:'[toolbar] 4em [body] 1fr [bottom]'
            }}
        >

            <div style={{
                gridColumn:'left/right',
                gridRow:'toolbar/body'
                }}
            ><input type="search"/><button>search</button></div>

            <ul style={{
                gridColumn:'left/right',
                overflow:'scroll',
                padding:0,
                gridRow:'body/bottom',
            }}>
                {allModules.map((m,i)=><ModuleSummaryPanel key={m._id} module={m}  onAdd={()=>this.addToQueue(m)}/>)}
            </ul>

            <h3 style={{
                gridColumn:'right/end',
                gridRow:'toolbar/body'
            }}>the queue</h3>

            <ul style={{
                gridColumn:'right/end',
                gridRow:'body/bottom',
                overflow:'scroll',
                padding:0,
            }}
            >
                {queueModules.map((m,i)=><QueueModulePanel key={i} module={m} scale={10}/>)}
            </ul>
        </article>
    }
}



const ModuleSummaryPanel = (props) => {
    return <div>
        <b>{props.module.title}</b>
        <i>{props.module.tags.join(",")}</i>
        <button onClick={props.onAdd}>+</button>
        </div>
}