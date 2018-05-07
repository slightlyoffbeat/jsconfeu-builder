import React, { Component } from "react";
import ModulePanel from "../components/ModulePanel";
import ModuleStore from "../ModuleStore";
import DraggableList from "react-draggable-list";
import * as THREE from "three";

const STORE = ModuleStore;

class PreviewComponent extends Component {
  componentDidMount() {
    const w = 600;
    const h = 400;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(0xff0000, 1);
    this.renderer.setSize(w, h);

    const geometry = new THREE.BoxGeometry(3, 4, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
    this.mounted = true;
    this.startRepaint();
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  startRepaint() {
    const repaint = () => {
      if (!this.mounted) return;
      this.cube.rotation.y += 0.01;
      requestAnimationFrame(repaint);
      this.renderer.render(this.scene, this.camera);
    };
    repaint();
  }
  render() {
    const w = 600;
    const h = 400;
    return (
      <canvas
        id="pipeline-preview"
        width={w}
        height={h}
        ref={canvas => (this.canvas = canvas)}
      />
    );
  }
}
export default class PipelineEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searching: false,
      searchResults: [],
      active: STORE.getActiveModules()
    };

    STORE.on("active", active => {
      console.log("active has changed");
      this.setState({ active: active });
    });
  }

  search = e => {
    const val = e.target.value;
    this.setState({ searchText: e.target.value, searching: val.length > 0 });
    STORE.findLibraryModules(e.target.value).then(res => {
      this.setState({ searchResults: res });
    });
  };

  clearSearch = e => {
    this.setState({ searchText: "", searching: false });
  };

  addModule = mod => {
    STORE.addActiveModule(mod);
  };

  render() {
    return (
      <div className="main">
        <div className="toolbar">
          <button>save</button>
          <button
            onClick={() => {
              if (STORE.isRunning()) {
                STORE.stop();
              } else {
                STORE.start();
              }
            }}
          >
            play/pause
          </button>
        </div>

        <div className="library-search">
          <input
            type="search"
            placeholder="search modules"
            onChange={this.search}
            value={this.state.searchText}
          />
          <button className="fa fa-close" onClick={this.clearSearch} />
        </div>
        {this.renderLibraryResults()}
        {this.renderPreview()}
        {this.renderActiveModules()}
      </div>
    );
  }

  renderLibraryResults() {
    const modules = this.state.searching
      ? this.state.searchResults
      : STORE.getLibraryModules();
    return (
      <ul className="library-results">
        {modules.map(mod => {
          return (
            <li key={mod.name}>
              {mod.name}
              <i style={{ flex: 1 }} />{" "}
              <i
                className="fa fa-plus action"
                onClick={() => this.addModule(mod)}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  renderPreview() {
    return <PreviewComponent />;
  }

  renderActiveModules() {
    return (
      <div
        id="active-list"
        className="list-container"
        ref={ref => (this.active_modules_container = ref)}
      >
        <DraggableList
          list={this.state.active}
          itemKey={"id"}
          template={ModulePanel}
          conatiner={() => this._active_modules_container}
          padding={10}
          commonProps={{ store: STORE }}
          onMoveEnd={list => STORE.setActiveModules(list)}
        />
      </div>
    );
  }
}
