import React, { Component } from "react";
import ModuleStore from "../utils/ModuleStore";
import QueueModulePanel from "../components/QueueModulePanel";
import Pattern from "../components/Pattern";

export default class QueueScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
      first: null
    };
  }
  componentDidMount() {
    ModuleStore.on("queue", this.queueUpdated);
    ModuleStore.refreshQueue()
      .then(() => ModuleStore.fetchFirstItem())
      .then(first => this.setState({ first: first }));
  }
  componentWillUnmount() {
    ModuleStore.off("queue", this.queueUpdated);
  }
  queueUpdated = queue => this.setState({ queue: queue });
  render() {
    let modules = this.state.queue.expanded;
    if (!modules) modules = [];
    let rest = [];
    if (modules.length > 1) rest = modules.slice(1);
    return (
      <div className="content queue">
        <div className="container">
          <h1>Currently On</h1>
          <div className="queue-first">
            <QueueModulePanel
              module={this.state.first}
              scale={15}
              threedee={true}
            />
          </div>
          <div className="queue-rest">
            {rest.map((mod, i) => (
              <QueueModulePanel
                num={i + 2}
                key={i}
                module={mod}
                scale={4}
                threedee={false}
              />
            ))}
          </div>
        </div>
        <Pattern position="bottom" />
      </div>
    );
  }
}
