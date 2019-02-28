# react-image-crop-upload

A beautiful react component for imgage crop and upload. （react图片剪裁上传组件）.

**Notice**: This component is designed for pc, **not recommended for use on the mobile side**.(该组件适用于pc端，不推荐手机端使用)

## 借鉴
[vue-image-crop-upload](https://github.com/dai-siki/vue-image-crop-upload)

## 更新日志

#### @1.0.0
- 可以读取本地图片并进行剪辑，上传方法由外部提供

## 示例
[点我](http://masongzhi.github.io/react-image-crop-upload).

## 截图
![WX20190228-103838@2x.png](https://upload-images.jianshu.io/upload_images/3708358-dd37c155ab2ac2d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 配置环境
react


## 安装
#### npm
```shell
$ npm install react-image-crop-upload
```


## 使用
#### Props
| 名称              | 类型               | 默认             | 说明                                         |
| ----------------| ---------------- | ---------------| ------------------------------------------|
| width             | Number            |   200                | 最终得到的图片宽度     |
| height             | Number            |  200                 | 最终得到的图片高度   |
| imgFormat             | string            | 'png'                  | jpg/png, 最终得到的图片格式    |
| imgBgc             | string            | '#fff'                  | 导出图片背景色,当imgFormat属性为jpg时生效   |
| noCircle            | Boolean              | false             | 关闭 圆形图像预览 |
| noSquare            | Boolean              | false             | 关闭 方形图像预览 |
| noRotate            | Boolean              | true             | 关闭 旋转图像功能 |

#### 使用示例
```js
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
            <ReactImageCropUpload
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

```
