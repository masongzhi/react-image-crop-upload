import React, { Component } from "react";
import PropTypes from "prop-types";
import mimes from "./utils/mimes";
import effectRipple from "./utils/effectRipple.js";
import data2blob from "./utils/data2blob.js";
import "./react-image-crop.scss";

class ReactImageCrop extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.fileinput = React.createRef();

    let allowImgFormat = ["jpg", "png"],
      tempImgFormat =
        allowImgFormat.indexOf(this.props.imgFormat) === -1
          ? "jpg"
          : this.props.imgFormat,
      nMime = mimes[tempImgFormat];

    this.state = {
      step: 1, // 步骤
      file: null,
      // 浏览器是否支持该控件
      isSupported: typeof FormData === "function",
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
    // 图片上传格式
    imgFormat: "png",
    // 图片背景 jpg情况下生效
    imgBgc: "#fff",
    // 剪裁图片的宽
    width: 200,
    // 剪裁图片的高
    height: 200,
    // 不显示旋转功能
    noRotate: true,
    // 关闭 圆形图像预览
    noCircle: false,
    // FIX 这个功能有bug
    // 关闭 旋转图像功能
    noSquare: false
  };

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    imgFormat: PropTypes.string,
    imgBgc: PropTypes.string,
    noCircle: PropTypes.bool,
    noSquare: PropTypes.bool,
    noRotate: PropTypes.bool,
    off: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired
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
      w = sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2,
      h =
        sim.height === sic.height ? sim.height : (sic.height - sim.height) / 2;
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

  changeFile = e => {
    e.preventDefault();
    let files = e.target.files || e.dataTransfer.files;
    this.setState({
      file: files[0]
    });
    this.setSourceImg(files[0]);
    this.setStep(2);
  };

  // 设置图片源
  setSourceImg = file => {
    // this.$emit('src-file-set', file.name, file.type, file.size);
    const fr = new FileReader();
    fr.onload = e => {
      this.setState({ sourceImgUrl: fr.result });
      this.startCrop();
    };
    fr.readAsDataURL(file);
  };

  // 剪裁前准备工作
  startCrop = () => {
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
  };

  prepareUpload = () => {
    // const putExtra = {
    //   fname: this.file.name,
    // }
    // const config = {
    //   region: qiniu.region.z2
    // }
    // var observable = qiniu.upload(this.file, this.file.name, token, putExtra, config)
    // var subscription = observable.subscribe(observer) // 上传开始
    const { createImgUrl } = this.state,
      blob = data2blob(createImgUrl);
    this.props.upload({
      createImgUrl,
      blob,
      file: this.state.file
    });
  };

  /* 图片选择区域函数绑定
		 ---------------------------------------------------------------*/
  preventDefault = e => {
    e.preventDefault();
    return false;
  };

  // 鼠标按下图片准备移动
  imgStartMove = e => {
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
  };

  // 鼠标按下状态下移动，图片移动
  imgMove = e => {
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
  };

  // 生成需求图片
  createImg = e => {
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

    if (imgFormat === "png") {
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
    that.setState({
      createImgUrl: canvas.toDataURL(mime)
    });
  };

  handleClick = e => {
    if (e.target !== this.fileinput.current) {
      e.preventDefault();
      this.fileinput.current.click();
    }
  };

  // 点击波纹效果
  ripple = e => {
    effectRipple(e);
  };

  setStep = val => {
    if (val === 1) {
      this.fileinput.current.value = null;
    }
    this.setState({ step: val });
  };

  // 按钮按下开始缩小
  startZoomSub = e => {
    let that = this,
      { scale } = that.state;
    this.setState({
      scale: {
        ...scale,
        zoomSubOn: true
      }
    });

    function zoom() {
      if (scale.zoomSubOn) {
        let range = scale.range <= 0 ? 0 : --scale.range;
        that.zoomImg(range);
        setTimeout(function() {
          zoom();
        }, 60);
      }
    }
    zoom();
  };

  // 缩放原图
  zoomImg = newRange => {
    let that = this,
      { scale } = this.state,
      sourceImgMasking = this.sourceImgMasking,
      { maxWidth, maxHeight, minWidth, minHeight, width, height, x, y } = scale,
      sim = sourceImgMasking,
      // 蒙版宽高
      sWidth = sim.width,
      sHeight = sim.height,
      // 新宽高
      nWidth = minWidth + (maxWidth - minWidth) * newRange / 100,
      nHeight = minHeight + (maxHeight - minHeight) * newRange / 100,
      // 新坐标（根据蒙版中心点缩放）
      nX = sWidth / 2 - nWidth / width * (sWidth / 2 - x),
      nY = sHeight / 2 - nHeight / height * (sHeight / 2 - y);

    // 判断新坐标是否超过蒙版限制
    if (nX > 0) {
      nX = 0;
    }
    if (nY > 0) {
      nY = 0;
    }
    if (nX < sWidth - nWidth) {
      nX = sWidth - nWidth;
    }
    if (nY < sHeight - nHeight) {
      nY = sHeight - nHeight;
    }

    // 赋值处理
    this.setState({
      scale: {
        ...scale,
        x: nX,
        y: nY,
        width: nWidth,
        height: nHeight,
        range: newRange
      }
    });
    setTimeout(function() {
      if (scale.range === newRange) {
        that.createImg();
      }
    }, 300);
  };

  // 按钮松开或移开取消缩小
  endZoomSub = e => {
    let { scale } = this.state;
    this.setState({
      scale: {
        ...scale,
        zoomSubOn: false
      }
    });
  };

  // 按钮按下开始放大
  startZoomAdd = e => {
    let that = this,
      { scale } = that.state;
    this.setState({
      scale: {
        ...scale,
        zoomAddOn: true
      }
    });

    function zoom() {
      if (scale.zoomAddOn) {
        let range = scale.range >= 100 ? 100 : ++scale.range;
        that.zoomImg(range);
        setTimeout(function() {
          zoom();
        }, 60);
      }
    }
    zoom();
  };

  // 按钮松开或移开取消放大
  endZoomAdd = e => {
    const { scale } = this.state;
    this.setState({
      scale: {
        ...scale,
        zoomAddOn: false
      }
    });
  };

  zoomChange = e => {
    this.zoomImg(e.target.value);
  };

  // 顺时针旋转图片
  rotateImg = e => {
    let {
        sourceImg,
        scale: { naturalWidth, naturalHeight }
      } = this.state,
      width = naturalHeight,
      height = naturalWidth,
      canvas = this.canvasRef.current,
      ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width, 0);
    ctx.rotate(Math.PI * 90 / 180);

    ctx.drawImage(sourceImg, 0, 0, naturalWidth, naturalHeight);
    let imgUrl = canvas.toDataURL(mimes["png"]);

    this.setState({
      sourceImgUrl: imgUrl
    });
    this.startCrop();
  };

  showFiles = () => {
    const { sourceImgUrl, createImgUrl, file, scale } = this.state;
    const { noRotate, noCircle, noSquare } = this.props;

    if (!file) {
      return "";
    }

    return (
      <div className="ricu-step2">
        <div>
          <div className="ricu-step2-left">
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
              onTouchStart={this.imgStartMove}
              onTouchMove={this.imgMove}
              onTouchEnd={this.createImg}
              onTouchCancel={this.createImg}
              onMouseDown={this.imgStartMove}
              onMouseMove={this.imgMove}
              onMouseUp={this.createImg}
              onMouseOut={this.createImg}
              alt=""
            />
            <div
              className="ricu-img-shade ricu-img-shade-1"
              style={this.sourceImgShadeStyle}
            />
            <div
              className="ricu-img-shade ricu-img-shade-2"
              style={this.sourceImgShadeStyle}
            />
          </div>
          <div className="ricu-range">
            <input
              type="range"
              value={scale.range}
              step="1"
              min="0"
              max="100"
              onMouseMove={this.zoomChange}
              onChange={this.zoomChange}
            />
            <i
              onMouseDown={this.startZoomSub}
              onMouseOut={this.endZoomSub}
              onMouseUp={this.endZoomSub}
              className="ricu-icon5"
            />
            <i
              onMouseDown={this.startZoomAdd}
              onMouseOut={this.endZoomAdd}
              onMouseUp={this.endZoomAdd}
              className="ricu-icon6"
            />
          </div>
          {!noRotate && (
            <div className="ricu-rotate">
              <i onClick={this.rotateImg}>↻</i>
            </div>
          )}
        </div>
        <div className="ricu-step2-right">
          {!noSquare && (
            <div>
              <img src={createImgUrl} style={this.previewStyle} alt="" />
              <div className="ricu-step2-right-text">头像预览</div>
            </div>
          )}
          {!noCircle && (
            <div>
              <img
                src={createImgUrl}
                style={{ ...this.previewStyle, borderRadius: "100%" }}
                alt=""
              />
              <div className="ricu-step2-right-text">头像预览</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { width, height, off } = this.props;
    const { step, isSupported } = this.state;

    return (
      <div className="ricu">
        <div className="ricu-wrap">
          <div className="ricu-close" onClick={off}>
            <i className="ricu-icon4" />
          </div>
          <div className="ricu-step1" style={{ display: step !== 1 && "none" }}>
            <div
              className="ricu-drop-area"
              onDragLeave={this.preventDefault}
              onDragOver={this.preventDefault}
              onDragEnter={this.preventDefault}
              onClick={this.handleClick}
              onDrop={this.changeFile}
            >
              <i className="ricu-icon1">
                <i className="ricu-icon1-arrow" />
                <i className="ricu-icon1-body" />
                <i className="ricu-icon1-bottom" />
              </i>
              <span className="ricu-hint">点击，或拖动图片至此处</span>
              <span
                className="ricu-no-supported-hint"
                style={{ display: isSupported && "none" }}
              >
                浏览器不支持该功能，请使用IE10以上或其他现代浏览器！
              </span>

              <input
                style={{ display: "none" }}
                id="file"
                type="file"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                onChange={this.changeFile}
                ref={this.fileinput}
              />
            </div>
          </div>

          {/*<button onClick={this.upload}>上传</button>*/}
          <div style={{ display: step !== 2 && "none" }}>
            {this.showFiles()}
          </div>

          <div className="ricu-operate">
            <button
              onClick={() => this.setStep.call(this, 1)}
              onMouseDown={this.ripple}
              style={{ display: step === 1 && "none" }}
            >
              上一步
            </button>
            <button
              style={{ display: step === 1 && "none" }}
              className="ricu-operate-btn"
              onClick={this.prepareUpload}
              onMouseDown={this.ripple}
            >
              保存
            </button>

            <button
              onClick={off}
              onMouseDown={this.ripple}
              style={{ display: step !== 1 && "none" }}
            >
              关闭
            </button>
          </div>
          <canvas
            style={{ display: "none" }}
            width={width}
            height={height}
            ref={this.canvasRef}
          />
        </div>
      </div>
    );
  }
}

export default ReactImageCrop;
