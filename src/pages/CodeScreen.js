import React, { Component } from "react";
import QueueModulePanel from "../components/QueueModulePanel";
import Constants from "../Constants";
import {Link} from "react-router-dom"
import ModuleStore from '../utils/ModuleStore'
import AuthStore from '../utils/AuthStore'

class CodeScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
          module: null,
          showPreviewSubmit: false,
          showInfo:true,
          showProgress:false,
          progressText:'nothing',
          showDone:false,
      }
  }
  componentDidMount() {
    window.addEventListener("message", this.codeCallback)
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.codeCallback)
  }
  codeCallback = msg => {
      const module = msg.data;
      if(module && module.type) {
          console.log("the final module is", module);
          if (!module.tags) module.tags = [];
          if (!module.title) module.title = "some title";
          if (!module.description) module.description = "some description";
          if (!module.author) module.author = "your@email.tld";
          if (!module.origin) module.origin = 'wasmstudio'
          localStorage.setItem('current-module',JSON.stringify(module))
          this.setState({showPreviewSubmit:true})
      }
  }
  render() {
    return (
      <article className="content">
        <iframe title="wasm editor" id="wasm-editor" src={Constants.EDITOR_URL}/>
          {this.renderOverlay()}
      </article>
    );
  }
    backClicked = () => this.setState({showPreviewSubmit:false})
    dismissInfo = () => this.setState({showInfo:false})
    doSubmit = (module) => {
      this.setState({showPreviewSubmit:false, showProgress:true, progressText:"submitting for review"})
        console.log("really submitting")
        ModuleStore.submitModule(module)
            .then((res) => {
                console.log("got the result",res)
                this.setState({showProgress:false, showDone:true})
            })
            .catch(e => {
                console.log("error submitting", e);
            });

    }
    renderOverlay() {
        if(this.state.showInfo) return <div className="overlay-scrim"><InfoScreen dismissInfo={this.dismissInfo}/></div>
        if(this.state.showProgress) return <div className="overlay-scrim"><Progress text={this.state.progressText}/></div>
        if(this.state.showDone) return <div className="overlay-scrim"><SubmitDone/></div>
        if(this.state.showPreviewSubmit)
            return  <div className="overlay-scrim"><PreviewSubmit backClicked={this.backClicked} doSubmit={this.doSubmit}/></div>
        return ""
    }
}

const InfoScreen = props => {
    return <article className="overlay-content">
        <h2>Code a Module</h2>
        <p>Here are some instructions to code a module</p>
        <div className="row">
            <button className="button button--primary" onClick={props.dismissInfo}>Dismiss</button>
        </div>
    </article>
}

const Progress = props => {
    return <article className="overlay-content">
        <p>progress screen: <b>{props.text}</b></p>
    </article>
}

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

const VBox = props => {
    const style = props.style || {}
    style.display = 'flex'
    style.flexDirection = 'column'
    return <div style={style}>{props.children}</div>
}
const HBox = props => {
    const style = props.style || {}
    style.display = 'flex'
    style.flexDirection = 'row'
    return <div style={style}>{props.children}</div>
}
const Label = props => {
    return <label style={{flex:1}}>{props.children}</label>
}
const Spacer = props => {
    return <span style={{flex:1}}/>
}

class PreviewSubmit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            module : JSON.parse(localStorage.getItem('current-module')),
            user: AuthStore.getCurrentUser(),
        }
    }
    componentDidMount() {
        AuthStore.listenToLogin(this.loggedIn)
    }
    componentWillUnmount() {
        AuthStore.unlistenToLogin(this.loggedIn)
    }
    loggedIn = () => {
        this.setState({user:AuthStore.getCurrentUser()})
    }
    onSubmit = () => {
        const module = this.state.module

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
            this.props.doSubmit(module)
        }
    }

    edit = (field, value) => {
        this.state.module[field] = value
        this.setState({module:this.state.module})
    }

    render() {
        const module = this.state.module
        return (
            <article className="content">
                <h2>Submit your art for review</h2>
                <HBox>
                    <VBox style={{flex:1, margin:'0 1em'}}>
                        <form id="submit-form">
                            <HBox>
                                <Label>Title</Label>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={module.title}
                                    onChange={e => this.edit("title", e.target.value)}
                                />
                            </HBox>
                            <VBox>
                                <Label>Description</Label>
                                <textarea
                                    placeholder="Description"
                                    value={module.description}
                                    onChange={e => this.edit("description", e.target.value)}
                                />
                            </VBox>
                            <HBox>
                                <Label>Your Name or Email</Label>
                                <input
                                    type="text"
                                    placeholder="Author Name/Email"
                                    value={module.author}
                                    onChange={e => this.edit("author", e.target.value)}
                                />
                            </HBox>
                            <HBox>
                                <Label>Tags</Label>
                                <TagEditor
                                    tags={module.tags}
                                    onChange={tags => this.edit("tags", tags)}
                                />
                            </HBox>
                        </form>
                    </VBox>
                    <QueueModulePanel module={module} scale={40} threedee={true} hideInfo={true} />
                </HBox>
                <HBox style={{padding: '0.5em'}}>
                    <button className="button button--primary" onClick={this.props.backClicked}>Back</button>
                    <Spacer/>
                    <button className="button button--primary" onClick={this.onSubmit}>submit</button>
                </HBox>
            </article>
        )
    }
}

const SubmitDone = props => {
    return (
        <article className="content">
            <h1>submit done screen</h1>
            <div>thank you </div>
            <Link to="/queue" className="button button--primary">What's Coming Next</Link>
        </article>
    );
};

export default CodeScreen;
