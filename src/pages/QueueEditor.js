import React, { Component } from "react";
import ModuleStore from "../utils/ModuleStore";
import QueueModulePanel from "../components/QueueModulePanel";
import DraggableList from "react-draggable-list";

function makeIdentityFilter() {
  return function() {
    return true;
  };
}
function makeNameFilter(fullString) {
  const str = fullString.toLowerCase();
  return function(item) {
    if (item.title.toLowerCase().indexOf(str) >= 0) return true;
    const match = item.tags.find(tag => tag.toLowerCase().indexOf(str) >= 0);
    if (match) return true;
    return false;
  };
}

export default class QueueEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      filter: makeIdentityFilter(),
      filterString: ""
    };
    ModuleStore.findAllModules().then(modules =>
      this.setState({ modules: modules })
    );
  }
  addToQueue = m => ModuleStore.addModuleToQueue(m);
  deleteFromQueue = (m, i) => ModuleStore.deleteModuleFromQueue(m, i);
  queueUpdated = queue => this.setState({ queue: queue });
  updateSearch = e =>
    this.setState({
      filter: makeNameFilter(e.target.value),
      filterString: e.target.value
    });
  clearSearch = () => this.setState({ filter: makeIdentityFilter() });
  componentDidMount() {
    ModuleStore.on("queue", this.queueUpdated);
  }
  componentWillUnmount() {
    ModuleStore.off("queue", this.queueUpdated);
  }
  render() {
    const queueModules = ModuleStore.getQueueModules();
    const allModules = this.state.modules.filter(this.state.filter);
    return (
      <article
          className="content"
        style={{
          height: "80vh",
          display: "grid",
          gridTemplateColumns: "[left]1fr [right]1fr [end]",
          gridTemplateRows: "[toolbar] 2em [body] 1fr [bottom]"
        }}
      >
        <div
          style={{
            gridColumn: "left/right",
            gridRow: "toolbar/body",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <input
            style={{ flex: 1 }}
            type="search"
            value={this.state.filterString}
            onChange={this.updateSearch}
          />
          <button onClick={this.clearSearch}>clear</button>
        </div>

        <ul
          style={{
            gridColumn: "left/right",
            overflow: "auto",
            padding: "0.25em",
            gridRow: "body/bottom",
            borderRight: "1px solid white"
          }}
        >
          {allModules.map((m, i) => (
            <ModuleSummaryPanel
              key={m._id}
              module={m}
              onAdd={() => this.addToQueue(m)}
            />
          ))}
        </ul>

        <h3
          style={{
            gridColumn: "right/end",
            gridRow: "toolbar/body"
          }}
        >
          the queue
        </h3>

        <div
          style={{
            gridColumn: "right/end",
            gridRow: "body/bottom",
            overflow: "auto",
            padding: 0
          }}
          ref={ref => (this.queue_modules_container = ref)}
        >
          <DraggableList
            list={queueModules}
            itemKey={"index"}
            template={EditableModulePanel}
            container={() => this.queue_modules_container}
            padding={10}
            onMoveEnd={this.moveEnded}
            commonProps={{
              onDelete: this.deleteFromQueue
            }}
          />
          {/*{queueModules.map((m,i)=> <EditableModulePanel key={i} module={m} onDelete={()=>this.deleteFromQueue(m,i)}/>)}*/}
        </div>
      </article>
    );
  }

  moveEnded = data => {
    ModuleStore.setQueueModules(data);
  };
}

class EditableModulePanel extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "1em",
          backgroundColor: "#333"
        }}
      >
        <div>
          {this.props.dragHandle(<i className="fa fa-bars handle action" />)}
        </div>
        <QueueModulePanel module={this.props.item} scale={4} />
        <div>
          <button
            className="fa fa-close"
            onClick={() => this.props.commonProps.onDelete(this.props.item)}
          />
        </div>
      </div>
    );
  }
}

const ModuleSummaryPanel = props => {
  return (
    <div
      style={{
        padding: "1em",
        backgroundColor: "#333",
        display: "flex",
        flexDirection: "row",
        margin: "1em"
      }}
    >
      <b>{props.module.title}</b>
      <i>&nbsp;</i>
      <i>{props.module.tags.join(",")}</i>
      <i style={{ flex: 1 }}>&nbsp;</i>
      <button onClick={props.onAdd}>+</button>
    </div>
  );
};
