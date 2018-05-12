import React, { Component } from "react";

// images
import wasm from "../img/icon-wasm.svg";
import vr from "../img/icon-vr.svg";
import create from "../img/icon-create.svg";
import queue from "../img/icon-queue.svg";

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

      <section className="started">
        <div className="container">
          <h2>Ways to get started</h2>
          <div className="started__row">
            <div className="started__section">
              <img
                className="started__img"
                className="started__icon"
                src={wasm}
                alt="webassembly"
              />
              <span className="started__text">
                Code a module in WebAssembly studio
              </span>
              <a className="started__button button button--primary" href="#">
                Code a Module
              </a>
            </div>
            <div className="started__section">
              <img className="started__icon" src={vr} alt="webassembly" />
              <span className="started__text">
                Use a VR headset or AR setup to paint
              </span>
              <a
                className="started__button started__button button button--primary"
                href="#"
              >
                Start Painting
              </a>
            </div>
            <div className="started__section">
              <img className="started__icon" src={create} alt="webassembly" />
              <span className="started__text">
                Create an animation lorem ipsum dolar
              </span>
              <a className="started__button button button--primary" href="#">
                Start Something
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="next">
        <div className="container">
          <h2>See what's up next</h2>
          <div className="next__grid">
            <div className="next__img">
              <div className="next__imagetemp" />
            </div>
            <div className="next__info">
              <img className="mb3" src={queue} alt="queue icon" />
              <p className="mb3">
                Check out what is in the queue and find out when yours will be
                up.
              </p>
              <a href="#" className="button button--primary">
                View the Queue
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomeScreen;
