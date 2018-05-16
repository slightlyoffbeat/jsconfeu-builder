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
                component={CodeScreen.Preview}
            />
            <Route
                exact
                path="/code-submit"
                component={CodeScreen.Submit}
            />
            <Route
                exact
                path="/code-submit-done"
                render={() => (<CodeScreen.SubmitDone/>)}
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
