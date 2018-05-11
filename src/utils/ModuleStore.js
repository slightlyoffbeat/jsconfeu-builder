import Constants from "../Constants";
import AuthStore from "./AuthStore";

class ModuleStore {
  constructor() {
    this.queue = {
      expanded: [],
      modules: []
    };
    this.refreshQueue();
    this.listeners = {};
    this.running = false;
  }
  on(type, cb) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(cb);
    return cb;
  }
  off(type, cb) {
    this.listeners[type] = this.listeners[type].filter(c => c !== cb);
  }
  fire(type, obj) {
    this.listeners[type].forEach(cb => cb(obj));
  }
  findAllModules = () =>
    fetch(`${Constants.BASE_URL}/modules`)
      .then(res => res.json())
      .then(res => {
        console.log("got the modules", res);
        return res;
      })
      .catch(e => {
        console.log("error fetching all the modules:", e);
        return [];
      });

  refreshQueue() {
    return fetch(`${Constants.BASE_URL}/queue`)
      .then(res => res.json())
      .then(queue => {
        this.queue = queue;
        this.queue.expanded.forEach((m, i) => (m.index = i));
        this.fire("queue", queue);
      })
      .catch(e => {
        console.log("error fetching the queue:", e);
      });
  }

  getQueueModules = () => this.queue.expanded;

  setQueueModules = nq => {
    this.queue.expanded = nq;
    this.queue.modules = this.queue.expanded.map(m => m._id);
    return this.updateQueue();
  };

  submitModule(module) {
    return fetch(`${Constants.BASE_URL}/publish`, {
      method: "POST",
      body: JSON.stringify(module),
      mode: "cors",
      headers: {
        "content-type": "application/json",
        "access-key": AuthStore.getAccessToken()
      }
    })
      .then(res => res.json())
      .then(res => console.log(res))
      .then(res => this.refreshQueue())
      .catch(e => {
        console.log("error submitting a module:", e);
      });
  }
  addModuleToQueue = m => {
    this.queue.expanded.push(m);
    this.queue.modules = this.queue.expanded.map(m => m._id);
    return this.updateQueue();
  };
  updateQueue = () => {
    return fetch(`${Constants.BASE_URL}/updatequeue`, {
      method: "POST",
      body: JSON.stringify(this.queue.modules),
      mode: "cors",
      headers: {
        "content-type": "application/json",
        "access-key": AuthStore.getAccessToken()
      }
    })
      .then(res => res.json())
      .then(res => console.log(res))
      .then(res => this.refreshQueue());
  };
  deleteModuleFromQueue = m => {
    const i = m.index;
    this.queue.expanded.splice(i, 1);
    this.queue.modules.splice(i, 1);
    console.log("the new queue is", this.queue.modules.length);
    return this.updateQueue();
  };
}

function o2a(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

export default new ModuleStore();
