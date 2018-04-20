import React, {Component} from "react";
import ModulePanel from "./ModulePanel";
import ModuleStore from "./ModuleStore";
import DraggableList from "react-draggable-list"

const STORE = ModuleStore

export default class PipelineEditor extends Component {
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
                {this.renderPreview()}
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

    renderPreview() {
        return <div id={"pipeline-preview"}>pipeline preview</div>
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

