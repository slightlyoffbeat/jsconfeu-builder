import React, { Component } from "react";
import RenderUtils from "../utils/RenderUtils";
import QueueModulePanel from "../components/QueueModulePanel";
import Constants from "../Constants";
import {Link, Redirect, Route, withRouter} from "react-router-dom"
import ModuleStore from '../utils/ModuleStore'
import AuthStore from '../utils/AuthStore'

class CodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
          module: null,
        redirectToPreview:false
    }
  }
  componentDidMount() {
    window.addEventListener("message", this.codeCallback)
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.codeCallback)
  }
  codeCallback = msg => {
      console.log("got the callback",msg)
    const module = msg.data;
      if(module && module.type) {
          console.log("the final module is", module);
          console.log('animation at', module.manifest.animation)
          if (!module.tags) module.tags = [];
          if (!module.title) module.title = "some title";
          if (!module.description) module.description = "some description";
          if (!module.author) module.author = "your@email.tld";
          console.log("saving the module",module)
          localStorage.setItem('current-module',JSON.stringify(module))
          this.setState({redirectToPreview:true})
      }
  }
  render() {
      if(this.state.redirectToPreview) {
          return <Redirect to={{pathname:'code-preview'}} />
      }
    return (
      <article className="content">
        <iframe title="wasm editor" id="wasm-editor" src={Constants.EDITOR_URL}/>
      </article>
    );
  }
}

const Preview = props => {
    const module = JSON.parse(localStorage.getItem('current-module'))
  return (
    <article className="content">
      <h1>preview screen</h1>
      <QueueModulePanel module={module} scale={50} threedee={true} />
      <div className="row">
          <Link to="/code">Back</Link>
          <Link to="/code-submit">Submit</Link>
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

class Submit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            module : JSON.parse(localStorage.getItem('current-module')),
            user: AuthStore.getCurrentUser(),
        }
    }
    onSubmit = () => {
        const module = this.state.module
        console.log("submitting the module", module);
        console.log("checking for missing");

        function missing(str) {
            if (!str) return true;
            if (str.trim().length === 0) return true;
            return false;
        }
        if (missing(module.title)) throw new Error("module is missing a title");
        if (missing(module.description))
            throw new Error("module is missing a description");
        console.log('checking for user', this.state.user)

        if (!this.state.user) {
            console.log("not authenitcated. can't submit");
            AuthStore.start();
        } else {
            console.log("really submitting")
            ModuleStore.submitModule(module)
                .then(() => {
                    // this.setState({navTo:'/code-submit-done'})
                    console.log("got the result. back to done")
                    this.props.history.push('/code-submit-done')
                    // return this.navTo("code-submit-done");
                })
                .catch(e => {
                    console.log("error submitting", e);
                });
        }

    }

  // function edit(field, value) {
  //   const data = props.data;
  //   data[field] = value;
  //   props.editData(data);
  // }
    render() {
        const module = this.state.module
        return (
            <article className="content">
                <h1>Submit your art for review</h1>
                <form>
                    <input
                        type="text"
                        placeholder="Title"
                        value={module.title}
                        onChange={e => this.edit("title", e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={module.description}
                        onChange={e => this.edit("description", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Author Name/Email"
                        value={module.author}
                        onChange={e => this.edit("author", e.target.value)}
                    />
                    <TagEditor
                        tags={module.tags}
                        onChange={tags => this.edit("tags", tags)}
                    />
                </form>
                <QueueModulePanel module={module} scale={50} threedee={true}/>
                <button onClick={this.onSubmit}>submit</button>
            </article>
        )
    }
}
CodeScreen.Submit = Submit;

const SubmitDone = props => {
  return (
    <article className="content">
      <h1>submit done screen</h1>
      <div>thank you </div>
        <Link to="/queue">What's Coming Next</Link>
        {/*<button onClick={() => props.navTo("queue")}>What's Coming Next</button>*/}
      {/*<button onClick={() => props.navTo("pipeline")}>*/}
        {/*Create an Animation*/}
      {/*</button>*/}
    </article>
  );
};
CodeScreen.SubmitDone = SubmitDone;

export default CodeScreen;
