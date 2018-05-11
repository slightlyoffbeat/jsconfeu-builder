import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

// Images
import logo from "../img/logo.svg";

const NavbarLink = props => (
  <li className="navbar__item">
    <Link className="navbar__link" to={props.link}>
      {props.title}
    </Link>
  </li>
);

const Navbar = props => {
  return (
    <div className="navbar">
      <div className="navbar__wrap">
        <NavLink to="/">
          <img className="navbar__logo" src={logo} alt="Mozilla" />
        </NavLink>

        <ul className="navbar__list">
          <li className="navbar__item">
            <NavLink className="navbar__link" to="/code">
              Code a Module
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink className="navbar__link" to="queue">
              What's Coming Next
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink className="navbar__link" to="about">
              About
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink className="navbar__link" to="queue-editor">
              Queue Editor
            </NavLink>
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
