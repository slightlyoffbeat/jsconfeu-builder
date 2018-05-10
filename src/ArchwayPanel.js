import React, {Component} from "react";
import * as OBJLoader from './OBJLoader.js'
import Constants from './Constants'
const THREE = require('three');

export default class ArchwayPanel extends Component {
    componentDidMount() {
        this.mounted = true;
        this.rows = Constants.ROWS
        this.columns = Constants.COlS

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.6))
        this.materials = new Map(); // name (string like 1x10 for RxC) => THREE.Material
        const w = 600;
        const h = 400;
        this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ canvas:this.canvas });
        this.renderer.setClearColor(0xFFFFFF, 1);
        this.renderer.setSize(w, h);

        this.currentFrame = 0
        this.loaded = false
        const loader = new THREE.OBJLoader();
        loader.load('models/PreppedInstallation.obj', (object) => {
            object.position.set(0, -1.5, -8.5);
            this.scene.add(object);
            for(let material of object.children[0].material){
                this.materials.set(material.name, material);
            }
            this.clearToColor(0xFF00FF);
            // this.loadFrame(TestFrames.frames[0], TestFrames.height, TestFrames.width);
            window.obj = object
            this.arch = object
            this.loaded = true
        }, null, err => {
            console.error('Could not load the archway', err);
        });
        this.startRepaint();
        console.log("running with the frames",this.props.frames)
    }
    cycleFrames() {
        if(!this.loaded) return
        this.currentFrame++
        if(!this.props.frames) return
        const frame = this.props.frames.frames[this.currentFrame%this.props.frames.frames.length]
        this.loadFrame(frame, this.props.frames.height, this.props.frames.width)
    }
    componentWillUnmount() {
        this.mounted = false
    }
    clearToColor(hexColorInteger, rows=this.rows, columns=this.columns){
        for(let r=0; r < rows; r++){
            for(let c=0; c < columns; c++){
                let material = this.materials.get(`${r}x${c}`)
                if(!material) {
                    console.log('material not found', `${r}x${c}`);
                    continue;
                }
                material.color.setHex(hexColorInteger);
            }
        }
    }
    loadFrame(frame, rows=this.rows, columns=this.columns){
        if(frame.length !== rows * columns){
            console.error('Bad frame', rows, columns, rows*columns, frame.length);
            return;
        }
        for(let r=0; r < rows; r++){
            for(let c=0; c < columns; c++){
                let material = this.materials.get(`${r}x${c}`)
                if(!material) {
                    // console.log('miss', `${r}x${c}`);
                    continue;
                }
                const color = frame[(r*columns)+c]
                material.color.setHex(color>>8) // The shift drops the alpha bits
            }
        }
        window.mats = this.materials;
    }

    startRepaint() {
        let lastFrame = performance.now()
        const repaint = (time)=> {
            if(!this.mounted) return;
            requestAnimationFrame(repaint);
            if(time - lastFrame > 200) {
                lastFrame = time
                this.cycleFrames()
            }
            this.renderer.render(this.scene, this.camera);
        }
        repaint();
    }
    render() {
        const w = 600;
        const h = 400;
        return <canvas id="pipeline-preview" width={w} height={h} ref={(canvas) => this.canvas = canvas} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}/>
    }

    mouseDown = (e) => {
        this.startX = e.clientX
        this.startRY = this.arch.rotation.y
    }
    mouseMove = (e) => {
        if(e.buttons === 1) {
            const dx = e.clientX - this.startX
            const dry = dx*Math.PI/180
            console.log(dry)
            this.arch.rotation.y = this.startRY + dry
            // console.log(this.arch.rotation.y)
        }
        // console.log("mouse",e.clientX, e.buttons, e.button)
    }
    mouseUp = (e) => {

    }
}

const TestColors = [0x000000FF, 0x0000FFFF, 0x00FF00FF, 0x00FFFFFF, 0xFF0000FF, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFFFF];

const TestFrames = {
    width: 36,
    height: 44,
    frames: []
}

for(var frame=0; frame < 5; frame++){
    const oddColor = TestColors[frame % TestColors.length];
    const evenColor = TestColors[(frame + 1) % TestColors.length];
    let frameData = [];
    for(let r=0; r < TestFrames.height; r++){
        for(let c=0; c < TestFrames.width; c++){
            frameData[(r * TestFrames.width) + c] = c % 2 == 0 ? evenColor : oddColor;
        }
    }
    TestFrames.frames[frame] = frameData;
}
