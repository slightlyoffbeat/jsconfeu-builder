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
import QueueEditor from './QueueEditor'

const UserLoginButton = (props) => {
    if(AuthStore.isLoggedIn()) {
        return <a href="#"
                  onClick={()=>AuthStore.logout()}
        >Logout {AuthStore.getCurrentUser().displayName}</a>
    } else {
        return <a href="#"
                  onClick={() => AuthStore.start()}
                  className="round-button">Connect with GitHub</a>
    }

}
const Toolbar = (props) => {
    return <div id="toolbar">
        <a href='#' className="logo" onClick={()=>props.navTo('home')}>Mozilla</a>
        <a href="#" onClick={()=>props.navTo('code')}>Code a Module</a>
        {/*<a href="#" onClick={()=>props.navTo('paint')}>Create with AR</a>*/}
        {/*<a href="#" onClick={()=>props.navTo('pipeline')}>Create an Animation</a>*/}
        <a href="#" onClick={()=>props.navTo('queue')}>What's Coming Next</a>
        <a href="#" onClick={()=>props.navTo('about')}>About</a>
        <UserLoginButton/>
        <a href="#" onClick={()=>props.navTo('queue-editor')}>QUEUE EDITOR</a>
    </div>
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screen:"home",
            user:null,
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
    navTo = (screen, data) => this.setState({screen:screen, data:data})
    onSubmit = (module) => {
        console.log("submitting the module",module)

        function missing(str) {
            if(!str) return true
            if(str.trim().length === 0) return true
            return false
        }
        if(missing(module.title)) throw new Error("module is missing a title")
        if(missing(module.description)) throw new Error("module is missing a description")
        console.log("checking missing")

        if(!this.state.user) {
            console.log("not authenitcated. can't submit")
            AuthStore.start()
        } else {
            ModuleStore.submitModule(module).then(() => {
                return this.navTo('code-submit-done')
            }).catch((e) => {
                console.log("error submitting", e)
            })
        }
    }
    render() {
        return <div id="body">
            <Toolbar navTo={this.navTo}/>
            <div id="content">{this.renderContent()}</div>
            <div id="footer">footer hello user {this.state.user?"logged in " + this.state.user.displayName:"logged out"}</div>
        </div>
    }

    renderContent() {
        if(this.state.screen === 'home') return <HomeScreen navTo={this.navTo}/>
        if(this.state.screen === 'code') return <CodeScreen navTo={this.navTo} data={this.state.data}/>
        if(this.state.screen === 'code-preview') return <CodeScreen.Preview navTo={this.navTo} data={this.state.data}/>
        if(this.state.screen === 'code-submit') return <CodeScreen.Submit navTo={this.navTo}
                                                                          data={this.state.data}
                                                                          onSubmit={this.onSubmit}
                                                                          editData={(data)=>this.setState({data:data})}/>
        if(this.state.screen === 'code-submit-done') return <CodeScreen.SubmitDone navTo={this.navTo} data={this.state.data}/>
        if(this.state.screen === 'paint') return <PaintScreen/>
        if(this.state.screen === 'pipeline') return <PipelineEditor/>
        if(this.state.screen === 'queue') return <QueueScreen navTo={this.navTo}/>
        if(this.state.screen === 'queue-editor') return <QueueEditor navTo={this.navTo}/>
        if(this.state.screen === 'about') return <AboutScreen/>
        return <PipelineEditor/>
    }
}

export default App;
