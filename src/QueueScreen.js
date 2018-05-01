import React, { Component } from 'react';
import ModuleStore from './ModuleStore'
const QueueScreen = (props) => {
    const modules = ModuleStore.getQueue()
    return <article>{modules.map((mod,i)=><QueueModulePanel key={i} module={mod} scale={i===0?20:5}/>)}</article>
}
export default QueueScreen

const QueueModulePanel = (props) => {
    return <div className="queue-module">
        <h3>Title</h3>
        <p>the description of the module</p>
        <cite>by Author Name</cite>
        <canvas width={44*5} height={36*5}>animation</canvas>
    </div>
}
