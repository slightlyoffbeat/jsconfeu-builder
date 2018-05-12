import React, { Component } from "react";

// Components
import Hamburger from "../components/Hamburger";

// Images
import logo from "../img/logo.svg";
import logoSquare from "../img/logo-square.svg";

const Navbar = props => {
  return (
    <div className="navbar">
      <div className="navbar__wrap">
        <div className="navbar__mobile">
          <Hamburger />
          <img
            className="navbar__logo--mobile"
            src={logoSquare}
            alt="Mozilla"
          />
        </div>
        <a className="navbar__logo" href="#">
          <img src={logo} alt="Mozilla" />
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
              onClick={() => props.navTo("queu-editor")}
            >
              Queue Editor
            </a>
          </li>
        </ul>
        <a
          className="navbar__button"
          href="#"
          onClick={() => props.startAuth("github")}
        >
          <span>Connect with Github</span>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
