import React, { Component } from "react";
import ModuleStore from "../ModuleStore";
import QueueModulePanel from "../components/ModulePanel";
const QueueScreen = props => {
  const modules = ModuleStore.getQueue();
  return (
    <article>
      {modules.map((mod, i) => (
        <QueueModulePanel key={i} module={mod} scale={i === 0 ? 50 : 15} />
      ))}
    </article>
  );
};
export default QueueScreen;
