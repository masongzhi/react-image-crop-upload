import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import "react-image-crop-upload/dist/index.css";
import ReactImageCropUpload from "react-image-crop-upload";

class App extends Component {
  state = {
    visible: false
  };

  handleClick = () => {
    this.setState({ visible: true });
  };

  off = () => {
    this.setState({ visible: false });
  };

  handleCropUploadSuccess = (resData, field, ki) => {
    console.log("resData, field, ki===>>>>", resData, field, ki);
    this.off();
  };

  handleCropUploadFail = (sts, field, ki) => {
    console.log("sts, field, ki===>>>>", sts, field, ki);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="set-upload-btn" onClick={this.handleClick}>
            设置上传
          </button>
          {this.state.visible && (
            <ReactImageCropUpload
              url="/api/v1/public/testUpload"
              withCredentials={true}
              off={this.off}
              handleCropUploadSuccess={this.handleCropUploadSuccess}
              handleCropUploadFail={this.handleCropUploadFail}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
