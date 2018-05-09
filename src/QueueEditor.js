import React, { Component } from 'react';
import ModuleStore from './ModuleStore'
import QueueModulePanel from './QueueModulePanel'

export default class QueueEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modules:[]
        }
        ModuleStore.findAllModules().then(modules => this.setState({modules:modules}))
    }
    addToQueue = (m) => ModuleStore.addModuleToQueue(m)
    deleteFromQueue = (m,i) => ModuleStore.deleteModuleFromQueue(m,i)
    queueUpdated = (queue) => this.setState({queue:queue})
    componentDidMount() {
        ModuleStore.on('queue',this.queueUpdated)
    }
    componentWillUnmount() {
        ModuleStore.off('queue',this.queueUpdated)
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
                {queueModules.map((m,i)=> <EditableModulePanel key={i} module={m} onDelete={()=>this.deleteFromQueue(m,i)}/>)}
            </ul>
        </article>
    }
}

const EditableModulePanel = (props) => {
    return <div>
        <button onClick={props.onDelete}>x</button>
        <QueueModulePanel module={props.module} scale={5}/>
    </div>
}


const ModuleSummaryPanel = (props) => {
    return <div>
        <b>{props.module.title}</b>
        <i>{props.module.tags.join(",")}</i>
        <button onClick={props.onAdd}>+</button>
        </div>
}