import React, { Component } from "react";

import gradient from "../img/pattern-top.svg";
import gradientBottom from "../img/pattern-bottom.svg";

const Pattern = props => {
  const divStyle = {
    backgroundImage: `url(${
      props.position === "bottom" ? gradientBottom : gradient
    })`
  };

  return (
    <div
      style={divStyle}
      className={`pattern ${
        props.position === "bottom" ? "pattern--bottom" : "pattern--top"
      }`}
    />
  );
};

export default Pattern;
