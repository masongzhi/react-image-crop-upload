import React, { Component } from 'react';
import PropTypes from 'prop-types';

var mimes = {
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'psd': 'image/photoshop'
};

/**
 * 点击波纹效果
 *
 * @param  {[event]} e        [description]
 * @param  {[Object]} arg_opts [description]
 * @return {[bollean]}          [description]
 */
function effectRipple (e, arg_opts) {
	var opts = Object.assign({
		ele: e.target, // 波纹作用元素
		type: 'hit', // hit点击位置扩散　center中心点扩展
		bgc: 'rgba(0, 0, 0, 0.15)' // 波纹颜色
	}, arg_opts),
	    target = opts.ele;
	if (target) {
		var rect = target.getBoundingClientRect(),
		    ripple = target.querySelector('.e-ripple');
		if (!ripple) {
			ripple = document.createElement('span');
			ripple.className = 'e-ripple';
			ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
			target.appendChild(ripple);
		} else {
			ripple.className = 'e-ripple';
		}
		switch (opts.type) {
			case 'center':
				ripple.style.top = rect.height / 2 - ripple.offsetHeight / 2 + 'px';
				ripple.style.left = rect.width / 2 - ripple.offsetWidth / 2 + 'px';
				break;
			default:
				ripple.style.top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop + 'px';
				ripple.style.left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft + 'px';
		}
		ripple.style.backgroundColor = opts.bgc;
		ripple.className = 'e-ripple z-active';
		return false;
	}
}

/**
 * database64文件格式转换为2进制
 *
 * @param  {[String]} data dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
 * @param  {[String]} mime [description]
 * @return {[blob]}      [description]
 */
function data2blob (data, mime) {
	data = data.split(',')[1];
	data = window.atob(data);
	var ia = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
		ia[i] = data.charCodeAt(i);
	}	// canvas.toDataURL 返回的默认格式就是 image/png
	return new Blob([ia], {
		type: mime
	});
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var ReactImageCrop = function (_Component) {
  inherits(ReactImageCrop, _Component);

  function ReactImageCrop(props) {
    classCallCheck(this, ReactImageCrop);

    var _this = possibleConstructorReturn(this, (ReactImageCrop.__proto__ || Object.getPrototypeOf(ReactImageCrop)).call(this, props));

    _this.canvasRef = React.createRef();
    _this.fileinput = React.createRef();

    var allowImgFormat = ["jpg", "png"],
        tempImgFormat = allowImgFormat.indexOf(_this.props.imgFormat) === -1 ? "jpg" : _this.props.imgFormat,
        nMime = mimes[tempImgFormat];

    _this.state = {
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
      ratio: _this.props.width / _this.props.height,
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
    return _this;
  }

  createClass(ReactImageCrop, [{
    key: "changeFile",
    value: function changeFile(e) {
      e.preventDefault();
      var files = e.target.files || e.dataTransfer.files;
      this.setState({
        file: files[0]
      });
      this.setSourceImg(files[0]);
      this.setStep(2);
    }

    // 设置图片源

  }, {
    key: "setSourceImg",
    value: function setSourceImg(file) {
      var _this2 = this;

      // this.$emit('src-file-set', file.name, file.type, file.size);
      var fr = new FileReader();
      fr.onload = function (e) {
        _this2.setState({ sourceImgUrl: fr.result });
        _this2.startCrop();
      };
      fr.readAsDataURL(file);
    }

    // 剪裁前准备工作

  }, {
    key: "startCrop",
    value: function startCrop() {
      var _this3 = this;

      var that = this,
          _that$props = that.props,
          width = _that$props.width,
          height = _that$props.height,
          _that$state = that.state,
          ratio = _that$state.ratio,
          scale = _that$state.scale,
          sourceImgUrl = _that$state.sourceImgUrl,
          sim = this.sourceImgMasking,
          img = new Image();

      img.src = sourceImgUrl;
      img.onload = function () {
        var nWidth = img.naturalWidth,
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
        _this3.setState({
          scale: _extends({}, scale, {
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
          }),
          sourceImg: img
        });
        _this3.createImg();
      };
    }
  }, {
    key: "prepareUpload",
    value: function prepareUpload() {
      // const putExtra = {
      //   fname: this.file.name,
      // }
      // const config = {
      //   region: qiniu.region.z2
      // }
      // var observable = qiniu.upload(this.file, this.file.name, token, putExtra, config)
      // var subscription = observable.subscribe(observer) // 上传开始
      var _state = this.state,
          createImgUrl = _state.createImgUrl,
          mime = _state.mime,
          blob = data2blob(createImgUrl, mime);

      this.props.upload({
        createImgUrl: createImgUrl,
        blob: blob
      });
    }

    /* 图片选择区域函数绑定
     ---------------------------------------------------------------*/

  }, {
    key: "preventDefault",
    value: function preventDefault(e) {
      e.preventDefault();
      return false;
    }

    // 鼠标按下图片准备移动

  }, {
    key: "imgStartMove",
    value: function imgStartMove(e) {
      e.preventDefault();
      // 支持触摸事件，则鼠标事件无效
      if (this.state.isSupportTouch && !e.targetTouches) {
        return false;
      }
      var et = e.targetTouches ? e.targetTouches[0] : e,
          _state2 = this.state,
          sourceImgMouseDown = _state2.sourceImgMouseDown,
          scale = _state2.scale,
          simd = sourceImgMouseDown;

      simd.mX = et.screenX;
      simd.mY = et.screenY;
      simd.x = scale.x;
      simd.y = scale.y;
      simd.on = true;
    }

    // 鼠标按下状态下移动，图片移动

  }, {
    key: "imgMove",
    value: function imgMove(e) {
      e.preventDefault();
      // 支持触摸事件，则鼠标事件无效
      if (this.state.isSupportTouch && !e.targetTouches) {
        return false;
      }
      var et = e.targetTouches ? e.targetTouches[0] : e,
          _state3 = this.state,
          _state3$sourceImgMous = _state3.sourceImgMouseDown,
          on = _state3$sourceImgMous.on,
          mX = _state3$sourceImgMous.mX,
          mY = _state3$sourceImgMous.mY,
          x = _state3$sourceImgMous.x,
          y = _state3$sourceImgMous.y,
          scale = _state3.scale,
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
        scale: _extends({}, this.state.scale, {
          x: rX,
          y: rY
        })
      });
    }

    // 生成需求图片

  }, {
    key: "createImg",
    value: function createImg(e) {
      var that = this,
          _that$state2 = that.state,
          mime = _that$state2.mime,
          sourceImg = _that$state2.sourceImg,
          _that$state2$scale = _that$state2.scale,
          x = _that$state2$scale.x,
          y = _that$state2$scale.y,
          width = _that$state2$scale.width,
          height = _that$state2$scale.height,
          _that$props2 = that.props,
          imgFormat = _that$props2.imgFormat,
          imgBgc = _that$props2.imgBgc,
          scale = this.sourceImgMasking.scale,
          canvas = this.canvasRef.current;

      var ctx = canvas.getContext("2d");
      if (e) {
        // 取消鼠标按下移动状态
        that.setState({
          sourceImgMouseDown: _extends({}, that.state.sourceImgMouseDown, {
            on: false
          })
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

      ctx.drawImage(sourceImg, x / scale, y / scale, width / scale, height / scale);
      that.setState({
        createImgUrl: canvas.toDataURL(mime)
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      if (e.target !== this.fileinput.current) {
        e.preventDefault();
        this.fileinput.current.click();
      }
    }

    // 点击波纹效果

  }, {
    key: "ripple",
    value: function ripple(e) {
      effectRipple(e);
    }
  }, {
    key: "setStep",
    value: function setStep(val) {
      if (val === 1) {
        this.fileinput.current.value = null;
      }
      this.setState({ step: val });
    }

    // 按钮按下开始缩小

  }, {
    key: "startZoomSub",
    value: function startZoomSub(e) {
      var that = this,
          scale = that.state.scale;

      this.setState({
        scale: _extends({}, scale, {
          zoomSubOn: true
        })
      });

      function zoom() {
        if (scale.zoomSubOn) {
          var range = scale.range <= 0 ? 0 : --scale.range;
          that.zoomImg(range);
          setTimeout(function () {
            zoom();
          }, 60);
        }
      }
      zoom();
    }

    // 缩放原图

  }, {
    key: "zoomImg",
    value: function zoomImg(newRange) {
      var that = this,
          scale = this.state.scale,
          sourceImgMasking = this.sourceImgMasking,
          maxWidth = scale.maxWidth,
          maxHeight = scale.maxHeight,
          minWidth = scale.minWidth,
          minHeight = scale.minHeight,
          width = scale.width,
          height = scale.height,
          x = scale.x,
          y = scale.y,
          sim = sourceImgMasking,
          sWidth = sim.width,
          sHeight = sim.height,
          nWidth = minWidth + (maxWidth - minWidth) * newRange / 100,
          nHeight = minHeight + (maxHeight - minHeight) * newRange / 100,
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
        scale: _extends({}, scale, {
          x: nX,
          y: nY,
          width: nWidth,
          height: nHeight,
          range: newRange
        })
      });
      setTimeout(function () {
        if (scale.range === newRange) {
          that.createImg();
        }
      }, 300);
    }

    // 按钮松开或移开取消缩小

  }, {
    key: "endZoomSub",
    value: function endZoomSub(e) {
      var scale = this.state.scale;

      this.setState({
        scale: _extends({}, scale, {
          zoomSubOn: false
        })
      });
    }

    // 按钮按下开始放大

  }, {
    key: "startZoomAdd",
    value: function startZoomAdd(e) {
      var that = this,
          scale = that.state.scale;

      this.setState({
        scale: _extends({}, scale, {
          zoomAddOn: true
        })
      });

      function zoom() {
        if (scale.zoomAddOn) {
          var range = scale.range >= 100 ? 100 : ++scale.range;
          that.zoomImg(range);
          setTimeout(function () {
            zoom();
          }, 60);
        }
      }
      zoom();
    }

    // 按钮松开或移开取消放大

  }, {
    key: "endZoomAdd",
    value: function endZoomAdd(e) {
      var scale = this.state.scale;

      this.setState({
        scale: _extends({}, scale, {
          zoomAddOn: false
        })
      });
    }
  }, {
    key: "zoomChange",
    value: function zoomChange(e) {
      this.zoomImg(e.target.value);
    }

    // 顺时针旋转图片

  }, {
    key: "rotateImg",
    value: function rotateImg(e) {
      var _state4 = this.state,
          sourceImg = _state4.sourceImg,
          _state4$scale = _state4.scale,
          naturalWidth = _state4$scale.naturalWidth,
          naturalHeight = _state4$scale.naturalHeight,
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
      var imgUrl = canvas.toDataURL(mimes["png"]);

      this.setState({
        sourceImgUrl: imgUrl
      });
      this.startCrop();
    }
  }, {
    key: "showFiles",
    value: function showFiles() {
      var _state5 = this.state,
          sourceImgUrl = _state5.sourceImgUrl,
          createImgUrl = _state5.createImgUrl,
          file = _state5.file,
          scale = _state5.scale;
      var _props = this.props,
          noRotate = _props.noRotate,
          noCircle = _props.noCircle,
          noSquare = _props.noSquare;


      if (!file) {
        return "";
      }

      return React.createElement(
        "div",
        { className: "ricu-step2" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "ricu-step2-left" },
            React.createElement("img", {
              style: this.sourceImgStyle,
              src: sourceImgUrl,
              draggable: false,
              onDrag: this.preventDefault,
              onDragStart: this.preventDefault,
              onDragEnd: this.preventDefault,
              onDragLeave: this.preventDefault,
              onDragOver: this.preventDefault,
              onDragEnter: this.preventDefault,
              onDrop: this.preventDefault,
              onTouchStart: this.imgStartMove.bind(this),
              onTouchMove: this.imgMove.bind(this),
              onTouchEnd: this.createImg.bind(this),
              onTouchCancel: this.createImg.bind(this),
              onMouseDown: this.imgStartMove.bind(this),
              onMouseMove: this.imgMove.bind(this),
              onMouseUp: this.createImg.bind(this),
              onMouseOut: this.createImg.bind(this),
              alt: ""
            }),
            React.createElement("div", {
              className: "ricu-img-shade ricu-img-shade-1",
              style: this.sourceImgShadeStyle
            }),
            React.createElement("div", {
              className: "ricu-img-shade ricu-img-shade-2",
              style: this.sourceImgShadeStyle
            })
          ),
          React.createElement(
            "div",
            { className: "ricu-range" },
            React.createElement("input", {
              type: "range",
              value: scale.range,
              step: "1",
              min: "0",
              max: "100",
              onMouseMove: this.zoomChange.bind(this),
              onChange: this.zoomChange.bind(this)
            }),
            React.createElement("i", {
              onMouseDown: this.startZoomSub.bind(this),
              onMouseOut: this.endZoomSub.bind(this),
              onMouseUp: this.endZoomSub.bind(this),
              className: "ricu-icon5"
            }),
            React.createElement("i", {
              onMouseDown: this.startZoomAdd.bind(this),
              onMouseOut: this.endZoomAdd.bind(this),
              onMouseUp: this.endZoomAdd.bind(this),
              className: "ricu-icon6"
            })
          ),
          !noRotate && React.createElement(
            "div",
            { className: "ricu-rotate" },
            React.createElement(
              "i",
              { onClick: this.rotateImg.bind(this) },
              "\u21BB"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "ricu-step2-right" },
          !noSquare && React.createElement(
            "div",
            null,
            React.createElement("img", { src: createImgUrl, style: this.previewStyle, alt: "" }),
            React.createElement(
              "div",
              { className: "ricu-step2-right-text" },
              "\u5934\u50CF\u9884\u89C8"
            )
          ),
          !noCircle && React.createElement(
            "div",
            null,
            React.createElement("img", {
              src: createImgUrl,
              style: _extends({}, this.previewStyle, { borderRadius: "100%" }),
              alt: ""
            }),
            React.createElement(
              "div",
              { className: "ricu-step2-right-text" },
              "\u5934\u50CF\u9884\u89C8"
            )
          )
        )
      );
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onRef && this.props.onRef(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          off = _props2.off;
      var _state6 = this.state,
          step = _state6.step,
          isSupported = _state6.isSupported;


      return React.createElement(
        "div",
        { className: "ricu" },
        React.createElement(
          "div",
          { className: "ricu-wrap" },
          React.createElement(
            "div",
            { className: "ricu-close", onClick: off },
            React.createElement("i", { className: "ricu-icon4" })
          ),
          React.createElement(
            "div",
            { className: "ricu-step1", style: { display: step !== 1 && "none" } },
            React.createElement(
              "div",
              {
                className: "ricu-drop-area",
                onDragLeave: this.preventDefault,
                onDragOver: this.preventDefault,
                onDragEnter: this.preventDefault,
                onClick: this.handleClick.bind(this),
                onDrop: this.changeFile.bind(this)
              },
              React.createElement(
                "i",
                { className: "ricu-icon1" },
                React.createElement("i", { className: "ricu-icon1-arrow" }),
                React.createElement("i", { className: "ricu-icon1-body" }),
                React.createElement("i", { className: "ricu-icon1-bottom" })
              ),
              React.createElement(
                "span",
                { className: "ricu-hint" },
                "\u70B9\u51FB\uFF0C\u6216\u62D6\u52A8\u56FE\u7247\u81F3\u6B64\u5904"
              ),
              React.createElement(
                "span",
                {
                  className: "ricu-no-supported-hint",
                  style: { display: isSupported && "none" }
                },
                "\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BE5\u529F\u80FD\uFF0C\u8BF7\u4F7F\u7528IE10\u4EE5\u4E0A\u6216\u5176\u4ED6\u73B0\u4EE3\u6D4F\u89C8\u5668\uFF01"
              ),
              React.createElement("input", {
                style: { display: "none" },
                id: "file",
                type: "file",
                accept: "image/png, image/jpeg, image/gif, image/jpg",
                onChange: this.changeFile.bind(this),
                ref: this.fileinput
              })
            )
          ),
          React.createElement(
            "div",
            { style: { display: step !== 2 && "none" } },
            this.showFiles()
          ),
          React.createElement(
            "div",
            { className: "ricu-operate" },
            React.createElement(
              "button",
              {
                onClick: function onClick() {
                  return _this4.setStep.call(_this4, 1);
                },
                onMouseDown: this.ripple,
                style: { display: step === 1 && "none" }
              },
              "\u4E0A\u4E00\u6B65"
            ),
            React.createElement(
              "button",
              {
                style: { display: step === 1 && "none" },
                className: "ricu-operate-btn",
                onClick: this.prepareUpload.bind(this),
                onMouseDown: this.ripple
              },
              "\u4FDD\u5B58"
            ),
            React.createElement(
              "button",
              {
                onClick: off,
                onMouseDown: this.ripple,
                style: { display: step !== 1 && "none" }
              },
              "\u5173\u95ED"
            )
          ),
          React.createElement("canvas", {
            style: { display: "none" },
            width: width,
            height: height,
            ref: this.canvasRef
          })
        )
      );
    }
  }, {
    key: "sourceImgMasking",


    // 原图蒙版属性
    get: function get() {
      var _state7 = this.state,
          sourceImgContainer = _state7.sourceImgContainer,
          ratio = _state7.ratio,
          _props3 = this.props,
          width = _props3.width,
          height = _props3.height,
          sic = sourceImgContainer,
          sicRatio = sic.width / sic.height,
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
        scale: scale, // 蒙版相对需求宽高的缩放
        x: x,
        y: y,
        width: w,
        height: h
      };
    }

    // 原图样式

  }, {
    key: "sourceImgStyle",
    get: function get() {
      var scale = this.state.scale,
          sourceImgMasking = this.sourceImgMasking,
          top = scale.y + sourceImgMasking.y + "px",
          left = scale.x + sourceImgMasking.x + "px";

      return {
        position: "absolute",
        top: top,
        left: left,
        width: scale.width + "px",
        height: scale.height + "px" // 兼容 Opera
      };
    }

    // 原图遮罩样式

  }, {
    key: "sourceImgShadeStyle",
    get: function get() {
      var sourceImgContainer = this.state.sourceImgContainer,
          sourceImgMasking = this.sourceImgMasking,
          sic = sourceImgContainer,
          sim = sourceImgMasking,
          w = sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2,
          h = sim.height === sic.height ? sim.height : (sic.height - sim.height) / 2;

      return {
        width: w + "px",
        height: h + "px"
      };
    }
  }, {
    key: "previewStyle",
    get: function get() {
      var _state8 = this.state,
          ratio = _state8.ratio,
          previewContainer = _state8.previewContainer,
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
  }]);
  return ReactImageCrop;
}(Component);

ReactImageCrop.defaultProps = {
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
ReactImageCrop.propTypes = {
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

var ReactImageCropUpload = function (_Component) {
  inherits(ReactImageCropUpload, _Component);

  function ReactImageCropUpload(props) {
    classCallCheck(this, ReactImageCropUpload);

    var _this = possibleConstructorReturn(this, (ReactImageCropUpload.__proto__ || Object.getPrototypeOf(ReactImageCropUpload)).call(this, props));

    _this.onRef = function (ref) {
      _this.child = ref;
    };

    return _this;
  }

  createClass(ReactImageCropUpload, [{
    key: "upload",


    // 上传图片
    value: function upload() {
      var child = this.child,
          _props = this.props,
          url = _props.url,
          params = _props.params,
          headers = _props.headers,
          field = _props.field,
          withCredentials = _props.withCredentials,
          method = _props.method,
          handleCropUploadSuccess = _props.handleCropUploadSuccess,
          handleCropUploadFail = _props.handleCropUploadFail,
          ki = _props.ki,
          _child$state = child.state,
          imgFormat = _child$state.imgFormat,
          mime = _child$state.mime,
          createImgUrl = _child$state.createImgUrl,
          fmData = new FormData();

      fmData.append(field, data2blob(createImgUrl, mime), field + "." + imgFormat);

      // 添加其他参数
      if ((typeof params === "undefined" ? "undefined" : _typeof(params)) === "object" && params) {
        Object.keys(params).forEach(function (k) {
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
      child.reset();
      // child.setStep(3);
      new Promise(function (resolve, reject) {
        var client = new XMLHttpRequest();
        client.open(method, url, true);
        client.withCredentials = withCredentials;
        client.onreadystatechange = function () {
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
        if ((typeof headers === "undefined" ? "undefined" : _typeof(headers)) === "object" && headers) {
          Object.keys(headers).forEach(function (k) {
            client.setRequestHeader(k, headers[k]);
          });
        }
        client.send(fmData);
      }).then(
      // 上传成功
      function (resData) {
        handleCropUploadSuccess(resData, field, ki);
      },
      // 上传失败
      function (sts) {
        handleCropUploadFail(sts, field, ki);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ReactImageCrop, _extends({}, this.props, {
        upload: this.upload.bind(this),
        onRef: this.onRef
      }));
    }
  }]);
  return ReactImageCropUpload;
}(Component);

ReactImageCropUpload.defaultProps = {
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
ReactImageCropUpload.propTypes = {
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

export default ReactImageCropUpload;
