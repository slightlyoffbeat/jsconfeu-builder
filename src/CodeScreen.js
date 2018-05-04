import React, { Component } from 'react';
const CodeScreen = (props) => {
    return <article>
        <h1>Web Assembly Container</h1>
        <iframe id="wasm-editor" src="https://vr.josh.earth/"></iframe>
        <button onClick={()=>props.navTo('code-preview')}>Preview</button>
    </article>
}

const Preview = (props) => {
    return <article>
        <h1>preview screen</h1>
        <div>preview </div>
        <div className="row">
            <button onClick={()=>props.navTo("code")}>back</button>
            <button onClick={()=>props.navTo("code-submit")}>submit</button>
        </div>
    </article>
}
CodeScreen.Preview = Preview

const Submit = (props) => {
    return <article>
        <h1>submit screen</h1>
        <div>submit form and preview</div>
        <button onClick={()=>props.navTo("code-submit-done")}>submit</button>
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