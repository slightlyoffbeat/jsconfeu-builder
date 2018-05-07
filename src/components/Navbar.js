import React, { Component } from "react";

const Navbar = props => {
  return (
    <div className="navbar">
      <a href="#" className="logo" onClick={() => props.navTo("home")}>
        Mozilla
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
        <li className="navbar__item navbar__item--github">
          <a
            className="button"
            href="#"
            onClick={() => props.startAuth("github")}
          >
            Github
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
