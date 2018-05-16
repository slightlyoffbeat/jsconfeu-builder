import React, { Component } from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom"

// Styles & Icons
import "./style/style.css";
import "font-awesome/css/font-awesome.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import PipelineEditor from "./pages/PipelineEditor";
import HomeScreen from "./pages/HomeScreen";
import CodeScreen from "./pages/CodeScreen";
import PaintScreen from "./pages/PaintScreen";
import QueueScreen from "./pages/QueueScreen";
import QueueEditor from "./pages/QueueEditor";
import AboutScreen from "./pages/AboutScreen";

// Other
import ModuleStore from "./utils/ModuleStore";
import AuthStore from "./utils/AuthStore";

const UserLoginButton = props => {
  if (AuthStore.isLoggedIn()) {
    return (
      <a href="#" onClick={() => AuthStore.logout()}>
        Logout {AuthStore.getCurrentUser().displayName}
      </a>
    );
  } else {
    return (
      <a href="#" onClick={() => AuthStore.start()} className="round-button">
        Connect with GitHub
      </a>
    );
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "home",
      user: null
    };
    AuthStore.listenToLogin(() => {
      console.log("the user is logged in");
      AuthStore.checkAuth().then(user => {
        console.log("the user object is", user);
        this.setState({ user: user });
      });
    });
    AuthStore.checkAuth().then(user => {
      console.log("checking user", user);
      if (user) {
        this.setState({ user: user });
      }
    });
  }
  navTo = (screen, data) => this.setState({ screen: screen, data: data });
  onSubmit = module => {
    console.log("submitting the module", module);

    function missing(str) {
      if (!str) return true;
      if (str.trim().length === 0) return true;
      return false;
    }
    if (missing(module.title)) throw new Error("module is missing a title");
    if (missing(module.description))
      throw new Error("module is missing a description");
    console.log("checking missing");

    if (!this.state.user) {
      console.log("not authenitcated. can't submit");
      AuthStore.start();
    } else {
      ModuleStore.submitModule(module)
        .then(() => {
          return this.navTo("code-submit-done");
        })
        .catch(e => {
          console.log("error submitting", e);
        });
    }
  };
  render() {
      return (
      <div id="body">
        <Router>
          <div>
            <Navbar navTo={this.navTo} startAuth={() => AuthStore.start()} />
              {this.renderCurrentScreen()}
          </div>
        </Router>
        <Footer user={this.state.user} />
      </div>
    );
  }

    renderCurrentScreen() {
        return <Switch>
            <Route exact path="/" render={() => <HomeScreen />} />
            <Route
                exact
                path="/code"
                render={() => <CodeScreen data={this.state.data}/>}
            />
            <Route
                exact
                path="/code-preview"
                render={() => <CodeScreen.Preview/>}
            />
            <Route
                exact
                path="/code-submit"
                render={() => <CodeScreen.Submit onSubmit={this.onSubmit}/>}
            />
            <Route
                exact
                path="/code-submit-done"
                render={() => (
                    <CodeScreen.SubmitDone
                        // data={this.state.data}
                        // onSubmit={this.onSubmit}
                        // editData={data => this.setState({ data: data })}
                    />
                )}
            />
            <Route exact path="/paint" render={() => <PaintScreen />} />
            <Route exact path="/pipeline" render={() => <PipelineEditor />} />
            <Route exact path="/queue" render={() => <QueueScreen />} />
            <Route
                exact
                path="/queue-editor"
                render={() => <QueueEditor />}
            />
            <Route exact path="/about" render={() => <AboutScreen />} />
        </Switch>

    }
}

export default App;
