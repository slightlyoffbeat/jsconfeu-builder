import React, { Component } from 'react';
import ModuleStore from './ModuleStore'
import QueueModulePanel from './QueueModulePanel'
const QueueScreen = (props) => {
    const modules = ModuleStore.getQueueModules()
    return <article>{modules.map((mod,i)=><QueueModulePanel key={i} module={mod} scale={i===0?15:5} threedee={i===0}/>)}</article>
}
export default QueueScreen



