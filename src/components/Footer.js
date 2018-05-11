import React, { Component } from "react";

const Footer = props => {
  return (
    <div className="footer">
      footer hello user{" "}
      {props.user ? "logged in " + props.user.displayName : "logged out"}
    </div>
  );
};

export default Footer;
