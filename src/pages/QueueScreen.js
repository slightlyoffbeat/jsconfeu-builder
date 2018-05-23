import React, { Component } from "react";
import ModuleStore from "../utils/ModuleStore";
import QueueModulePanel from "../components/QueueModulePanel";

export default class QueueScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queue:[],
            first: null
        }
    }
    componentDidMount() {
        ModuleStore.on("queue", this.queueUpdated);
        ModuleStore.refreshQueue()
            .then(()=>ModuleStore.fetchFirstItem())
            .then(first => this.setState({first:first}))
    }
    componentWillUnmount() {
        ModuleStore.off("queue", this.queueUpdated);
    }
    queueUpdated = queue => this.setState({ queue: queue });
    render() {
        let modules = this.state.queue.expanded
        if(!modules) modules = []
        let rest = []
        if(modules.length > 1) rest = modules.slice(1)
        return (
            <article className="content" id="queue-grid">
                <h3>Currently On</h3>
                <div className="first"><QueueModulePanel module={this.state.first} scale={15} threedee={true}/></div>
                <ul className="rest">
                    {rest.map((mod, i) => (<li key={i}><QueueModulePanel key={i} module={mod} scale={4} threedee={false}/></li>))}
                </ul>
            </article>
        );
    }
}
