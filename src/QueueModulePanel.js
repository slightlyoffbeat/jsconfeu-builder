import React, { Component } from 'react';


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
        if(this.canvas && this.props.module && this.props.module.json) {
            this.drawFrame(this.canvas,this.props.module.json, this.props.scale)
        }
    }
    drawFrame(can, anim,sc) {
        const ctx = can.getContext('2d')
        const frame = anim.frames[0]
        if(!frame) return console.error("animation has no frames")

        const w = anim.width
        const h = anim.height
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,w*sc,h*sc)
        for(let x=0; x<w; x++) {
            for(let y=0; y<h; y++) {
                const n = y * w + x
                ctx.fillStyle = hex2rgba(intToHex(frame[n]))
                ctx.fillRect(x*sc,y*sc,sc,sc)
            }
        }
    }
    render() {
        const w = this.props.module.json.width || 0
        const h = this.props.module.json.height || 0
        return <div className="queue-module">
            <h3>{this.props.module.title}</h3>
            <p>{this.props.module.description}</p>
            <cite>{this.props.module.author}</cite>
            <p>{this.props.module.tags.map(t => <i key={t}>{t}, </i>)}</p>
            <canvas ref={can=>this.canvas=can} width={w * this.props.scale} height={h * this.props.scale}>animation</canvas>
        </div>
    }
}
