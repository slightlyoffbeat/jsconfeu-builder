import React, { Component } from 'react';
import './App.css';
import "font-awesome/css/font-awesome.css";
import ModuleStore from "./ModuleStore"
import ModulePanel from './ModulePanel'
const STORE = ModuleStore
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText:'',
            searching:false,
            searchResults:[],
        }
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
                {/*{this.renderPreviewPanel()}*/}
            </div>
        );
    }

    renderLibraryResults() {
        const modules = this.state.searching?this.state.searchResults:STORE.getLibraryModules()
        return <ul className="library-results">{modules.map((mod) => {
            return <li key={mod.name}>{mod.name}<i style={{flex: 1}}/> <i className="fa fa-bars"/></li>
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
