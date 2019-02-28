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
![WX20190228-103838@2x.png](https://user-gold-cdn.xitu.io/2019/2/28/16933ae6d78d03c3?w=1240&h=777&f=png&s=195290)

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
| url             | String            |  ''                | 上传接口地址，如果为空，图片不会上传    |
| method				| String		| 'POST'               | 上传方法 |
| field       | String   | 'upload'     | 向服务器上传的文件名    |
| value             | Boolean            | twoWay            | 是否显示控件，双向绑定    |
| params             | Object            |  null                | 上传附带其他数据，格式"{k:v}"    |
| headers             | Object            |  null                | 上传header设置，格式"{k:v}"    |
| width             | Number            |   200                | 最终得到的图片宽度     |
| height             | Number            |  200                 | 最终得到的图片高度   |
| imgFormat             | string            | 'png'                  | jpg/png, 最终得到的图片格式    |
| imgBgc             | string            | '#fff'                  | 导出图片背景色,当imgFormat属性为jpg时生效   |
| noCircle            | Boolean              | false             | 关闭 圆形图像预览 |
| noSquare            | Boolean              | false             | 关闭 方形图像预览 |
| noRotate            | Boolean              | true             | 关闭 旋转图像功能 |
| withCredentials          | Boolean             | false         | 支持跨域 |
| ki          | Number             | 0         | 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分 |

#### Methods
| 名称              | 说明                                         |
| ----------------| ------------------------------------------|
| handleCropUploadSuccess | 上传成功， 参数( jsonData, field, ki )    |
| handleCropUploadFail    | 上传失败， 参数( status, field, ki )    |

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


```
