import React, { Component } from 'react';
import './App.css';
import "font-awesome/css/font-awesome.css";

import ModuleStore from "./ModuleStore"
import PipelineEditor from "./PipelineEditor";
import HomeScreen from './HomeScreen'
import CodeScreen from './CodeScreen'
import PaintScreen from './PaintScreen'
import QueueScreen from './QueueScreen'
import AboutScreen from './AboutScreen'

const Toolbar = (props) => {
    return <div id="toolbar">
        <a href='#' className="logo" onClick={()=>props.navTo('home')}>Mozilla</a>
        <a href="#" onClick={()=>props.navTo('code')}>Code a Module</a>
        {/*<a href="#" onClick={()=>props.navTo('paint')}>Create with AR</a>*/}
        {/*<a href="#" onClick={()=>props.navTo('pipeline')}>Create an Animation</a>*/}
        <a href="#" onClick={()=>props.navTo('queue')}>What's Coming Next</a>
        <a href="#" onClick={()=>props.navTo('about')}>About</a>
        <a href="#" onClick={()=>props.navTo('github')} className="round-button">Connect with GitHub</a>
    </div>

}

const GithubScreen = (props) => {
    return <article>
        <h1>github stuff</h1>
    </article>
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screen:"queue"
        }
    }
    navTo = (screen) => this.setState({screen:screen})
    render() {
        return <div id="body">
            <Toolbar navTo={this.navTo}/>
            <div id="content">{this.renderContent()}</div>
            <div id="footer">footer</div>
        </div>
    }

    renderContent() {
        if(this.state.screen === 'home') return <HomeScreen navTo={this.navTo}/>
        if(this.state.screen === 'code') return <CodeScreen/>
        if(this.state.screen === 'paint') return <PaintScreen/>
        if(this.state.screen === 'pipeline') return <PipelineEditor/>
        if(this.state.screen === 'queue') return <QueueScreen/>
        if(this.state.screen === 'about') return <AboutScreen/>
        if(this.state.screen === 'github') return <GithubScreen/>
        return <PipelineEditor/>
    }
}

export default App;
