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
import AuthStore from "./AuthStore"

const Toolbar = (props) => {
    return <div id="toolbar">
        <a href='#' className="logo" onClick={()=>props.navTo('home')}>Mozilla</a>
        <a href="#" onClick={()=>props.navTo('code')}>Code a Module</a>
        {/*<a href="#" onClick={()=>props.navTo('paint')}>Create with AR</a>*/}
        {/*<a href="#" onClick={()=>props.navTo('pipeline')}>Create an Animation</a>*/}
        <a href="#" onClick={()=>props.navTo('queue')}>What's Coming Next</a>
        <a href="#" onClick={()=>props.navTo('about')}>About</a>
        <a href="#" onClick={()=>props.startAuth('github')} className="round-button">Connect with GitHub</a>
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
            screen:"queue",
            user:null
        }
        AuthStore.listenToLogin(()=>{
            console.log("the user is logged in")
            AuthStore.checkAuth().then((user)=>{
                console.log("the user object is",user)
                this.setState({user:user})
            })
        })
        AuthStore.checkAuth().then((user)=>{
            console.log("checking user",user)
            if(user) {
                this.setState({user:user})
            }
        })
    }
    navTo = (screen) => this.setState({screen:screen})
    render() {
        return <div id="body">
            <Toolbar navTo={this.navTo} startAuth={()=>AuthStore.start()}/>
            <div id="content">{this.renderContent()}</div>
            <div id="footer">footer hello user {this.state.user?"logged in " + this.state.user.displayName:"logged out"}</div>
        </div>
    }

    renderContent() {
        if(this.state.screen === 'home') return <HomeScreen navTo={this.navTo}/>
        if(this.state.screen === 'code') return <CodeScreen navTo={this.navTo}/>
        if(this.state.screen === 'code-preview') return <CodeScreen.Preview navTo={this.navTo}/>
        if(this.state.screen === 'code-submit') return <CodeScreen.Submit navTo={this.navTo}/>
        if(this.state.screen === 'code-submit-done') return <CodeScreen.SubmitDone navTo={this.navTo}/>
        if(this.state.screen === 'paint') return <PaintScreen/>
        if(this.state.screen === 'pipeline') return <PipelineEditor/>
        if(this.state.screen === 'queue') return <QueueScreen navTo={this.navTo}/>
        if(this.state.screen === 'about') return <AboutScreen/>
        if(this.state.screen === 'github') return <GithubScreen/>
        return <PipelineEditor/>
    }
}

export default App;
