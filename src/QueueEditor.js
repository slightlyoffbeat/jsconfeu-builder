import React, { Component } from 'react';
import ModuleStore from './ModuleStore'
import QueueModulePanel from './QueueModulePanel'

export default class QueueEditor extends Component {
    componentDidMount() {
        ModuleStore.on('queue',(queue)=>this.setState({queue:queue}))
    }
    render() {
        const modules = ModuleStore.getQueue()
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

            <div style={{
                gridColumn:'left/right'
            }}>all modules</div>

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
                {modules.map((m)=><QueueModulePanel key={m._id} module={m} scale={10}/>)}
            </ul>
        </article>
    }
}



