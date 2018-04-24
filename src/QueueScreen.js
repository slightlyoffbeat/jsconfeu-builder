import React, {Component} from "react"

const QueueModulePanel = (props) => {
    return <div className="entry">
        <h3>{props.module.title}</h3>
        <p>{props.module.description}</p>
        <cite>by {props.module.author}</cite>
        <div className='img'>
            preview
        </div>
    </div>
}

function iter(from,to) {
    const arr = []
    for(let i=from; i<to; i++) {
        arr.push(i)
    }
    return arr
}

export default class  QueueScreen extends Component {
    render() {

        const modules = iter(0,10).map((i,ii)=> {
            return {
                type: 'module',
                title: 'title of the module',
                description: 'this is a description',
                author: 'bob@bob.com',
            }
        })
        return <article className="queue">
            {modules.map((mod, i) => <QueueModulePanel key={i} module={mod}/>)}
        </article>
    }
}
