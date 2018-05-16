import React, { Component } from 'react';
import ArchwayPanel from './ArchwayPanel'


function intToHex(int) {
    let str = int.toString(16)
    while (str.length < 8) str = "0"+str
    // console.log("converting",str)
    return '#' + str
}

function hex2rgba(hexa){
    const r = parseInt(hexa.slice(1,3), 16);
    const g = parseInt(hexa.slice(3,5), 16);
    const b = parseInt(hexa.slice(5,7), 16);
    const a = parseInt(hexa.slice(7,9), 16)/255;
    return 'rgba('+r+', '+g+', '+b+', '+a+')';
}


export default class QueueModulePanel extends Component {
    componentDidMount() {
        if(this.canvas && this.props.module && this.props.module.manifest.animation) {
            this.drawFirstFrame(this.canvas,this.props.module.manifest.animation, this.props.scale)
        }
    }
    componentWillReceiveProps(newProps) {
        //force refresh if the module changes
        if(this.props.module._id !== newProps.module._id) {
            this.drawFirstFrame(this.canvas,newProps.module.json, newProps.scale)
        }
    }

    drawFirstFrame(can, anim, sc) {
        function getPixelOnFrame(x,y,f,anim) {
            return anim.data[f][y][x]
        }
        function pixelToRGB(px) {
            return `rgb(${px[0]},${px[1]},${px[2]})`
        }
        const ctx = can.getContext('2d')
        const frame = anim.data[0]
        if(!frame) return console.error("animation has no frames")

        const w = anim.cols
        const h = anim.rows
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,w*sc,h*sc)
        for(let x=0; x<w; x++) {
            for(let y=0; y<h; y++) {
                const px = getPixelOnFrame(x,y,0,anim)
                ctx.fillStyle = pixelToRGB(px)
                ctx.fillRect(x*sc,y*sc,sc,sc)
            }
        }
    }
    render() {
        return <div className="queue-module">
            <div style={{display:'flex',flexDirection:'column', padding:'1em'}}>
                <h3>{this.props.module.title}</h3>
                <p>{this.props.module.description}</p>
                <cite>{this.props.module.author}</cite>
                <i>{this.props.module.tags.join(", ")}</i>
            </div>
            {this.renderCanvas()}
        </div>
    }

    renderCanvas() {
        if(this.props.threedee === true) {
            return <ArchwayPanel frames={this.props.module.manifest.animation}/>
        } else {
            const w = this.props.module.manifest.animation.cols || 0
            const h = this.props.module.manifest.animation.rows || 0
            return <canvas ref={can=>this.canvas=can} width={w * this.props.scale} height={h * this.props.scale}>animation</canvas>
        }
    }
}
