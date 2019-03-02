import e,{Component as t}from"react";import i from"prop-types";var a={jpg:"image/jpeg",png:"image/png",gif:"image/gif",svg:"image/svg+xml",psd:"image/photoshop"};function r(e,t){e=e.split(",")[1],e=window.atob(e);for(var i=new Uint8Array(e.length),a=0;a<e.length;a++)i[a]=e.charCodeAt(a);return new Blob([i],{type:t})}var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},o=function(){function e(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,i,a){return i&&e(t.prototype,i),a&&e(t,a),t}}(),h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a])}return e},l=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},c=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},u=function(i){function n(t){s(this,n);var i=c(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,t));i.canvasRef=e.createRef(),i.fileinput=e.createRef();var r=-1===["jpg","png"].indexOf(i.props.imgFormat)?"jpg":i.props.imgFormat,o=a[r];return i.state={step:1,file:null,isSupported:"function"==typeof FormData,isSupportTouch:document.hasOwnProperty("ontouchstart"),sourceImgMouseDown:{on:!1,mime:o,mX:0,mY:0,x:0,y:0},scale:{zoomAddOn:!1,zoomSubOn:!1,range:1,x:0,y:0,width:0,height:0,maxWidth:0,maxHeight:0,minWidth:0,minHeight:0,naturalWidth:0,naturalHeight:0},sourceImgContainer:{width:240,height:184},mime:a.jpg,ratio:i.props.width/i.props.height,sourceImg:null,sourceImgUrl:"",createImgUrl:"",previewContainer:{width:100,height:100}},i}return l(n,t),o(n,[{key:"changeFile",value:function(e){e.preventDefault();var t=e.target.files||e.dataTransfer.files;this.setState({file:t[0]}),this.setSourceImg(t[0]),this.setStep(2)}},{key:"setSourceImg",value:function(e){var t=this,i=new FileReader;i.onload=function(e){t.setState({sourceImgUrl:i.result}),t.startCrop()},i.readAsDataURL(e)}},{key:"startCrop",value:function(){var e=this,t=this,i=t.props,a=i.width,r=i.height,n=t.state,s=n.ratio,o=n.scale,l=n.sourceImgUrl,c=this.sourceImgMasking,u=new Image;u.src=l,u.onload=function(){var i=u.naturalWidth,n=u.naturalHeight,l=i/n,p=c.width,m=c.height,g=0,d=0;if(i<a||n<r)return t.hasError=!0,t.errorMsg="图片最低像素为（宽*高）："+a+"*"+r,!1;s>l&&(m=p/l,d=(c.height-m)/2),s<l&&(p=m*l,g=(c.width-p)/2),e.setState({scale:h({},o,{range:0,x:g,y:d,width:p,height:m,minWidth:p,minHeight:m,maxWidth:i*c.scale,maxHeight:n*c.scale,naturalWidth:i,naturalHeight:n}),sourceImg:u}),e.createImg()}}},{key:"prepareUpload",value:function(){var e=this.state,t=e.createImgUrl,i=r(t,e.mime);this.props.upload({createImgUrl:t,blob:i,file:this.state.file})}},{key:"preventDefault",value:function(e){return e.preventDefault(),!1}},{key:"imgStartMove",value:function(e){if(e.preventDefault(),this.state.isSupportTouch&&!e.targetTouches)return!1;var t=e.targetTouches?e.targetTouches[0]:e,i=this.state,a=i.sourceImgMouseDown,r=i.scale,n=a;n.mX=t.screenX,n.mY=t.screenY,n.x=r.x,n.y=r.y,n.on=!0}},{key:"imgMove",value:function(e){if(e.preventDefault(),this.state.isSupportTouch&&!e.targetTouches)return!1;var t=e.targetTouches?e.targetTouches[0]:e,i=this.state,a=i.sourceImgMouseDown,r=a.on,n=a.mX,s=a.mY,o=a.x,l=a.y,c=i.scale,u=this.sourceImgMasking,p=o+(t.screenX-n),m=l+(t.screenY-s);r&&(p>0&&(p=0),m>0&&(m=0),p<u.width-c.width&&(p=u.width-c.width),m<u.height-c.height&&(m=u.height-c.height),this.setState({scale:h({},this.state.scale,{x:p,y:m})}))}},{key:"createImg",value:function(e){var t=this.state,i=t.mime,a=t.sourceImg,r=t.scale,n=r.x,s=r.y,o=r.width,l=r.height,c=this.props,u=c.imgFormat,p=c.imgBgc,m=this.sourceImgMasking.scale,g=this.canvasRef.current,d=g.getContext("2d");e&&this.setState({sourceImgMouseDown:h({},this.state.sourceImgMouseDown,{on:!1})}),g.width=this.props.width,g.height=this.props.height,d.clearRect(0,0,this.props.width,this.props.height),d.fillStyle="png"===u?"rgba(0,0,0,0)":p,d.fillRect(0,0,this.props.width,this.props.height),d.drawImage(a,n/m,s/m,o/m,l/m),this.setState({createImgUrl:g.toDataURL(i)})}},{key:"handleClick",value:function(e){e.target!==this.fileinput.current&&(e.preventDefault(),this.fileinput.current.click())}},{key:"ripple",value:function(e){!function(e,t){var i=Object.assign({ele:e.target,type:"hit",bgc:"rgba(0, 0, 0, 0.15)"},t),a=i.ele;if(a){var r=a.getBoundingClientRect(),n=a.querySelector(".e-ripple");switch(n?n.className="e-ripple":((n=document.createElement("span")).className="e-ripple",n.style.height=n.style.width=Math.max(r.width,r.height)+"px",a.appendChild(n)),i.type){case"center":n.style.top=r.height/2-n.offsetHeight/2+"px",n.style.left=r.width/2-n.offsetWidth/2+"px";break;default:n.style.top=e.pageY-r.top-n.offsetHeight/2-document.body.scrollTop+"px",n.style.left=e.pageX-r.left-n.offsetWidth/2-document.body.scrollLeft+"px"}n.style.backgroundColor=i.bgc,n.className="e-ripple z-active"}}(e)}},{key:"setStep",value:function(e){1===e&&(this.fileinput.current.value=null),this.setState({step:e})}},{key:"startZoomSub",value:function(e){var t=this,i=t.state.scale;this.setState({scale:h({},i,{zoomSubOn:!0})}),function e(){if(i.zoomSubOn){var a=i.range<=0?0:--i.range;t.zoomImg(a),setTimeout(function(){e()},60)}}()}},{key:"zoomImg",value:function(e){var t=this,i=this.state.scale,a=this.sourceImgMasking,r=i.maxWidth,n=i.maxHeight,s=i.minWidth,o=i.minHeight,l=i.width,c=i.height,u=i.x,p=i.y,m=a,g=m.width,d=m.height,f=s+(r-s)*e/100,v=o+(n-o)*e/100,y=g/2-f/l*(g/2-u),b=d/2-v/c*(d/2-p);y>0&&(y=0),b>0&&(b=0),y<g-f&&(y=g-f),b<d-v&&(b=d-v),this.setState({scale:h({},i,{x:y,y:b,width:f,height:v,range:e})}),setTimeout(function(){i.range===e&&t.createImg()},300)}},{key:"endZoomSub",value:function(e){var t=this.state.scale;this.setState({scale:h({},t,{zoomSubOn:!1})})}},{key:"startZoomAdd",value:function(e){var t=this,i=t.state.scale;this.setState({scale:h({},i,{zoomAddOn:!0})}),function e(){if(i.zoomAddOn){var a=i.range>=100?100:++i.range;t.zoomImg(a),setTimeout(function(){e()},60)}}()}},{key:"endZoomAdd",value:function(e){var t=this.state.scale;this.setState({scale:h({},t,{zoomAddOn:!1})})}},{key:"zoomChange",value:function(e){this.zoomImg(e.target.value)}},{key:"rotateImg",value:function(e){var t=this.state,i=t.sourceImg,r=t.scale,n=r.naturalWidth,s=r.naturalHeight,o=s,h=n,l=this.canvasRef.current,c=l.getContext("2d");l.width=o,l.height=h,c.clearRect(0,0,o,h),c.fillStyle="rgba(0,0,0,0)",c.fillRect(0,0,o,h),c.translate(o,0),c.rotate(90*Math.PI/180),c.drawImage(i,0,0,n,s);var u=l.toDataURL(a.png);this.setState({sourceImgUrl:u}),this.startCrop()}},{key:"showFiles",value:function(){var t=this.state,i=t.sourceImgUrl,a=t.createImgUrl,r=t.file,n=t.scale,s=this.props,o=s.noRotate,l=s.noCircle,c=s.noSquare;return r?e.createElement("div",{className:"ricu-step2"},e.createElement("div",null,e.createElement("div",{className:"ricu-step2-left"},e.createElement("img",{style:this.sourceImgStyle,src:i,draggable:!1,onDrag:this.preventDefault,onDragStart:this.preventDefault,onDragEnd:this.preventDefault,onDragLeave:this.preventDefault,onDragOver:this.preventDefault,onDragEnter:this.preventDefault,onDrop:this.preventDefault,onTouchStart:this.imgStartMove.bind(this),onTouchMove:this.imgMove.bind(this),onTouchEnd:this.createImg.bind(this),onTouchCancel:this.createImg.bind(this),onMouseDown:this.imgStartMove.bind(this),onMouseMove:this.imgMove.bind(this),onMouseUp:this.createImg.bind(this),onMouseOut:this.createImg.bind(this),alt:""}),e.createElement("div",{className:"ricu-img-shade ricu-img-shade-1",style:this.sourceImgShadeStyle}),e.createElement("div",{className:"ricu-img-shade ricu-img-shade-2",style:this.sourceImgShadeStyle})),e.createElement("div",{className:"ricu-range"},e.createElement("input",{type:"range",value:n.range,step:"1",min:"0",max:"100",onMouseMove:this.zoomChange.bind(this),onChange:this.zoomChange.bind(this)}),e.createElement("i",{onMouseDown:this.startZoomSub.bind(this),onMouseOut:this.endZoomSub.bind(this),onMouseUp:this.endZoomSub.bind(this),className:"ricu-icon5"}),e.createElement("i",{onMouseDown:this.startZoomAdd.bind(this),onMouseOut:this.endZoomAdd.bind(this),onMouseUp:this.endZoomAdd.bind(this),className:"ricu-icon6"})),!o&&e.createElement("div",{className:"ricu-rotate"},e.createElement("i",{onClick:this.rotateImg.bind(this)},"↻"))),e.createElement("div",{className:"ricu-step2-right"},!c&&e.createElement("div",null,e.createElement("img",{src:a,style:this.previewStyle,alt:""}),e.createElement("div",{className:"ricu-step2-right-text"},"头像预览")),!l&&e.createElement("div",null,e.createElement("img",{src:a,style:h({},this.previewStyle,{borderRadius:"100%"}),alt:""}),e.createElement("div",{className:"ricu-step2-right-text"},"头像预览")))):""}},{key:"render",value:function(){var t=this,i=this.props,a=i.width,r=i.height,n=i.off,s=this.state,o=s.step,h=s.isSupported;return e.createElement("div",{className:"ricu"},e.createElement("div",{className:"ricu-wrap"},e.createElement("div",{className:"ricu-close",onClick:n},e.createElement("i",{className:"ricu-icon4"})),e.createElement("div",{className:"ricu-step1",style:{display:1!==o&&"none"}},e.createElement("div",{className:"ricu-drop-area",onDragLeave:this.preventDefault,onDragOver:this.preventDefault,onDragEnter:this.preventDefault,onClick:this.handleClick.bind(this),onDrop:this.changeFile.bind(this)},e.createElement("i",{className:"ricu-icon1"},e.createElement("i",{className:"ricu-icon1-arrow"}),e.createElement("i",{className:"ricu-icon1-body"}),e.createElement("i",{className:"ricu-icon1-bottom"})),e.createElement("span",{className:"ricu-hint"},"点击，或拖动图片至此处"),e.createElement("span",{className:"ricu-no-supported-hint",style:{display:h&&"none"}},"浏览器不支持该功能，请使用IE10以上或其他现代浏览器！"),e.createElement("input",{style:{display:"none"},id:"file",type:"file",accept:"image/png, image/jpeg, image/gif, image/jpg",onChange:this.changeFile.bind(this),ref:this.fileinput}))),e.createElement("div",{style:{display:2!==o&&"none"}},this.showFiles()),e.createElement("div",{className:"ricu-operate"},e.createElement("button",{onClick:function(){return t.setStep.call(t,1)},onMouseDown:this.ripple,style:{display:1===o&&"none"}},"上一步"),e.createElement("button",{style:{display:1===o&&"none"},className:"ricu-operate-btn",onClick:this.prepareUpload.bind(this),onMouseDown:this.ripple},"保存"),e.createElement("button",{onClick:n,onMouseDown:this.ripple,style:{display:1!==o&&"none"}},"关闭")),e.createElement("canvas",{style:{display:"none"},width:a,height:r,ref:this.canvasRef})))}},{key:"sourceImgMasking",get:function(){var e=this.state,t=e.sourceImgContainer,i=e.ratio,a=this.props,r=a.width,n=a.height,s=t,o=s.width/s.height,h=0,l=0,c=s.width,u=s.height,p=1;return i<o&&(p=s.height/n,c=s.height*i,h=(s.width-c)/2),i>o&&(p=s.width/r,u=s.width/i,l=(s.height-u)/2),{scale:p,x:h,y:l,width:c,height:u}}},{key:"sourceImgStyle",get:function(){var e=this.state.scale,t=this.sourceImgMasking;return{position:"absolute",top:e.y+t.y+"px",left:e.x+t.x+"px",width:e.width+"px",height:e.height+"px"}}},{key:"sourceImgShadeStyle",get:function(){var e=this.state.sourceImgContainer,t=this.sourceImgMasking;return{width:(t.width===e.width?t.width:(e.width-t.width)/2)+"px",height:(t.height===e.height?t.height:(e.height-t.height)/2)+"px"}}},{key:"previewStyle",get:function(){var e=this.state,t=e.ratio,i=e.previewContainer,a=i.width,r=i.height,n=a/r;return t<n&&(a=i.height*t),t>n&&(r=i.width/t),{width:a+"px",height:r+"px"}}}]),n}();u.defaultProps={imgFormat:"png",imgBgc:"#fff",width:200,height:200,noRotate:!0,noCircle:!1,noSquare:!1},u.propTypes={width:i.number,height:i.number,imgFormat:i.string,imgBgc:i.string,noCircle:i.bool,noSquare:i.bool,noRotate:i.bool,off:i.func.isRequired,upload:i.func.isRequired};var p=function(i){function a(t){s(this,a);var i=c(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,t));return i.cropRef=e.createRef(),i}return l(a,t),o(a,[{key:"upload",value:function(e){var t=e.createImgUrl,i=(e.blob,e.file,this.cropRef.current),a=this.props,s=a.url,o=a.params,h=a.headers,l=a.field,c=a.withCredentials,u=a.method,p=a.handleCropUploadSuccess,m=a.handleCropUploadFail,g=a.ki,d=i.state,f=d.imgFormat,v=d.mime,y=new FormData;y.append(l,r(t,v),l+"."+f),"object"===(void 0===o?"undefined":n(o))&&o&&Object.keys(o).forEach(function(e){y.append(e,o[e])}),new Promise(function(e,t){var i=new XMLHttpRequest;i.open(u,s,!0),i.withCredentials=c,i.onreadystatechange=function(){4===this.readyState&&(200===this.status||201===this.status?e(JSON.parse(this.responseText)):t(this.status))},"object"===(void 0===h?"undefined":n(h))&&h&&Object.keys(h).forEach(function(e){i.setRequestHeader(e,h[e])}),i.send(y)}).then(function(e){p(e,l,g)},function(e){m(e,l,g)})}},{key:"render",value:function(){return e.createElement(u,h({},this.props,{upload:this.upload.bind(this),ref:this.cropRef}))}}]),a}();p.defaultProps={url:"",method:"POST",field:"upload",params:null,headers:null,withCredentials:!1,ki:0},p.propTypes={url:i.string,method:i.string,field:i.string,params:i.object,headers:i.object,withCredentials:i.bool,ki:i.number,handleCropUploadSuccess:i.func.isRequired,handleCropUploadFail:i.func.isRequired};export default p;
