import React, { Component } from 'react';
import RenderUtils from './RenderUtils'
import QueueModulePanel from './QueueModulePanel'

function renderFrames(module) {
    console.log("rendering frames for the module",module)
    const frameset = RenderUtils.makeFrameset(2,2,2)
    const ctx = RenderUtils.makeContext(frameset)
    window.eval(module.javascript)
    window.run(ctx)
    return frameset
}

class CodeScreen extends Component {
    componentDidMount() {
        window.addEventListener('message',this.codeCallback)
    }
    componentWillUnmount() {
        window.removeEventListener('message',this.codeCallback)
    }
    codeCallback = (msg) => {
        console.log("got message from the editor",msg.data)
        const module = msg.data
        module.json = renderFrames(module)
        console.log("the final module is",module)
        if(!module.tags) module.tags = []
        if(!module.title) module.title = "some title"
        if(!module.description) module.description = "some description"
        this.setState({module:module})
    }
    render() {
        return <article>
            <h1>Web Assembly Container</h1>
            <iframe title='wasm editor' id="wasm-editor" src="http://localhost/moz/jsconfeu-builder/public/fakeeditor.html"></iframe>
            <button onClick={()=>this.props.navTo('code-preview',this.state.module)}>Preview</button>
        </article>
    }
}


const Preview = (props) => {
    return <article>
        <h1>preview screen</h1>
        <div>preview data frames width is {props.data.json.width} and height is {props.data.json.width}</div>
        <QueueModulePanel module={props.data} scale={20}/>
        <div className="row">
            <button onClick={()=>props.navTo("code", props.data)}>back</button>
            <button onClick={()=>props.navTo("code-submit", props.data)}>submit</button>
        </div>
    </article>
}
CodeScreen.Preview = Preview

const Submit = (props) => {
    return <article>
        <h1>Submit your art for review</h1>
        <form>
            <input type="text" placeholder="Title" value={props.data.title}/>
            <textarea placeholder="Description" value={props.data.description}></textarea>
            <h3>Choose Tags</h3>
            <input type="text" placeholder="Filter name"/>
            <button>Add a Tag</button>
            <ul>
                <li><button>x</button> <b>tag</b></li>
                <li><button>x</button> <b>tag</b></li>
                <li><button>x</button> <b>tag</b></li>
                <li><button>x</button> <b>tag</b></li>
            </ul>
        </form>
        <div>preview. width of the current module is {props.data.json.width}</div>
        <button onClick={()=>props.onSubmit(props.data)}>submit</button>
    </article>
}
CodeScreen.Submit = Submit

const SubmitDone = (props) => {
    return <article>
        <h1>submit done screen</h1>
        <div>thank you </div>
        <button onClick={()=>props.navTo("queue")}>What's Coming Next</button>
        <button onClick={()=>props.navTo("pipeline")}>Create an Animation</button>
    </article>
}
CodeScreen.SubmitDone = SubmitDone



export default CodeScreen