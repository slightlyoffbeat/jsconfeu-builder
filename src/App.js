import React, { Component } from 'react';
import './App.css';
import "font-awesome/css/font-awesome.css";
import DraggableList from "react-draggable-list"

import ModuleStore from "./ModuleStore"
import ModulePanel from './ModulePanel'
const STORE = ModuleStore
class PipelineEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText:'',
            searching:false,
            searchResults:[],
            active:STORE.getActiveModules(),
        }

        STORE.on('active',(active)=>{
            console.log('active has changed')
            this.setState({active:active})
        })
    }

    search = (e)=>{
        const val = e.target.value
        this.setState({searchText:e.target.value, searching:val.length > 0})
        STORE.findLibraryModules(e.target.value).then((res)=>{
            this.setState({searchResults:res})
        })
    }

    clearSearch = (e) => {
        this.setState({searchText:'', searching:false})
    }

    addModule = (mod) => {
        STORE.addActiveModule(mod)
    }

    render() {
        return (
            <div className="main">
                <div className="toolbar">
                    <button>save</button>
                    <button onClick={()=>{
                        if(STORE.isRunning()) {
                            STORE.stop()
                        } else {
                            STORE.start()
                        }
                    }}>play/pause</button>
                </div>

                <div className="library-search">
                    <input type="search" placeholder="search modules" onChange={this.search} value={this.state.searchText}/>
                    <button className="fa fa-close" onClick={this.clearSearch}/>
                </div>
                {this.renderLibraryResults()}
                {this.renderActiveModules()}
            </div>
        );
    }

    renderLibraryResults() {
        const modules = this.state.searching?this.state.searchResults:STORE.getLibraryModules()
        return <ul className="library-results">{modules.map((mod) => {
            return <li key={mod.name}>{mod.name}<i style={{flex: 1}}/> <i className="fa fa-plus action" onClick={()=>this.addModule(mod)}/></li>
        })}</ul>
    }

    renderActiveModules() {
        return <div id="active-list" className="list-container" ref={(ref)=>this.active_modules_container = ref}>
            <DraggableList
                list={this.state.active}
                itemKey={'id'}
                template={ModulePanel}
                conatiner={()=>this._active_modules_container}
                padding={10}
                commonProps={{store:STORE}}
                onMoveEnd={(list)=>STORE.setActiveModules(list)}
            />
        </div>
    }

}

const Toolbar = (props) => {
    return <div id="toolbar">
        <a href='#' className="logo" onClick={()=>props.navTo('home')}>Mozilla</a>
        <a href="#" onClick={()=>props.navTo('code')}>Code a Module</a>
        <a href="#" onClick={()=>props.navTo('paint')}>Create with AR</a>
        <a href="#" onClick={()=>props.navTo('pipeline')}>Create an Animation</a>
        <a href="#" onClick={()=>props.navTo('queue')}>What's Coming Next</a>
        <a href="#" onClick={()=>props.navTo('about')}>About</a>
        <a href="#" onClick={()=>props.navTo('github')} className="round-button">Connect with GitHub</a>
    </div>

}
const HomeScreen = (props) => {
    return <article>
        <section className="narrow-left">
        <h1>Create art and see it on the arch.</h1>

        <p>
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
            Lorem ipsum dolor
        </p>
        </section>

        <section className="wells">
            <h2>Ways to get started</h2>
            <div>
                <div className="panel">
                    <i className="fa fa-square fa-4x icon"/>
                    <span>Code a module in WebAssembly studio</span>
                    <a href='#'>Code a Module</a>
                </div>
                <div className="panel">
                    <i className="fa fa-headphones fa-4x icon"/>
                    <span>Use a VR headset or AR setup to paint</span>
                    <a href='#'>Start Painting</a>
                </div>
                <div className="panel">
                    <i className="fa fa-paint-brush fa-4x icon"/>
                    <span>Build a pipeline lorem ipsum dolar sit</span>
                    <a href='#'>Start Assembling</a>
                </div>
            </div>
        </section>

        <section className="queue">
            <div className="panel">
                <h3>See what's up next</h3>
                <p>Check out what is in the queue and find
                out when yours will be up.</p>
                <a href='#' className="round-button">View the Queue</a>
            </div>
            <div className="img"/>
        </section>
    </article>
}
const CodeScreen = (props) => {
    return <article>
        Web Assembly Container
    </article>
}
const PaintScreen = (props) => {
    return <article>
        AR Experience Container
        </article>
}
const QueueScreen = (props) => {
    return <article>
    <section>
        <h2>Currently On</h2>
        <h3>Title</h3>
        <p>This describes the module to people</p>
        <cite>by Author Name</cite>
        <div className='img'>
            currently on the screen
        </div>
    </section>
        <ol>
            <li>
                <div className="entry">
                    <h3>Title</h3>
                    <p>This describes the module to people</p>
                    <cite>by Author Name</cite>
                    <div className='img'>
                        preview
                    </div>
                </div>
            </li>
            <li>
                <div className="entry">
                    <h3>Title</h3>
                    <p>This describes the module to people</p>
                    <cite>by Author Name</cite>
                    <div className='img'>
                        preview
                    </div>
                </div>
            </li>
        </ol>
    </article>
}
const AboutScreen = (props) => {
    return <div> about screen</div>
}
const GithubScreen = (props) => {
    return <article>github stuff</article>
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screen:"home"
        }
    }
    navTo = (screen) => {
        this.setState({screen:screen})
    }
    render() {
        return <div id="body">
            <Toolbar navTo={this.navTo}/>
            <div id="content">
                {this.renderContent()}
            </div>
            <div id="footer">
                footer
            </div>
        </div>
    }

    renderContent() {
        if(this.state.screen === 'home') return <HomeScreen/>
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
