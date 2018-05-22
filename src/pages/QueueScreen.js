import React, { Component } from "react";
import ModuleStore from "../utils/ModuleStore";
import QueueModulePanel from "../components/QueueModulePanel";

export default class QueueScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queue:[]
        }
    }
    componentDidMount() {
        ModuleStore.on("queue", this.queueUpdated);
    }
    componentWillUnmount() {
        ModuleStore.off("queue", this.queueUpdated);
    }
    queueUpdated = queue => this.setState({ queue: queue });
    render() {
        const modules = ModuleStore.getQueueModules();
        const first = modules[0]
        const rest = modules.slice(0)
        return (
            <article className="content" id="queue-grid">
                <h3>Currently On</h3>
                <div className="first"><QueueModulePanel module={first} scale={15} threedee={true}/></div>
                <ul className="rest">
                    {rest.map((mod, i) => (<li key={i}><QueueModulePanel key={i} module={mod} scale={4} threedee={false}/></li>))}
                </ul>
            </article>
        );
    }
}
