import React, { Component } from "react";

// images

const AboutScreen = props => {
  return (
    <div className="content">
      <div className="container">
        <div className="about">
          <h1 className="about__title">Arch</h1>
          <div className="about-grid">
            <p className="about__text">
              Artist Ian Brill is bringing his latest installation, Arch, to
              JSConf Berlin in collaboration with Mozilla. This interactive,
              multi-sensorial environment lets conference attendees experience
              the intersection of art and technology in a physical, pulsating,
              immersive way.
            </p>
            <p className="about__text">
              Visitors can walk through the larger-than-life Arch and experience
              an ever-changing light show of 30,000 colored LEDs. To support the
              exhibit, Mozilla engineers built a platform based on open web
              technologies that controls the web animation and makes the light
              display interactive. The result is fun and colorful -- and it
              gives web developers a chance to interact with new web
              technologies.
            </p>
          </div>
          <h2 className="mt12">Under the Hood</h2>
          <div className="about-grid">
            <p className="about__text mb6">
              Since the birth of the web, developers have been finding new and
              better ways to write code. It started with HTML, CSS, and
              JavaScript. Now the web has two new languages: Rust and
              WebAssembly.
            </p>
            <div className="about-box">
              <img src="#" alt="rust logo" />
              <p>
                Rust is an open-source systems programming language that focuses
                on speed, memory safety, and parallelism. It offers excellent
                performance characteristics and safe multithreading, so it runs
                well on multi-core devices like smartphones. Rust is a strongly
                typed language, so the compiled code is less vulnerable to
                common memory faults.{" "}
              </p>
              <a
                href="#"
                rel="noopener noreferrer"
                className="button button--primary about-box__button"
              >
                Learn more about Rust
              </a>
            </div>
            <div className="about-box">
              <img src="#" alt="WASM logo" />
              <p>
                WebAssembly is the most significant new technology to come to
                the web platform in a decade. The low-level language is a
                compiler target, letting developers run JavaScript, Rust, and
                C/C++ code on the web at near-native speeds. Faster execution in
                the browser means developers can build more complex web
                applications, without requiring a plug-in.
              </p>
              <a
                href="#"
                rel="noopener noreferrer"
                className="button button--primary about-box__button"
              >
                Learn more about WebAssembly
              </a>
            </div>
          </div>
          <h3 className="mt10 mb2">Rust + WebAssembly</h3>
          <div className="about-grid">
            <p className="about__text">
              Rust code can be compiled to WebAssembly and run in the browser,
              bringing systems programming capabilities to the web for the first
              time. The web-enabled Arch exhibit is a proof-of-concept for new
              tools from Mozilla that can help web developers include Rust and
              WebAssembly in their projects: the WebAssembly Studio IDE,
              wasm-pack, and wasm-bindgen.{" "}
            </p>
          </div>
          <a
            href="#"
            rel="noreferrer noopener"
            className="button button--primary mt2"
          >
            Learn more about using Rust with WebAssembly
          </a>
          <br />
          <h2 className="mt12 mb6">About the Artist</h2>
          <div className="about-grid about-ian">
            <img className="about-ian__img" src="#" alt="Ian Brill" />
            <div className="about-ian__text">
              <p>
                Ian Brill is an installation artist whose work focuses on
                finding form through process and the audience’s immersive
                relationship with technology. His installations, performances,
                and writing have been presented internationally, at conferences,
                festivals, and galleries. A New York native now living in
                Pittsburg, Brill teaches art at Penn State University's World
                Campus and the Community College of Beaver County.{" "}
              </p>
              <p>Find out more about Ian Brill by visiting his website</p>
              <a
                className="button button--primary"
                rel="noopener noreferrer"
                href="https://www.ianbrill.org/about"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
