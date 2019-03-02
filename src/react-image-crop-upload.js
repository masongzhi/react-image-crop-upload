import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactImageCrop from "./react-image-crop";
import data2blob from "./utils/data2blob.js";

class ReactImageCropUpload extends Component {
  constructor(props) {
    super(props);
    this.cropRef = React.createRef();
  }

  static defaultProps = {
    // 上传接口地址，如果为空，图片不会上传
    url: "",
    // 上传方法
    method: "POST",
    // 向服务器上传的文件名
    field: "upload",
    // 上传附带其他数据，格式 {k:v}
    params: null,
    // 上传header设置，格式 {k:v}
    headers: null,
    // 支持跨域
    withCredentials: false,
    // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    ki: 0
  };

  static propTypes = {
    url: PropTypes.string,
    method: PropTypes.string,
    field: PropTypes.string,
    params: PropTypes.object,
    headers: PropTypes.object,
    withCredentials: PropTypes.bool,
    ki: PropTypes.number,
    handleCropUploadSuccess: PropTypes.func.isRequired,
    handleCropUploadFail: PropTypes.func.isRequired
  };

  // 上传图片
  upload({ createImgUrl, blob, file }) {
    let child = this.cropRef.current,
      {
        url,
        params,
        headers,
        field,
        withCredentials,
        method,
        handleCropUploadSuccess,
        handleCropUploadFail,
        ki
      } = this.props,
      { imgFormat, mime } = child.state,
      fmData = new FormData();
    fmData.append(
      field,
      data2blob(createImgUrl, mime),
      field + "." + imgFormat
    );

    // 添加其他参数
    if (typeof params === "object" && params) {
      Object.keys(params).forEach(k => {
        fmData.append(k, params[k]);
      });
    }

    // 监听进度回调
    // const uploadProgress = function(event) {
    //   if (event.lengthComputable) {
    //     that.progress = 100 * Math.round(event.loaded) / event.total;
    //   }
    // };
    // 上传文件
    // child.setStep(3);
    new Promise(function(resolve, reject) {
      let client = new XMLHttpRequest();
      client.open(method, url, true);
      client.withCredentials = withCredentials;
      client.onreadystatechange = function() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status === 200 || this.status === 201) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(this.status);
        }
      };
      // client.upload.addEventListener("progress", uploadProgress, false); //监听进度
      // 设置header
      if (typeof headers === "object" && headers) {
        Object.keys(headers).forEach(k => {
          client.setRequestHeader(k, headers[k]);
        });
      }
      client.send(fmData);
    }).then(
      // 上传成功
      function(resData) {
        handleCropUploadSuccess(resData, field, ki);
      },
      // 上传失败
      function(sts) {
        handleCropUploadFail(sts, field, ki);
      }
    );
  }

  render() {
    return (
      <ReactImageCrop
        {...this.props}
        upload={this.upload.bind(this)}
        ref={this.cropRef}
      />
    );
  }
}

export default ReactImageCropUpload;
