import React, { Component } from "react";
import QueueModulePanel from "../components/QueueModulePanel";
import Constants from "../Constants";
import {Link} from "react-router-dom"
import ModuleStore from '../utils/ModuleStore'
import AuthStore from '../utils/AuthStore'
import {makePNG} from "../utils/RenderUtils"

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
            showError:false,
            error:{message:'nothing',actions:[]}
        }
    }
    componentDidMount() {
        window.addEventListener("message", this.codeCallback)
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.codeCallback)
    }
    codeCallback = msg => {
        if(msg.origin !== 'https://webassembly.studio') return
        let module = msg.data;
        if(module && module.type) {
            if (!module.tags) module.tags = [];
            if (!module.title) module.title = "";
            if (!module.description) module.description = "";
            if (!module.author) module.author = "";
            if (!module.origin) module.origin = 'wasmstudio'
            module.thumbnail = makePNG(module.manifest.animation)
            this.setState({showPreviewSubmit:true, module:module})
        } else {
            this.showError("Could not get the message from the editor. Please try again", [
                { caption:'Dismiss', action:()=>this.hideError()}
            ])
        }
    }
    showError = (msg, actions) =>{
        if(!actions) {
            actions = [
                {
                    caption: 'Dismiss',
                    action: () => this.hideError(),
                }
            ]
        }
        this.setState({
            showError:true,
            error:{
                message: msg,
                actions: actions
            }
        })
    }
    hideError() {
        this.setState({showError:false})
    }
    render() {
        return (
            <article className="content">
                <iframe title="wasm editor" id="wasm-editor" src={Constants.EDITOR_URL}/>
                {this.renderOverlay()}
                {this.renderError()}
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
                if(!res.success) return this.showError(res.message)
                this.setState({showProgress:false, showDone:true})
            })
            .catch(e => {
                console.log("error submitting. should show an error", e);
                this.showError("error submitting to the server. Please try again.")
                this.setState({showProgress:false})
            });

    }
    renderOverlay() {
        if(this.state.showInfo) return <div className="overlay-scrim"><InfoScreen dismissInfo={this.dismissInfo}/></div>
        if(this.state.showProgress) return <div className="overlay-scrim"><Progress text={this.state.progressText}/></div>
        if(this.state.showDone) return <div className="overlay-scrim"><SubmitDone/></div>
        if(this.state.showPreviewSubmit)
            return  <div className="overlay-scrim"><PreviewSubmit backClicked={this.backClicked} doSubmit={this.doSubmit} module={this.state.module} onError={this.showError}/></div>
        return ""
    }
    renderError() {
        if(this.state.showError) return <div className="overlay-scrim"><ErrorScreen error={this.state.error}/></div>
        return " "
    }
}

const ErrorScreen = props => {
    return <article className="overlay-content">
        <h2>Error</h2>
        <p>{props.error.message}</p>
        <HBox>
        {
            props.error.actions.map((act,i) => {
                return <button key={i} onClick={act.action}>{act.caption}</button>
            })
        }
        </HBox>
    </article>
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
        <p>progress screen: <b>{props.text}</b> <i className="fa fa-pulse fa-spinner"></i></p>
    </article>
}

const TagButton = props => {
  return (
    <li>
      <button className="tag-button fa fa-close" onClick={() => props.deleteTag(props.tag)}></button>
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
          <HBox>
              <input
                  type="text"
                  placeholder="Filter name"
                  value={this.state.query}
                  onChange={this.editQuery}
                  onKeyDown={this.keyPress}
              />
              <button className="add-tag-button" onClick={this.addTag}>Add a Tag</button>
          </HBox>
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
            module : props.module,
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
        if (missing(module.title)) return this.props.onError("Your module needs a title")
        if (missing(module.description)) return this.props.onError("Your module needs a description")
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

    getCurrentTitle = () => {
        if(!this.state.module) return ""
        return this.state.module.title
    }
    getCurrentDescription = () => {
        if(!this.state.module) return ""
        return this.state.module.description
    }
    getCurrentAuthor = () => {
        if(!this.state.module) return ""
        return this.state.module.author
    }
    getCurrentTags = () => {
        if(!this.state.module) return []
        return this.state.module.tags
    }


    render() {
        const module = this.state.module
        return (
            <article className="content">
                <HBox style={{padding:'1em'}}>
                    <VBox style={{flex:0.3, margin:'0 1em'}}>
                        <h3>Submit your art for review</h3>
                        <form id="submit-form" onSubmit={(e)=>e.preventDefault()}>
                            <HBox>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={this.getCurrentTitle()}
                                    onChange={e => this.edit("title", e.target.value)}
                                />
                            </HBox>
                            <VBox>
                                <textarea
                                    placeholder="Description"
                                    value={this.getCurrentDescription()}
                                    rows={2}
                                    onChange={e => this.edit("description", e.target.value)}
                                />
                            </VBox>
                            <HBox>
                                <input
                                    type="text"
                                    placeholder="Author Name/Email"
                                    value={this.getCurrentAuthor()}
                                    onChange={e => this.edit("author", e.target.value)}
                                />
                            </HBox>
                            <HBox>
                                <Label>Choose Tags</Label>
                            </HBox>
                            <HBox>
                                <TagEditor
                                    tags={this.getCurrentTags()}
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
