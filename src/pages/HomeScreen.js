import React, { Component } from "react";

const HomeScreen = props => {
  return (
    <div className="content">
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__text">
            <h1>
              Create art & <br className="no-mobile" />see it on the arch
            </h1>

            <p>
              Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum
              dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor.
            </p>
          </div>
        </div>
      </section>

      <section className="wells">
        <h2>Ways to get started</h2>
        <div>
          <div className="panel">
            <i className="fa fa-square fa-4x icon" />
            <span>Code a module in WebAssembly studio</span>
            <a href="#">Code a Module</a>
          </div>
          <div className="panel">
            <i className="fa fa-headphones fa-4x icon" />
            <span>Use a VR headset or AR setup to paint</span>
            <a href="#">Start Painting</a>
          </div>
          <div className="panel">
            <i className="fa fa-paint-brush fa-4x icon" />
            <span>Build a pipeline lorem ipsum dolar sit</span>
            <a href="#">Start Assembling</a>
          </div>
        </div>
      </section>

      <section className="queue">
        <div className="panel">
          <h3>See what's up next</h3>
          <p>
            Check out what is in the queue and find out when yours will be up.
          </p>
          <a
            href="#"
            className="round-button"
            onClick={() => props.navTo("queue")}
          >
            View the Queue
          </a>
        </div>
        <div className="img" />
      </section>
    </div>
  );
};
export default HomeScreen;
