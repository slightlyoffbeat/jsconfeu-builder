import React, { Component } from "react";

// Images
import logo from "../img/logo.svg";

const Navbar = props => {
  return (
    <div className="navbar">
      <div className="navbar__wrap">
        <a href="#" onClick={() => props.navTo("home")}>
          <img className="navbar__logo" src={logo} alt="Mozilla" />
        </a>

        <ul className="navbar__list">
          <li className="navbar__item">
            <a
              className="navbar__link"
              href="#"
              onClick={() => props.navTo("code")}
            >
              Code a Module
            </a>
          </li>
          <li className="navbar__item">
            <a
              className="navbar__link"
              href="#"
              onClick={() => props.navTo("queue")}
            >
              What's Coming Next
            </a>
          </li>
          <li className="navbar__item">
            <a
              className="navbar__link"
              href="#"
              onClick={() => props.navTo("about")}
            >
              About
            </a>
          </li>
          <li className="navbar__item">
            <a
              className="navbar__link"
              href="#"
              onClick={() => props.navTo("queue-editor")}
            >
              Queue Editor
            </a>
          </li>
          <li className="navbar__item navbar__item--github">
            <a
              className="navbar__button"
              href="#"
              onClick={() => props.startAuth("github")}
            >
              <span>Connect with Github</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
