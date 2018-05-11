import React, { Component } from "react";
import RenderUtils from "../utils/RenderUtils";
import QueueModulePanel from "../components/QueueModulePanel";
import Constants from "../Constants";

function renderFrames(module) {
  console.log("rendering frames for the module", module);
  const frameset = RenderUtils.makeFrameset(Constants.ROWS, Constants.COlS, 10);
  const ctx = RenderUtils.makeContext(frameset);
  window.eval(module.javascript);
  window.run(ctx);
  return frameset;
}

class CodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      module: null
    };
  }
  componentDidMount() {
    window.addEventListener("message", this.codeCallback);
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.codeCallback);
  }
  codeCallback = msg => {
    const module = msg.data;
    module.json = renderFrames(module);
    console.log("the final module is", module);
    if (!module.tags) module.tags = [];
    if (!module.title) module.title = "some title";
    if (!module.description) module.description = "some description";
    if (!module.author) module.author = "your@email.tld";
    this.setState({ module: module });
  };
  gotoPreview = () => {
    if (this.state.module) {
      this.props.navTo("code-preview", this.state.module);
    }
  };
  render() {
    return (
      <article className="content">
        <h1>Web Assembly Container</h1>
        <iframe
          title="wasm editor"
          id="wasm-editor"
          src={Constants.EDITOR_URL}
        />
        <button
          disabled={this.state.module ? false : true}
          onClick={this.gotoPreview}
        >
          Preview
        </button>
      </article>
    );
  }
}

const Preview = props => {
  return (
    <article>
      <h1>preview screen</h1>
      <QueueModulePanel module={props.data} scale={50} threedee={true} />
      <div className="row">
        <button onClick={() => props.navTo("code", props.data)}>back</button>
        <button onClick={() => props.navTo("code-submit", props.data)}>
          submit
        </button>
      </div>
    </article>
  );
};
CodeScreen.Preview = Preview;

const TagButton = props => {
  return (
    <li>
      <button onClick={() => props.deleteTag(props.tag)}>x</button>
      {props.tag}
    </li>
  );
};
class TagEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }
  editQuery = e => this.setState({ query: e.target.value });
  deleteTag = tag => {
    let tags = this.props.tags;
    tags = tags.filter(t => t !== tag);
    this.props.onChange(tags);
  };
  addTag = () => {
    if (!this.state.query || this.state.query.trim().length <= 0) return;
    let tags = this.props.tags;
    tags = tags.concat([this.state.query]);
    this.props.onChange(tags);
    this.setState({ query: "" });
  };
  keyPress = e => {
    if (e.keyCode === 13) return this.addTag();
  };
  render() {
    return (
      <div>
        <h3>Choose Tags</h3>
        <input
          type="text"
          placeholder="Filter name"
          value={this.state.query}
          onChange={this.editQuery}
          onKeyDown={this.keyPress}
        />
        <button onClick={this.addTag}>Add a Tag</button>
        <ul>
          {this.props.tags.map(t => (
            <TagButton key={t} tag={t} deleteTag={this.deleteTag} />
          ))}
        </ul>
      </div>
    );
  }
}

const Submit = props => {
  function edit(field, value) {
    const data = props.data;
    data[field] = value;
    props.editData(data);
  }
  return (
    <article>
      <h1>Submit your art for review</h1>
      <form>
        <input
          type="text"
          placeholder="Title"
          value={props.data.title}
          onChange={e => edit("title", e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={props.data.description}
          onChange={e => edit("description", e.target.value)}
        />
        <input
          type="text"
          placeholder="Author Name/Email"
          value={props.data.author}
          onChange={e => edit("author", e.target.value)}
        />
        <TagEditor
          tags={props.data.tags}
          onChange={tags => edit("tags", tags)}
        />
      </form>
      <QueueModulePanel module={props.data} scale={20} />
      <button onClick={() => props.onSubmit(props.data)}>submit</button>
    </article>
  );
};
CodeScreen.Submit = Submit;

const SubmitDone = props => {
  return (
    <article>
      <h1>submit done screen</h1>
      <div>thank you </div>
      <button onClick={() => props.navTo("queue")}>What's Coming Next</button>
      <button onClick={() => props.navTo("pipeline")}>
        Create an Animation
      </button>
    </article>
  );
};
CodeScreen.SubmitDone = SubmitDone;

export default CodeScreen;
