import React, { Component } from "react";
import qiniu from "qiniu-js";
import mimes from "../utils/mimes";
import "./react-qiniu-avatar-upload.css";

class ReactQiniuAvatarUpload extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    let allowImgFormat = ["jpg", "png"],
      tempImgFormat =
        allowImgFormat.indexOf(this.props.imgFormat) === -1
          ? "jpg"
          : this.props.imgFormat,
      nMime = mimes[tempImgFormat];

    this.state = {
      file: null,
      // 浏览器是否支持触屏事件
      isSupportTouch: document.hasOwnProperty("ontouchstart"),
      // 原图片拖动事件初始值
      sourceImgMouseDown: {
        on: false,
        mime: nMime,
        mX: 0, //鼠标按下的坐标
        mY: 0,
        x: 0, //scale原图坐标
        y: 0
      },
      // 原图展示属性
      scale: {
        zoomAddOn: false, //按钮缩放事件开启
        zoomSubOn: false, //按钮缩放事件开启
        range: 1, //最大100

        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0, //最宽
        minHeight: 0,
        naturalWidth: 0, //原宽
        naturalHeight: 0
      },
      // 原图容器宽高
      sourceImgContainer: {
        // sic
        width: 240,
        height: 184 // 如果生成图比例与此一致会出现bug，先改成特殊的格式吧，哈哈哈
      },
      mime: mimes["jpg"],
      // 需求图宽高比
      ratio: this.props.width / this.props.height,
      // 原图地址、生成图片地址
      sourceImg: null,
      sourceImgUrl: "",
      createImgUrl: "",
      // 生成图片预览的容器大小
      previewContainer: {
        width: 100,
        height: 100
      }
    };
  }

  static defaultProps = {
    imgFormat: "png",
    imgBgc: "#fff",
    width: 200,
    height: 200
  };

  // 原图蒙版属性
  get sourceImgMasking() {
    let { sourceImgContainer, ratio } = this.state,
      { width, height } = this.props,
      sic = sourceImgContainer,
      sicRatio = sic.width / sic.height, // 原图容器宽高比
      x = 0,
      y = 0,
      w = sic.width,
      h = sic.height,
      scale = 1;
    if (ratio < sicRatio) {
      scale = sic.height / height;
      w = sic.height * ratio;
      x = (sic.width - w) / 2;
    }
    if (ratio > sicRatio) {
      scale = sic.width / width;
      h = sic.width / ratio;
      y = (sic.height - h) / 2;
    }
    return {
      scale, // 蒙版相对需求宽高的缩放
      x,
      y,
      width: w,
      height: h
    };
  }

  // 原图样式
  get sourceImgStyle() {
    let { scale } = this.state,
      sourceImgMasking = this.sourceImgMasking,
      top = scale.y + sourceImgMasking.y + "px",
      left = scale.x + sourceImgMasking.x + "px";
    return {
      position: "absolute",
      top,
      left,
      width: scale.width + "px",
      height: scale.height + "px" // 兼容 Opera
    };
  }

  // 原图遮罩样式
  get sourceImgShadeStyle() {
    let { sourceImgContainer } = this.state,
      sourceImgMasking = this.sourceImgMasking,
      sic = sourceImgContainer,
      sim = sourceImgMasking,
      w = sim.width == sic.width ? sim.width : (sic.width - sim.width) / 2,
      h = sim.height == sic.height ? sim.height : (sic.height - sim.height) / 2;
    return {
      width: w + "px",
      height: h + "px"
    };
  }

  get previewStyle() {
    let { ratio, previewContainer } = this.state,
      pc = previewContainer,
      w = pc.width,
      h = pc.height,
      pcRatio = w / h;
    if (ratio < pcRatio) {
      w = pc.height * ratio;
    }
    if (ratio > pcRatio) {
      h = pc.width / ratio;
    }
    return {
      width: w + "px",
      height: h + "px"
    };
  }

  changeFile(e) {
    e.preventDefault();
    let files = e.target.files || e.dataTransfer.files;
    this.setState({
      file: files[0]
    });
    this.setSourceImg(files[0]);

    // const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    // for (const it of files) {
    //   it.preview = URL.createObjectURL(it);
    // }
    // this.setState({
    //   files: files
    // });
  }

  // 设置图片源
  setSourceImg(file) {
    // this.$emit('src-file-set', file.name, file.type, file.size);
    const fr = new FileReader();
    fr.onload = e => {
      this.setState({ sourceImgUrl: fr.result });
      this.startCrop();
    };
    fr.readAsDataURL(file);
  }

  // 剪裁前准备工作
  startCrop() {
    let that = this,
      { width, height } = that.props,
      { ratio, scale, sourceImgUrl } = that.state,
      sim = this.sourceImgMasking,
      img = new Image();
    img.src = sourceImgUrl;
    img.onload = () => {
      let nWidth = img.naturalWidth,
        nHeight = img.naturalHeight,
        nRatio = nWidth / nHeight,
        w = sim.width,
        h = sim.height,
        x = 0,
        y = 0;
      // 图片像素不达标
      if (nWidth < width || nHeight < height) {
        that.hasError = true;
        that.errorMsg = "图片最低像素为（宽*高）：" + width + "*" + height;
        return false;
      }
      if (ratio > nRatio) {
        h = w / nRatio;
        y = (sim.height - h) / 2;
      }
      if (ratio < nRatio) {
        w = h * nRatio;
        x = (sim.width - w) / 2;
      }
      this.setState({
        scale: {
          ...scale,
          range: 0,
          x: x,
          y: y,
          width: w,
          height: h,
          minWidth: w,
          minHeight: h,
          maxWidth: nWidth * sim.scale,
          maxHeight: nHeight * sim.scale,
          naturalWidth: nWidth,
          naturalHeight: nHeight
        },
        sourceImg: img
      });
      this.createImg();
    };
  }

  upload() {
    // const putExtra = {
    //   fname: this.file.name,
    // }
    // const config = {
    //   region: qiniu.region.z2
    // }
    // var observable = qiniu.upload(this.file, this.file.name, token, putExtra, config)
    // var subscription = observable.subscribe(observer) // 上传开始
  }

  /* 图片选择区域函数绑定
		 ---------------------------------------------------------------*/
  preventDefault(e) {
    e.preventDefault();
    return false;
  }

  // 鼠标按下图片准备移动
  imgStartMove(e) {
    e.preventDefault();
    // 支持触摸事件，则鼠标事件无效
    if (this.state.isSupportTouch && !e.targetTouches) {
      return false;
    }
    let et = e.targetTouches ? e.targetTouches[0] : e,
      { sourceImgMouseDown, scale } = this.state,
      simd = sourceImgMouseDown;
    simd.mX = et.screenX;
    simd.mY = et.screenY;
    simd.x = scale.x;
    simd.y = scale.y;
    simd.on = true;
  }

  // 鼠标按下状态下移动，图片移动
  imgMove(e) {
    e.preventDefault();
    // 支持触摸事件，则鼠标事件无效
    if (this.state.isSupportTouch && !e.targetTouches) {
      return false;
    }
    let et = e.targetTouches ? e.targetTouches[0] : e,
      {
        sourceImgMouseDown: { on, mX, mY, x, y },
        scale
      } = this.state,
      sim = this.sourceImgMasking,
      nX = et.screenX,
      nY = et.screenY,
      dX = nX - mX,
      dY = nY - mY,
      rX = x + dX,
      rY = y + dY;
    if (!on) return;
    if (rX > 0) {
      rX = 0;
    }
    if (rY > 0) {
      rY = 0;
    }
    if (rX < sim.width - scale.width) {
      rX = sim.width - scale.width;
    }
    if (rY < sim.height - scale.height) {
      rY = sim.height - scale.height;
    }
    this.setState({
      scale: {
        ...this.state.scale,
        x: rX,
        y: rY
      }
    });
  }

  // 生成需求图片
  createImg(e) {
    let that = this,
      {
        mime,
        sourceImg,
        scale: { x, y, width, height }
      } = that.state,
      { imgFormat, imgBgc } = that.props,
      { scale } = this.sourceImgMasking,
      canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (e) {
      // 取消鼠标按下移动状态
      that.setState({
        sourceImgMouseDown: {
          ...that.state.sourceImgMouseDown,
          on: false
        }
      });
    }
    canvas.width = that.props.width;
    canvas.height = that.props.height;
    ctx.clearRect(0, 0, that.props.width, that.props.height);

    if (imgFormat == "png") {
      ctx.fillStyle = "rgba(0,0,0,0)";
    } else {
      // 如果jpg 为透明区域设置背景，默认白色
      ctx.fillStyle = imgBgc;
    }
    ctx.fillRect(0, 0, that.props.width, that.props.height);

    ctx.drawImage(
      sourceImg,
      x / scale,
      y / scale,
      width / scale,
      height / scale
    );
    console.log("sourceImg===>>>>", sourceImg);
    that.setState({
      createImgUrl: canvas.toDataURL(mime)
    });
  }

  showFiles() {
    const { sourceImgUrl, createImgUrl, file } = this.state;

    if (!file) {
      return "";
    }

    let styles = {
      width: "600px",
      margin: "10px auto",
      display: "flex",
      justifyContent: "space-around"
    };

    return (
      <div style={styles}>
        <div
          style={{
            position: "relative",
            width: "240px",
            height: "180px",
            overflow: "hidden"
          }}
        >
          <img
            style={this.sourceImgStyle}
            src={sourceImgUrl}
            draggable={false}
            onDrag={this.preventDefault}
            onDragStart={this.preventDefault}
            onDragEnd={this.preventDefault}
            onDragLeave={this.preventDefault}
            onDragOver={this.preventDefault}
            onDragEnter={this.preventDefault}
            onDrop={this.preventDefault}
            onTouchStart={this.imgStartMove.bind(this)}
            onTouchMove={this.imgMove.bind(this)}
            onTouchEnd={this.createImg.bind(this)}
            onTouchCancel={this.createImg.bind(this)}
            onMouseDown={this.imgStartMove.bind(this)}
            onMouseMove={this.imgMove.bind(this)}
            onMouseUp={this.createImg.bind(this)}
            onMouseOut={this.createImg.bind(this)}
          />
          <div
            className="rqau-img-shade rqau-img-shade-1"
            style={this.sourceImgShadeStyle}
          />
          <div
            className="rqau-img-shade rqau-img-shade-2"
            style={this.sourceImgShadeStyle}
          />
        </div>
        <div>
          <img src={createImgUrl} style={this.previewStyle} />
        </div>
        <div>
          <img src={createImgUrl} style={{...this.previewStyle, borderRadius: '100%'}} />
        </div>
      </div>
    );
  }

  render() {
    const { width, height } = this.props;

    return (
      <div>
        <input
          id="file"
          type="file"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          onChange={this.changeFile.bind(this)}
        />
        <button onClick={this.upload.bind(this)}>上传</button>
        {this.showFiles()}
        <canvas
          style={{ display: "none" }}
          width={width}
          height={height}
          ref={this.canvasRef}
        />
      </div>
    );
  }
}

export default ReactQiniuAvatarUpload;
