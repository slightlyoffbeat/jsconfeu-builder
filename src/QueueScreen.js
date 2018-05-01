import React, { Component } from 'react';
const QueueScreen = (props) => {
    return <article>
        <section>
            <h2>Currently On</h2>
            <h3>Title</h3>
            <p>This describes the module to people</p>
            <cite>by Author Name</cite>
            <div className='img'>
                currently on the screen
            </div>
        </section>a
        <ol>
            <li>
                <div className="entry">
                    <h3>Title</h3>
                    <p>This describes the module to people</p>
                    <cite>by Author Name</cite>
                    <div className='img'>
                        preview
                    </div>
                </div>
            </li>
            <li>
                <div className="entry">
                    <h3>Title</h3>
                    <p>This describes the module to people</p>
                    <cite>by Author Name</cite>
                    <div className='img'>
                        preview
                    </div>
                </div>
            </li>
        </ol>
    </article>
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
