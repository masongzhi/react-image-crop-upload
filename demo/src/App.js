import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import ReactQiniuAvatarUpload from "./components/react-qiniu-avatar-upload";

class App extends Component {
  state = {
    visible: false
  };

  handleClick() {
    this.setState({ visible: true });
  }

  off() {
    this.setState({ visible: false });
  }

  upload({imgUrl, blob}) {
    console.log('imgUrl===>>>>', imgUrl);
    console.log('blob===>>>>', blob);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="set-upload-btn" onClick={this.handleClick.bind(this)}>设置上传</button>
          {this.state.visible && (
            <ReactQiniuAvatarUpload
              off={this.off.bind(this)}
              upload={this.upload.bind(this)}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
