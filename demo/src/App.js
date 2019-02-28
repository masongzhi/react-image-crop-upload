import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import ReactImageCropUpload from "../../src/react-image-crop-upload";

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="set-upload-btn" onClick={this.handleClick.bind(this)}>设置上传</button>
          {this.state.visible && (
            <ReactImageCropUpload
              url="/public/testUpload"
              off={this.off.bind(this)}
              handleCropUploadSuccess={() => {}}
              handleCropUploadFail={() => {}}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
