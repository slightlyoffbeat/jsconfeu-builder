import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

// Components
import Hamburger from "../components/Hamburger";

// Images
import logo from "../img/logo.svg";
import logoSquare from "../img/logo-square.svg";

const collapseMenu = () => {
  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".navbar__list");
  const body = document.body;
  console.log("bang");

  if (mobileNav.classList.contains("is-active")) {
    console.log("bang2");
    burger.classList.toggle("is-active");
    mobileNav.classList.toggle("is-active");
    body.classList.toggle("nav-active");
  }
};

const NavbarLink = props => (
  <li className="navbar__item">
    <NavLink className="navbar__link" to={props.link} onClick={collapseMenu}>
      {props.title}
    </NavLink>
  </li>
);

const Navbar = props => {
  return (
    <div className="navbar">
      <div className="navbar__wrap">
        <NavLink className="navbar__logo" to="/">
          <img src={logo} alt="Mozilla" />
        </NavLink>
        <div className="navbar__mobile">
          <Hamburger />
          <NavLink to="/" onClick={collapseMenu}>
            <img
              className="navbar__logo--mobile"
              src={logoSquare}
              alt="Mozilla"
            />
          </NavLink>
        </div>

        <ul className="navbar__list">
          <NavbarLink link="/code" title="Code a Module" />
          <NavbarLink link="/queue" title="What's Coming Next" />
          <NavbarLink link="/about" title="About" />
          <NavbarLink link="/queue-editor" title="Queue Editor" />
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
