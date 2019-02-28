import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import "react-image-crop-upload/index.css";
import ReactImageCropUpload from "react-image-crop-upload";

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

  handleCropUploadSuccess(resData, field, ki) {
    console.log('resData, field, ki===>>>>', resData, field, ki);
    this.off()
  }

  handleCropUploadFail(sts, field, ki) {
    console.log('sts, field, ki===>>>>', sts, field, ki);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="set-upload-btn" onClick={this.handleClick.bind(this)}>设置上传</button>
          {this.state.visible && (
            <ReactImageCropUpload
              url="blog.masongzhi.cn/api/v1/public/testUpload"
              withCredentials={true}
              off={this.off.bind(this)}
              handleCropUploadSuccess={this.handleCropUploadSuccess.bind(this)}
              handleCropUploadFail={this.handleCropUploadFail.bind(this)}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
