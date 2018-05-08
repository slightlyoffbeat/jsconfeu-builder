import React, { Component } from "react";
import "./style/style.css";
import "font-awesome/css/font-awesome.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import AboutScreen from "./Pages/AboutScreen";
import CodeScreen from "./Pages/CodeScreen";
import PaintScreen from "./Pages/PaintScreen";
import PipelineEditor from "./Pages/PipelineEditor";
import QueueScreen from "./Pages/QueueScreen";
import HomeScreen from "./Pages/HomeScreen";

// Other
import ModuleStore from "./ModuleStore";
import AuthStore from "./AuthStore";

const GithubScreen = props => {
  return (
    <article>
      <h1>github stuff</h1>
    </article>
  );
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
        <Navbar navTo={this.navTo} startAuth={() => AuthStore.start()} />
        <div className="content">{this.renderContent()}</div>
        <Footer user={this.state.user} />
      </div>
    );
  }

  renderContent() {
    if (this.state.screen === "home") return <HomeScreen navTo={this.navTo} />;
    if (this.state.screen === "code")
      return <CodeScreen navTo={this.navTo} data={this.state.data} />;
    if (this.state.screen === "code-preview")
      return <CodeScreen.Preview navTo={this.navTo} data={this.state.data} />;
    if (this.state.screen === "code-submit")
      return (
        <CodeScreen.Submit
          navTo={this.navTo}
          data={this.state.data}
          onSubmit={this.onSubmit}
          editData={data => this.setState({ data: data })}
        />
      );
    if (this.state.screen === "code-submit-done")
      return (
        <CodeScreen.SubmitDone navTo={this.navTo} data={this.state.data} />
      );
    if (this.state.screen === "paint") return <PaintScreen />;
    if (this.state.screen === "pipeline") return <PipelineEditor />;
    if (this.state.screen === "queue")
      return <QueueScreen navTo={this.navTo} />;
    if (this.state.screen === "about") return <AboutScreen />;
    if (this.state.screen === "github") return <GithubScreen />;
    return <PipelineEditor />;
  }
}

export default App;
