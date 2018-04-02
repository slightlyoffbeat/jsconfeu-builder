import React, { Component } from 'react';
import './App.css';
import "font-awesome/css/font-awesome.css";
import ModuleStore from "./ModuleStore"
import ModulePanel from './ModulePanel'
const STORE = ModuleStore
class App extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        return (
            <div className="main">
                <div className="toolbar">
                    <button>save</button>
                    <button onClick={()=>{
                        STORE.start()
                    }}>play/pause</button>
                </div>

                <div className="library-search">
                    <input type="search" placeholder="search modules"/>
                </div>
                {this.renderLibraryResults()}
                {this.renderActiveModules()}
                {/*{this.renderPreviewPanel()}*/}
            </div>
        );
    }

    renderLibraryResults() {
        return <ul className="library-results">{STORE.getLibraryModules().map((mod)=>{
            return <li key={mod.name}>{mod.name}<i style={{flex:1}}></i> <i className="fa fa-bars"></i></li>
        })}</ul>
    }

    renderActiveModules() {
        return <ul className="active-list">{STORE.getActiveModules().map((mod,i) => {
            return <ModulePanel key={i} module={mod} store={STORE}/>
        })}</ul>
    }

    renderPreviewPanel() {
        return <div className="preview-panel">preview panel</div>
    }
}

export default App;
