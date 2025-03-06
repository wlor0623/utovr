var JTUtil = {
	gId: function(id) {
		return document.getElementById(id) ? document.getElementById(id) : null
	},
	gName: function(name) {
		return document.getElementsByTagName(name) ? document.getElementsByTagName(name) : null
	},
	contains: function(a, b) {
		if (!a) return false;
		return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(arg) & 16)
	},
	insertAfter: function(newElement, targetElement) {
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			parent.appendChild(newElement)
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling)
		}
	},
	insertBefore: function(newElement, targetElement) {
		var parent = targetElement.parentNode;
		parent.insertBefore(newElement, targetElement)
	},
	cDom: function(tagName) {
		return document.createElement(tagName)
	},
	lScript: function(id, src, callback, cthis) {
		var script = JTUtil.cDom("script");
		script.name = id;
		script.type = "text/javascript";
		script.src = src;
		script.charset = "utf-8";
		script.onload = function() {
			if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
				if (callback && cthis) {
					callback.call(cthis)
				} else if (callback) {
					callback()
				}
			}
		};
		this.gName("head")[0].appendChild(script)
	},
	lCss: function(id, src, callback, cthis) {
		var link = JTUtil.cDom("link");
		link.name = id;
		link.type = "text/css";
		link.rel = "stylesheet";
		link.charset = "utf-8";
		link.href = src;
		link.onload = function() {
			if (callback && cthis) {
				callback.call(cthis)
			} else if (callback) {
				callback()
			}
		};
		this.gName("head")[0].appendChild(link)
	},
	getBrowser: function() {
		var ua = navigator.userAgent.toLowerCase();
		var btypeInfo = (ua.match(/firefox|chrome|safari|opera/g) || "other")[0];
		if ((ua.match(/edge|msie|trident/g) || [])[0]) {
			btypeInfo = "msie"
		}
		var pc = "pc";
		var prefix = "";
		var plat = "";
		var isTocuh = ("ontouchstart" in window) || (ua.indexOf("touch") != -1) || (ua.indexOf("mobile") != -1);
		if (isTocuh) {
			if (ua.indexOf("ipad") !== -1) {
				pc = "pad"
			} else if (ua.indexOf("mobile") !== -1) {
				pc = "mobile"
			} else if (ua.indexOf("android") !== -1) {
				pc = "androidPad"
			}
		} else {
			pc = "pc"
		}
		switch (btypeInfo) {
			case "chrome":
			case "safari":
			case "mobile":
				prefix = "webkit";
				break;
			case "msie":
				prefix = "ms";
				break;
			case "firefox":
				prefix = "Moz";
				break;
			case "opera":
				prefix = "O";
				break;
			default:
				prefix = "webkit";
				break
		}
		plat = (ua.indexOf("android") > 0) ? "android" : navigator.platform.toLowerCase();
		return {
			version: (ua.match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
			plat: plat,
			type: btypeInfo,
			pc: pc,
			prefix: prefix,
			isMobile: (pc == "pc" || pc == "other") ? false : true
		}
	},
	getLanguage: function() {
		var nl = navigator.language;
		var lg = (nl === "zh-CN" || nl === "zh-cn") ? "cn" : (nl === "ja") ? "jp" : "en";
		return lg
	},
	getWindowOrientation: function() {
		if (window.orientation == 0 || window.orientation == 180) {
			return 'Vertical'
		} else if (window.orientation == 90 || window.orientation == -90) {
			return 'Horizontal'
		}
		return null
	},
	getWindowSize: function() {
		var wo = this.getWindowOrientation();
		var json = {
			position: {
				left: window.screenX || window.screenLeft,
				top: window.screenY || window.screenTop,
				width: window.screen.width,
				height: window.screen.height
			},
			width: document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth,
			height: document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight,
			viewPort: {
				width: document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
				horizontalScroll: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
				verticalScroll: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
			},
			Document: {
				width: document.documentElement.scrollWidth || document.body.scrollWidth,
				height: document.documentElement.scrollHeight || document.body.scrollHeight
			}
		};
		if (this.getBrowser()
			.pc == "pad" && wo == "Horizontal" && this.getBrowser()
			.type == "safari") {
			var ver = navigator.userAgent.toLowerCase()
				.match(/version\/[\d.]+/gi) + "";
			var ver_num = ver.replace(/[^0-9.]/ig, "")
				.split(".")[0] || 8;
			if (ver_num && (ver_num < 8)) {
				json.viewPort.height = json.viewPort.height - 20
			}
		}
		return json
	},
	loadResource: function(uri, callBack) {
		var xmlHttp = this.createXMLHttp();
		var url = uri;
		xmlHttp.open("GET", url, true);
		xmlHttp.send();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				var result = xmlHttp.responseText || xmlHttp.response;
				if (callBack && typeof callBack == "function") {
					callBack(result)
				}
			}
		}
	},
	createXMLHttp: function() {
		var XmlHttp;
		if (window.ActiveXObject) {
			var arr = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];
			for (var i = 0; i < arr.length; i++) {
				try {
					XmlHttp = new ActiveXObject(arr[i]);
					return XmlHttp
				} catch (error) {}
			}
		} else {
			try {
				XmlHttp = new XMLHttpRequest;
				return XmlHttp
			} catch (otherError) {}
		}
	},
	to16Hex: function(v) {
		var s = v.toString(16);
		return s.length == 2 ? s : "0" + s
	},
	rndRGB: function() {
		var r = Math.floor(Math.random() * 256),
			g = Math.floor(Math.random() * 256),
			b = Math.floor(Math.random() * 256);
		return "#" + this.to16Hex(r) + this.to16Hex(g) + this.to16Hex(b)
	},
	rgbToHex: function(r, g, b) {
		return "#" + this.to16Hex(r) + this.to16Hex(g) + this.to16Hex(b)
	},
	hexToRgb: function(rgb_str) {
		if (rgb_str.length != 7) {
			return [0, 0, 0]
		}
		var r = rgb_str.substr(1, 2),
			g = rgb_str.substr(3, 2),
			b = rgb_str.substr(3, 2);
		return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
	},
	argbToRgba: function(argb) {
		var colorArr = argb ? argb.split(",") : "";
		var opacity = (colorArr[0] / 255)
			.toFixed(2);
		var bgColor = colorArr ? "rgba(" + colorArr[1] + "," + colorArr[2] + "," + colorArr[3] + "," + opacity + ")" : "";
		return bgColor
	},
	xmlParseToJSON: function(nodes, flag) {
		var json = {};
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var name = node.nodeName;
			var type = node.nodeType;
			var value = null;
			if (type == 3) {
				continue
			}
			if (node.childNodes.length == 0) {
				value = null
			} else if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
				value = node.childNodes[0].nodeValue
			} else {
				value = this.xmlParseToJSON(node.childNodes, flag)
			}
			if (!json[name]) {
				json[name] = value
			} else {
				if (Object.prototype.toString.call(json[name]) === "[object Array]") {
					json[name].push(value)
				} else {
					var _value = json[name];
					json[name] = [];
					json[name].push(_value);
					json[name].push(value)
				}
			}
		}
		return json
	},
	getXMLDOM: function(source) {
		var doc;
		if (window.ActiveXObject) {
			doc = new ActiveXObject("Msxml2.DOMDocument");
			doc.async = false;
			doc.loadXML(source)
		} else {
			var parser = new DOMParser();
			doc = parser.parseFromString(source, "text/xml")
		}
		return doc.documentElement
	},
	supportsStyle: function(prop) {
		var div = JTUtil.cDom('div'),
			vendors = 'Khtml Ms O Moz Webkit'.split(' '),
			len = vendors.length;
		if (prop in div.style) return true;
		prop = prop.replace(/^[a-z]/, function(val) {
			return val.toUpperCase()
		});
		while (len--) {
			if (vendors[len] + prop in div.style) {
				return true
			}
		}
		return false
	},
	pluginCheck: function() {
		var pluginSupported = {};
		var pluginList = {
			flash: {
				activex: "ShockwaveFlash.ShockwaveFlash",
				plugin: /flash/gim
			},
			pdf: {
				activex: "PDF.PdfCtrl",
				plugin: /adobe\s?acrobat/gim
			},
			java: {
				activex: navigator.javaEnabled(),
				plugin: /java/gim
			}
		};
		var isSupported = function(p) {
			if (window.ActiveXObject) {
				try {
					new ActiveXObject(pluginList[p].activex);
					pluginSupported[p] = true
				} catch (e) {
					pluginSupported[p] = false
				}
			} else {
				for (var i = 0; i < navigator.plugins.length; i++) {
					var pluginsObj = navigator.plugins[i];
					if (pluginsObj.name.match(pluginList[p].plugin)) {
						pluginSupported[p] = true;
						return false
					} else {
						pluginSupported[p] = false
					}
				}
			}
		};
		for (var key in pluginList) {
			isSupported(key)
		}
		return pluginSupported
	},
	support_WebGL: function() {
		if (!!window.WebGLRenderingContext) {
			var canvas = document.createElement("canvas"),
				names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
				gl = false;
			for (var i in names) {
				try {
					gl = canvas.getContext(names[i]);
					if (gl) {
						return true
					}
				} catch (e) {}
			}
			return false
		}
		return false
	},
	getWebGLInfo: function() {
		"use strict"
	},
	support_Css3D: function() {
		var e, t, i = false,
			s = JTUtil.cDom("div");
		for (e = 0; e < 5; e++)
			if (typeof s.style[["p", "msP", "MozP", "WebkitP", "OP"][e] + "erspective"] != "undefined") {
				i = true, e == 3 && window.matchMedia && (t = window.matchMedia("(-webkit-transform-3d)"), t && (i = t.matches == true));
				break
			} return i
	},
	registerCss: function(cssText) {
		var style = JTUtil.cDom("style");
		var head = document.getElementsByTagName("head")[0];
		if (!head) {
			return
		}
		if (document.all) {
			style.setAttribute("type", "text/css");
			style.styleSheet.cssText = cssText
		} else {
			style.appendChild(document.createTextNode(cssText))
		}
		if (head.firstChild) {
			head.insertBefore(style, head.firstChild)
		} else {
			head.appendChild(style)
		}
		return style
	},
	isSupportFullScreen: function() {
		var doc = document.documentElement;
		var ua = navigator.userAgent.toLowerCase();
		var isQQBrowser = /mqqbrowser\//i.test(ua);
		if (isQQBrowser) return false;
		return ('requestFullscreen' in doc) || ('webkitRequestFullScreen' in doc) || ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) || false
	},
	isFullScreen: function() {
		var dom = document;
		return dom.msFullscreenElement || dom.mozFullScreenElement || dom.webkitFullscreenElement || dom.webkitIsFullScreen || false
	},
	reqFullScreen: function(dom) {
		var fullscreenElement = document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullScreenElement || document.webkitIsFullScreen;
		var dom = dom ? dom : document.documentElement;
		if (!fullscreenElement) {
			dom.requestFullScreen && dom.requestFullScreen();
			dom.webkitRequestFullScreen && dom.webkitRequestFullScreen();
			dom.msRequestFullscreen && dom.msRequestFullscreen();
			dom.mozRequestFullScreen && dom.mozRequestFullScreen();
			dom.oRequestFullScreen && dom.oRequestFullScreen();
			return true
		} else {
			document.exitFullscreen && document.exitFullscreen();
			document.cancelFullScreen && document.cancelFullScreen();
			document.webkitCancelFullScreen && document.webkitCancelFullScreen();
			document.msExitFullscreen && document.msExitFullscreen();
			document.mozCancelFullScreen && document.mozCancelFullScreen();
			document.oCancelFullScreen && document.oCancelFullScreen();
			return false
		}
	},
	firstCharUpCase: function(str) {
		var operate2 = "";
		str = str || "";
		for (var j = 0, len = str.length; j < len; j++) {
			var ch2 = str.charAt(j);
			if (j == 0) {
				operate2 = ch2.toUpperCase()
			} else {
				operate2 += ch2.toLowerCase()
			}
		}
		return operate2
	},
	setToArray: function(obj) {
		if (obj && Object.prototype.toString.call(obj) != "[object Array]") {
			var cmaps = obj;
			var arr = [];
			arr.push(cmaps);
			return arr
		} else {
			return obj
		}
	},
	getBestFitSize: function(ImgWidth, ImgHeight, tarWidth, tarHeight) {
		var img_width = ImgWidth,
			img_height = ImgHeight,
			img_lv = img_width / img_height;
		var target_width = tarWidth,
			target_height = tarHeight;
		var width, height, left, top;
		if (img_lv > 1) {
			width = target_width;
			height = target_width / img_width * img_height;
			if (height > target_height) {
				width = target_height / height * width;
				height = target_height
			}
			left = (target_width - width) * 0.5;
			top = (target_height - height) * 0.5
		} else {
			height = target_height;
			width = target_height / img_height * img_width;
			if (width > target_width) {
				height = target_width / width * height;
				width = target_width
			}
			left = (target_width - width) * 0.5;
			top = (target_height - height) * 0.5
		}
		return {
			"width": width,
			"height": height,
			"left": left,
			"top": top
		}
	},
	getCenterSize: function(sWidth, sHeight, tWidth, tHeight) {
		return {
			"width": sWidth,
			"height": sHeight,
			"top": (tHeight - sHeight) * 0.5,
			"left": (tWidth - sWidth) * 0.5
		}
	},
	setViewPort: function(sWidth) {
		if (this.getBrowser()
			.pc === "pc") return;
		var metaViewPort = document.getElementsByName("viewport")[0];
		if (!metaViewPort) {
			metaViewPort = JTUtil.cDom("meta");
			metaViewPort.name = "viewport";
			document.getElementsByTagName("head")[0].appendChild(metaViewPort)
		}
		var DEFAULT_WIDTH = sWidth,
			ua = navigator.userAgent.toLowerCase(),
			deviceWidth = window.screen.width;
		var mobile = (/iphone|ipod/gi)
			.test(navigator.platform);
		var contentText = "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui,target-densitydpi=device-dpi";
		if (!isNaN(DEFAULT_WIDTH)) {
			if (mobile) {
				if (ua.indexOf("version/6") > 0 || ua.indexOf("iphone os 6") > 0) {
					contentText = "width=640, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5,minimal-ui"
				} else {
					contentText = "width=" + DEFAULT_WIDTH + "px, user-scalable=no, minimal-ui,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5"
				}
			}
			if (ua.indexOf("android") !== -1) {
				contentText = "target-densitydpi=device-dpi, user-scalable=no";
				if (ua.indexOf("mobile") !== -1) {
					contentText = "target-densitydpi=device-dpi, width=" + DEFAULT_WIDTH + "px, user-scalable=no";
					var devicePixelRatio = window.devicePixelRatio || 1,
						targetDensitydpi = DEFAULT_WIDTH / deviceWidth * devicePixelRatio * 160,
						versoinAndroid = parseFloat(ua.slice(ua.indexOf("android") + 8));
					if (versoinAndroid < 4) {
						contentText = 'target-densitydpi=' + targetDensitydpi + ', width=device-width, user-scalable=no'
					}
					if (ua.indexOf("qq") !== -1 || ua.indexOf("micromessenger") !== -1) {
						contentText = 'target-densitydpi=' + targetDensitydpi + ', width=device-width, user-scalable=no'
					}
					if (ua.indexOf("firefox") !== -1) {
						contentText = "target-densitydpi=device-dpi, width=" + DEFAULT_WIDTH + "px, user-scalable=no"
					}
				}
			}
		}
		metaViewPort.content = contentText;
		return contentText
	},
	getQueryString: function(name) {
		name = name.replace(/[\[]/, "\\[")
			.replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
	},
	getFileExt: function(str) {
		var str = str;
		var num = str.indexOf("?");
		if (num > 0) {
			str = str.substring(0, num)
		}
		var d = /\.[^\.]+$/.exec(str);
		return (d ? d[0] : "")
	},
	css3Animate: function(curDom, css, time, fn) {
		var el = curDom;
		var Browser = JTUtil.getBrowser();
		var callback = function() {
			fn && fn(arguments);
			EventUtil.removeEvent(el, "transitionEnd", callback);
			el.style[Browser.prefix + "Transition"] = ""
		};
		EventUtil.addEvent(el, "transitionEnd", callback);
		var eff = "";
		for (var k in css) {
			eff += k + ' ' + time + 's,'
		}
		getComputedStyle(el)
			.width;
		el.style[Browser.prefix + "Transition"] = eff + "color 0s";
		for (var k in css) {
			el.style[k] = css[k]
		}
	},
	formatToMin: function(num) {
		var min = Math.floor(num / 60);
		min = min < 10 ? "0" + min : min;
		var sec = Math.floor(num % 60);
		sec = sec < 10 ? "0" + sec : sec;
		return min + ":" + sec
	},
	getRandomNum: function(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		return (Min + Math.round(Rand * Range))
	},
	toUnicodeByStr: function(str) {
		var codes = [];
		for (var i = 0; i < str.length; i++) {
			codes.push(str.charCodeAt(i))
		}
		return codes
	},
	toStrByUniCode: function(arr) {
		var codes = [];
		for (var i = 0; i < arr.length; i++) {
			codes.push(String.fromCharCode(arr[i]))
		}
		return codes.join("")
	},
	isIFrame: function() {
		try {
			return window.self !== window.top
		} catch (e) {
			return true
		}
	},
	isPow2: function(n) {
		return (n & (n - 1)) == 0
	},
	isIOS: function() {
		return /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
	},
	isMobile: function() {
		var check = false;
		(function(a) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
		})(navigator.userAgent || navigator.vendor || window.opera);
		return check
	},
	isEmptyObject: function(e) {
		var t;
		for (t in e) return !1;
		return !0
	}
};
var EventUtil = {
	getEventName: function(name) {
		var transitionEnd, fullscreenchange, Browser;
		Browser = JTUtil.getBrowser();
		switch (Browser.prefix) {
			case "webkit":
				transitionEnd = 'webkitTransitionEnd';
				fullscreenchange = 'webkitfullscreenchange';
				break;
			case "ms":
				transitionEnd = 'MSTransitionEnd';
				fullscreenchange = 'MSFullscreenChange';
				break;
			case "O":
				transitionEnd = 'otransitionend';
				fullscreenchange = 'ofullscreenchange';
				break;
			case "Moz":
				transitionEnd = 'transitionend';
				fullscreenchange = 'mozfullscreenchange';
				break;
			default:
				transitionEnd = 'transitionend';
				fullscreenchange = 'fullscreenchange'
		}
		var list = {
			"mousewheel": (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",
			"fullScreenChange": fullscreenchange,
			"resize": "resize"
		};
		return list[name] || name
	},
	addEvent: function(dom, type, fn, callobj) {
		var name = this.getEventName(type);
		var callFn = function(e) {
			var e1 = EventUtil.getEvent(e);
			fn.call(callobj, e1, e)
		};
		if (dom.addEventListener) {
			dom.addEventListener(name, callFn, false)
		} else if (dom.attachEvent) {
			dom.attachEvent("on" + name, callFn)
		} else {
			dom["on" + name] = callFn
		}
		return callFn
	},
	removeEvent: function(dom, type, fn) {
		var name = this.getEventName(type);
		if (dom.removeEventListener) {
			dom.removeEventListener(name, fn, false)
		} else if (dom.detachEvent) {
			dom.detachEvent("on" + name, fn)
		} else {
			dom["on" + name] = null
		}
		return dom
	},
	getTarget: function(event) {
		return event.target || event.srcElement
	},
	getEvent: function(event) {
		var Browser = JTUtil.getBrowser();
		if (Browser.isMobile) {
			EventUtil.stopDefault(event);
			EventUtil.stopPropagation(event)
		}
		return event.changedTouches ? event.changedTouches[0] : (event || window.event)
	},
	stopDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault()
		} else {
			event.returnValue = false
		}
	},
	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation()
		} else {
			event.cancelBubble = true
		}
	},
	getButton: function(event) {
		if (document.implementation.hasFeature("MouseEvents", "2.0")) {
			return event.button
		} else {
			switch (event.button) {
				case 0:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1
			}
		}
	},
	getEventSize: function(event) {
		return {
			x: event.clientX,
			y: event.clientY
		}
	},
	getOffsetX: function(event) {
		var evt = event || window.event;
		var srcObj = evt.target || evt.srcElement;
		if (evt.offsetX) {
			return evt.offsetX
		} else {
			var rect = srcObj.getBoundingClientRect();
			var clientx = evt.clientX;
			return clientx - rect.left
		}
	},
	getOffsetY: function(event) {
		var evt = event || window.event;
		var srcObj = evt.target || evt.srcElement;
		if (evt.offsetY) {
			return evt.offsetY
		} else {
			var rect = srcObj.getBoundingClientRect();
			var clienty = evt.clientY;
			return clienty - rect.top
		}
	},
	throttle: function(fn, delay, immediate, debounce) {
		var curr = +new Date(),
			last_call = 0,
			last_exec = 0,
			timer = null,
			diff, context, args, exec = function() {
				last_exec = curr;
				fn.apply(context, args)
			};
		return function() {
			curr = +new Date();
			context = this, args = arguments, diff = curr - (debounce ? last_call : last_exec) - delay;
			clearTimeout(timer);
			if (debounce) {
				if (immediate) {
					timer = setTimeout(exec, delay)
				} else if (diff >= 0) {
					exec()
				}
			} else {
				if (diff >= 0) {
					exec()
				} else if (immediate) {
					timer = setTimeout(exec, -diff)
				}
			}
			last_call = curr
		}
	},
	debounce: function(fn, delay, immediate) {
		return this.throttle(fn, delay, immediate, true)
	}
};
var DomUtil = {
	inject: function(curDom, targetDom) {
		targetDom && targetDom.appendChild(curDom);
		return curDom
	},
	insertAfter: function(curElement, targetElement) {
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			parent.appendChild(curElement)
		} else {
			parent.insertBefore(curElement, targetElement.nextSibling)
		}
	},
	insertBefore: function(curElement, targetElement) {
		var parent = targetElement.parentNode;
		parent.insertBefore(curElement, targetElement)
	},
	setStyles: function(curDom, options) {
		for (var key in options) {
			curDom.style[key] = options[key]
		}
		return curDom
	},
	getStyle: function(element, attr) {
		if (typeof window.getComputedStyle != 'undefined') {
			return parseInt(window.getComputedStyle(element, null)[attr])
		} else if (element.currentStyle) {
			return parseInt(element.currentStyle[attr])
		}
	},
	setProperties: function(curDom, options) {
		for (var key in options) {
			curDom.setAttribute(key, options[key])
		}
		return curDom
	},
	destroy: function(curDom) {
		curDom.parentNode && curDom.parentNode.removeChild(curDom)
	},
	hasClass: function(ele, cls) {
		return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
	},
	addClass: function(ele, cls) {
		if (!this.hasClass(ele, cls)) {
			ele.className += " " + cls
		}
	},
	removeClass: function(ele, cls) {
		if (this.hasClass(ele, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(reg, " ")
		}
	},
	getSize: function(dom) {
		var ro = dom.getBoundingClientRect();
		var Top = ro.top;
		var Bottom = ro.bottom;
		var Left = ro.left;
		var Right = ro.right;
		var Width = ro.width || Right - Left;
		var Height = ro.height || Bottom - Top;
		return {
			top: Top,
			left: Left,
			right: Right,
			bottom: Bottom,
			width: Width,
			height: Height
		}
	}
};
(function(_global) {
	"use strict";
	var shim = {};
	if (typeof exports === "undefined") {
		shim.exports = typeof window !== "undefined" ? window : _global
	} else {
		shim.exports = exports
	}(function(exports) {
		if (!GLMAT_EPSILON) {
			var GLMAT_EPSILON = 1e-6
		}
		if (!GLMAT_ARRAY_TYPE) {
			var GLMAT_ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array
		}
		if (!GLMAT_RANDOM) {
			var GLMAT_RANDOM = Math.random
		}
		var glMatrix = {};
		glMatrix.setMatrixArrayType = function(type) {
			GLMAT_ARRAY_TYPE = type
		};
		if (typeof exports !== "undefined") {
			exports.glMatrix = glMatrix
		}
		var degree = Math.PI / 180;
		glMatrix.toRadian = function(a) {
			return a * degree
		};
		var vec2 = {};
		vec2.create = function() {
			var out = new GLMAT_ARRAY_TYPE(2);
			out[0] = 0;
			out[1] = 0;
			return out
		};
		vec2.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(2);
			out[0] = a[0];
			out[1] = a[1];
			return out
		};
		vec2.fromValues = function(x, y) {
			var out = new GLMAT_ARRAY_TYPE(2);
			out[0] = x;
			out[1] = y;
			return out
		};
		vec2.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			return out
		};
		vec2.set = function(out, x, y) {
			out[0] = x;
			out[1] = y;
			return out
		};
		vec2.add = function(out, a, b) {
			out[0] = a[0] + b[0];
			out[1] = a[1] + b[1];
			return out
		};
		vec2.subtract = function(out, a, b) {
			out[0] = a[0] - b[0];
			out[1] = a[1] - b[1];
			return out
		};
		vec2.sub = vec2.subtract;
		vec2.multiply = function(out, a, b) {
			out[0] = a[0] * b[0];
			out[1] = a[1] * b[1];
			return out
		};
		vec2.mul = vec2.multiply;
		vec2.divide = function(out, a, b) {
			out[0] = a[0] / b[0];
			out[1] = a[1] / b[1];
			return out
		};
		vec2.div = vec2.divide;
		vec2.min = function(out, a, b) {
			out[0] = Math.min(a[0], b[0]);
			out[1] = Math.min(a[1], b[1]);
			return out
		};
		vec2.max = function(out, a, b) {
			out[0] = Math.max(a[0], b[0]);
			out[1] = Math.max(a[1], b[1]);
			return out
		};
		vec2.scale = function(out, a, b) {
			out[0] = a[0] * b;
			out[1] = a[1] * b;
			return out
		};
		vec2.scaleAndAdd = function(out, a, b, scale) {
			out[0] = a[0] + b[0] * scale;
			out[1] = a[1] + b[1] * scale;
			return out
		};
		vec2.distance = function(a, b) {
			var x = b[0] - a[0],
				y = b[1] - a[1];
			return Math.sqrt(x * x + y * y)
		};
		vec2.dist = vec2.distance;
		vec2.squaredDistance = function(a, b) {
			var x = b[0] - a[0],
				y = b[1] - a[1];
			return x * x + y * y
		};
		vec2.sqrDist = vec2.squaredDistance;
		vec2.length = function(a) {
			var x = a[0],
				y = a[1];
			return Math.sqrt(x * x + y * y)
		};
		vec2.len = vec2.length;
		vec2.squaredLength = function(a) {
			var x = a[0],
				y = a[1];
			return x * x + y * y
		};
		vec2.sqrLen = vec2.squaredLength;
		vec2.negate = function(out, a) {
			out[0] = -a[0];
			out[1] = -a[1];
			return out
		};
		vec2.inverse = function(out, a) {
			out[0] = 1 / a[0];
			out[1] = 1 / a[1];
			return out
		};
		vec2.normalize = function(out, a) {
			var x = a[0],
				y = a[1];
			var len = x * x + y * y;
			if (len > 0) {
				len = 1 / Math.sqrt(len);
				out[0] = a[0] * len;
				out[1] = a[1] * len
			}
			return out
		};
		vec2.dot = function(a, b) {
			return a[0] * b[0] + a[1] * b[1]
		};
		vec2.cross = function(out, a, b) {
			var z = a[0] * b[1] - a[1] * b[0];
			out[0] = out[1] = 0;
			out[2] = z;
			return out
		};
		vec2.lerp = function(out, a, b, t) {
			var ax = a[0],
				ay = a[1];
			out[0] = ax + t * (b[0] - ax);
			out[1] = ay + t * (b[1] - ay);
			return out
		};
		vec2.random = function(out, scale) {
			scale = scale || 1;
			var r = GLMAT_RANDOM() * 2 * Math.PI;
			out[0] = Math.cos(r) * scale;
			out[1] = Math.sin(r) * scale;
			return out
		};
		vec2.transformMat2 = function(out, a, m) {
			var x = a[0],
				y = a[1];
			out[0] = m[0] * x + m[2] * y;
			out[1] = m[1] * x + m[3] * y;
			return out
		};
		vec2.transformMat2d = function(out, a, m) {
			var x = a[0],
				y = a[1];
			out[0] = m[0] * x + m[2] * y + m[4];
			out[1] = m[1] * x + m[3] * y + m[5];
			return out
		};
		vec2.transformMat3 = function(out, a, m) {
			var x = a[0],
				y = a[1];
			out[0] = m[0] * x + m[3] * y + m[6];
			out[1] = m[1] * x + m[4] * y + m[7];
			return out
		};
		vec2.transformMat4 = function(out, a, m) {
			var x = a[0],
				y = a[1];
			out[0] = m[0] * x + m[4] * y + m[12];
			out[1] = m[1] * x + m[5] * y + m[13];
			return out
		};
		vec2.forEach = function() {
			var vec = vec2.create();
			return function(a, stride, offset, count, fn, arg) {
				var i, l;
				if (!stride) {
					stride = 2
				}
				if (!offset) {
					offset = 0
				}
				if (count) {
					l = Math.min(count * stride + offset, a.length)
				} else {
					l = a.length
				}
				for (i = offset; i < l; i += stride) {
					vec[0] = a[i];
					vec[1] = a[i + 1];
					fn(vec, vec, arg);
					a[i] = vec[0];
					a[i + 1] = vec[1]
				}
				return a
			}
		}();
		vec2.str = function(a) {
			return "vec2(" + a[0] + ", " + a[1] + ")"
		};
		if (typeof exports !== "undefined") {
			exports.vec2 = vec2
		}
		var vec3 = {};
		vec3.create = function() {
			var out = new GLMAT_ARRAY_TYPE(3);
			out[0] = 0;
			out[1] = 0;
			out[2] = 0;
			return out
		};
		vec3.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(3);
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			return out
		};
		vec3.fromValues = function(x, y, z) {
			var out = new GLMAT_ARRAY_TYPE(3);
			out[0] = x;
			out[1] = y;
			out[2] = z;
			return out
		};
		vec3.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			return out
		};
		vec3.set = function(out, x, y, z) {
			out[0] = x;
			out[1] = y;
			out[2] = z;
			return out
		};
		vec3.add = function(out, a, b) {
			out[0] = a[0] + b[0];
			out[1] = a[1] + b[1];
			out[2] = a[2] + b[2];
			return out
		};
		vec3.subtract = function(out, a, b) {
			out[0] = a[0] - b[0];
			out[1] = a[1] - b[1];
			out[2] = a[2] - b[2];
			return out
		};
		vec3.sub = vec3.subtract;
		vec3.multiply = function(out, a, b) {
			out[0] = a[0] * b[0];
			out[1] = a[1] * b[1];
			out[2] = a[2] * b[2];
			return out
		};
		vec3.mul = vec3.multiply;
		vec3.divide = function(out, a, b) {
			out[0] = a[0] / b[0];
			out[1] = a[1] / b[1];
			out[2] = a[2] / b[2];
			return out;
		};
		vec3.div = vec3.divide;
		vec3.min = function(out, a, b) {
			out[0] = Math.min(a[0], b[0]);
			out[1] = Math.min(a[1], b[1]);
			out[2] = Math.min(a[2], b[2]);
			return out;
		};
		vec3.max = function(out, a, b) {
			out[0] = Math.max(a[0], b[0]);
			out[1] = Math.max(a[1], b[1]);
			out[2] = Math.max(a[2], b[2]);
			return out;
		};
		vec3.scale = function(out, a, b) {
			out[0] = a[0] * b;
			out[1] = a[1] * b;
			out[2] = a[2] * b;
			return out;
		};
		vec3.scaleAndAdd = function(out, a, b, scale) {
			out[0] = a[0] + b[0] * scale;
			out[1] = a[1] + b[1] * scale;
			out[2] = a[2] + b[2] * scale;
			return out;
		};
		vec3.distance = function(a, b) {
			var x = b[0] - a[0],
				y = b[1] - a[1],
				z = b[2] - a[2];
			return Math.sqrt(x * x + y * y + z * z);
		};
		vec3.dist = vec3.distance;
		vec3.squaredDistance = function(a, b) {
			var x = b[0] - a[0],
				y = b[1] - a[1],
				z = b[2] - a[2];
			return x * x + y * y + z * z;
		};
		vec3.sqrDist = vec3.squaredDistance;
		vec3.length = function(a) {
			var x = a[0],
				y = a[1],
				z = a[2];
			return Math.sqrt(x * x + y * y + z * z);
		};
		vec3.len = vec3.length;
		vec3.squaredLength = function(a) {
			var x = a[0],
				y = a[1],
				z = a[2];
			return x * x + y * y + z * z;
		};
		vec3.sqrLen = vec3.squaredLength;
		vec3.negate = function(out, a) {
			out[0] = -a[0];
			out[1] = -a[1];
			out[2] = -a[2];
			return out;
		};
		vec3.inverse = function(out, a) {
			out[0] = 1 / a[0];
			out[1] = 1 / a[1];
			out[2] = 1 / a[2];
			return out
		};
		vec3.normalize = function(out, a) {
			var x = a[0],
				y = a[1],
				z = a[2];
			var len = x * x + y * y + z * z;
			if (len > 0) {
				len = 1 / Math.sqrt(len);
				out[0] = a[0] * len;
				out[1] = a[1] * len;
				out[2] = a[2] * len
			}
			return out
		};
		vec3.dot = function(a, b) {
			return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
		};
		vec3.cross = function(out, a, b) {
			var ax = a[0],
				ay = a[1],
				az = a[2],
				bx = b[0],
				by = b[1],
				bz = b[2];
			out[0] = ay * bz - az * by;
			out[1] = az * bx - ax * bz;
			out[2] = ax * by - ay * bx;
			return out
		};
		vec3.lerp = function(out, a, b, t) {
			var ax = a[0],
				ay = a[1],
				az = a[2];
			out[0] = ax + t * (b[0] - ax);
			out[1] = ay + t * (b[1] - ay);
			out[2] = az + t * (b[2] - az);
			return out
		};
		vec3.random = function(out, scale) {
			scale = scale || 1;
			var r = GLMAT_RANDOM() * 2 * Math.PI;
			var z = GLMAT_RANDOM() * 2 - 1;
			var zScale = Math.sqrt(1 - z * z) * scale;
			out[0] = Math.cos(r) * zScale;
			out[1] = Math.sin(r) * zScale;
			out[2] = z * scale;
			return out
		};
		vec3.transformMat4 = function(out, a, m) {
			var x = a[0],
				y = a[1],
				z = a[2],
				w = m[3] * x + m[7] * y + m[11] * z + m[15];
			w = w || 1;
			out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
			out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
			out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
			return out
		};
		vec3.transformMat3 = function(out, a, m) {
			var x = a[0],
				y = a[1],
				z = a[2];
			out[0] = x * m[0] + y * m[3] + z * m[6];
			out[1] = x * m[1] + y * m[4] + z * m[7];
			out[2] = x * m[2] + y * m[5] + z * m[8];
			return out
		};
		vec3.transformQuat = function(out, a, q) {
			var x = a[0],
				y = a[1],
				z = a[2],
				qx = q[0],
				qy = q[1],
				qz = q[2],
				qw = q[3],
				ix = qw * x + qy * z - qz * y,
				iy = qw * y + qz * x - qx * z,
				iz = qw * z + qx * y - qy * x,
				iw = -qx * x - qy * y - qz * z;
			out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
			return out
		};
		vec3.rotateX = function(out, a, b, c) {
			var p = [],
				r = [];
			p[0] = a[0] - b[0];
			p[1] = a[1] - b[1];
			p[2] = a[2] - b[2];
			r[0] = p[0];
			r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
			r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
			out[0] = r[0] + b[0];
			out[1] = r[1] + b[1];
			out[2] = r[2] + b[2];
			return out
		};
		vec3.rotateY = function(out, a, b, c) {
			var p = [],
				r = [];
			p[0] = a[0] - b[0];
			p[1] = a[1] - b[1];
			p[2] = a[2] - b[2];
			r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
			r[1] = p[1];
			r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
			out[0] = r[0] + b[0];
			out[1] = r[1] + b[1];
			out[2] = r[2] + b[2];
			return out
		};
		vec3.rotateZ = function(out, a, b, c) {
			var p = [],
				r = [];
			p[0] = a[0] - b[0];
			p[1] = a[1] - b[1];
			p[2] = a[2] - b[2];
			r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
			r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
			r[2] = p[2];
			out[0] = r[0] + b[0];
			out[1] = r[1] + b[1];
			out[2] = r[2] + b[2];
			return out
		};
		vec3.forEach = function() {
			var vec = vec3.create();
			return function(a, stride, offset, count, fn, arg) {
				var i, l;
				if (!stride) {
					stride = 3
				}
				if (!offset) {
					offset = 0
				}
				if (count) {
					l = Math.min(count * stride + offset, a.length)
				} else {
					l = a.length
				}
				for (i = offset; i < l; i += stride) {
					vec[0] = a[i];
					vec[1] = a[i + 1];
					vec[2] = a[i + 2];
					fn(vec, vec, arg);
					a[i] = vec[0];
					a[i + 1] = vec[1];
					a[i + 2] = vec[2]
				}
				return a
			}
		}();
		vec3.angle = function(a, b) {
			var tempA = vec3.fromValues(a[0], a[1], a[2]);
			var tempB = vec3.fromValues(b[0], b[1], b[2]);
			vec3.normalize(tempA, tempA);
			vec3.normalize(tempB, tempB);
			var cosine = vec3.dot(tempA, tempB);
			if (cosine > 1) {
				return 0
			} else {
				return Math.acos(cosine)
			}
		};
		vec3.str = function(a) {
			return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")"
		};
		if (typeof exports !== "undefined") {
			exports.vec3 = vec3
		}
		var vec4 = {};
		vec4.create = function() {
			var out = new GLMAT_ARRAY_TYPE(4);
			out[0] = 0;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			return out
		};
		vec4.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(4);
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			return out
		};
		vec4.fromValues = function(x, y, z, w) {
			var out = new GLMAT_ARRAY_TYPE(4);
			out[0] = x;
			out[1] = y;
			out[2] = z;
			out[3] = w;
			return out
		};
		vec4.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			return out
		};
		vec4.set = function(out, x, y, z, w) {
			out[0] = x;
			out[1] = y;
			out[2] = z;
			out[3] = w;
			return out
		};
		vec4.add = function(out, a, b) {
			out[0] = a[0] + b[0];
			out[1] = a[1] + b[1];
			out[2] = a[2] + b[2];
			out[3] = a[3] + b[3];
			return out
		};
		vec4.subtract = function(out, a, b) {
			out[0] = a[0] - b[0];
			out[1] = a[1] - b[1];
			out[2] = a[2] - b[2];
			out[3] = a[3] - b[3];
			return out
		};
		vec4.sub = vec4.subtract;
		vec4.multiply = function(out, a, b) {
			out[0] = a[0] * b[0];
			out[1] = a[1] * b[1];
			out[2] = a[2] * b[2];
			out[3] = a[3] * b[3];
			return out
		};
		vec4.mul = vec4.multiply;
		vec4.divide = function(out, a, b) {
			out[0] = a[0] / b[0];
			out[1] = a[1] / b[1];
			out[2] = a[2] / b[2];
			out[3] = a[3] / b[3];
			return out
		};
		vec4.div = vec4.divide;
		vec4.min = function(out, a, b) {
			out[0] = Math.min(a[0], b[0]);
			out[1] = Math.min(a[1], b[1]);
			out[2] = Math.min(a[2], b[2]);
			out[3] = Math.min(a[3], b[3]);
			return out
		};
		vec4.max = function(out, a, b) {
			out[0] = Math.max(a[0], b[0]);
			out[1] = Math.max(a[1], b[1]);
			out[2] = Math.max(a[2], b[2]);
			out[3] = Math.max(a[3], b[3]);
			return out
		};
		vec4.scale = function(out, a, b) {
			out[0] = a[0] * b;
			out[1] = a[1] * b;
			out[2] = a[2] * b;
			out[3] = a[3] * b;
			return out
		};
		vec4.scaleAndAdd = function(out, a, b, scale) {
			out[0] = a[0] + b[0] * scale;
			out[1] = a[1] + b[1] * scale;
			out[2] = a[2] + b[2] * scale;
			out[3] = a[3] + b[3] * scale;
			return out
		};
		vec4.distance = function(a, b) {
			var x = b[0] - a[0],
				y = b[1] - a[1],
				z = b[2] - a[2],
				w = b[3] - a[3];
			return Math.sqrt(x * x + y * y + z * z + w * w)
		};
		vec4.dist = vec4.distance;
		vec4.squaredDistance = function(a, b) {
			var x = b[0] - a[0],
				y = b[1] - a[1],
				z = b[2] - a[2],
				w = b[3] - a[3];
			return x * x + y * y + z * z + w * w
		};
		vec4.sqrDist = vec4.squaredDistance;
		vec4.length = function(a) {
			var x = a[0],
				y = a[1],
				z = a[2],
				w = a[3];
			return Math.sqrt(x * x + y * y + z * z + w * w)
		};
		vec4.len = vec4.length;
		vec4.squaredLength = function(a) {
			var x = a[0],
				y = a[1],
				z = a[2],
				w = a[3];
			return x * x + y * y + z * z + w * w
		};
		vec4.sqrLen = vec4.squaredLength;
		vec4.negate = function(out, a) {
			out[0] = -a[0];
			out[1] = -a[1];
			out[2] = -a[2];
			out[3] = -a[3];
			return out
		};
		vec4.inverse = function(out, a) {
			out[0] = 1 / a[0];
			out[1] = 1 / a[1];
			out[2] = 1 / a[2];
			out[3] = 1 / a[3];
			return out
		};
		vec4.normalize = function(out, a) {
			var x = a[0],
				y = a[1],
				z = a[2],
				w = a[3];
			var len = x * x + y * y + z * z + w * w;
			if (len > 0) {
				len = 1 / Math.sqrt(len);
				out[0] = a[0] * len;
				out[1] = a[1] * len;
				out[2] = a[2] * len;
				out[3] = a[3] * len
			}
			return out
		};
		vec4.dot = function(a, b) {
			return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
		};
		vec4.lerp = function(out, a, b, t) {
			var ax = a[0],
				ay = a[1],
				az = a[2],
				aw = a[3];
			out[0] = ax + t * (b[0] - ax);
			out[1] = ay + t * (b[1] - ay);
			out[2] = az + t * (b[2] - az);
			out[3] = aw + t * (b[3] - aw);
			return out
		};
		vec4.random = function(out, scale) {
			scale = scale || 1;
			out[0] = GLMAT_RANDOM();
			out[1] = GLMAT_RANDOM();
			out[2] = GLMAT_RANDOM();
			out[3] = GLMAT_RANDOM();
			vec4.normalize(out, out);
			vec4.scale(out, out, scale);
			return out
		};
		vec4.transformMat4 = function(out, a, m) {
			var x = a[0],
				y = a[1],
				z = a[2],
				w = a[3];
			out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
			out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
			out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
			out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
			return out
		};
		vec4.transformQuat = function(out, a, q) {
			var x = a[0],
				y = a[1],
				z = a[2],
				qx = q[0],
				qy = q[1],
				qz = q[2],
				qw = q[3],
				ix = qw * x + qy * z - qz * y,
				iy = qw * y + qz * x - qx * z,
				iz = qw * z + qx * y - qy * x,
				iw = -qx * x - qy * y - qz * z;
			out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
			return out
		};
		vec4.forEach = function() {
			var vec = vec4.create();
			return function(a, stride, offset, count, fn, arg) {
				var i, l;
				if (!stride) {
					stride = 4
				}
				if (!offset) {
					offset = 0
				}
				if (count) {
					l = Math.min(count * stride + offset, a.length)
				} else {
					l = a.length
				}
				for (i = offset; i < l; i += stride) {
					vec[0] = a[i];
					vec[1] = a[i + 1];
					vec[2] = a[i + 2];
					vec[3] = a[i + 3];
					fn(vec, vec, arg);
					a[i] = vec[0];
					a[i + 1] = vec[1];
					a[i + 2] = vec[2];
					a[i + 3] = vec[3]
				}
				return a
			}
		}();
		vec4.str = function(a) {
			return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")"
		};
		if (typeof exports !== "undefined") {
			exports.vec4 = vec4
		}
		var mat2 = {};
		mat2.create = function() {
			var out = new GLMAT_ARRAY_TYPE(4);
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 1;
			return out
		};
		mat2.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(4);
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			return out
		};
		mat2.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			return out
		};
		mat2.identity = function(out) {
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 1;
			return out
		};
		mat2.transpose = function(out, a) {
			if (out === a) {
				var a1 = a[1];
				out[1] = a[2];
				out[2] = a1
			} else {
				out[0] = a[0];
				out[1] = a[2];
				out[2] = a[1];
				out[3] = a[3]
			}
			return out
		};
		mat2.invert = function(out, a) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				det = a0 * a3 - a2 * a1;
			if (!det) {
				return null
			}
			det = 1 / det;
			out[0] = a3 * det;
			out[1] = -a1 * det;
			out[2] = -a2 * det;
			out[3] = a0 * det;
			return out
		};
		mat2.adjoint = function(out, a) {
			var a0 = a[0];
			out[0] = a[3];
			out[1] = -a[1];
			out[2] = -a[2];
			out[3] = a0;
			return out
		};
		mat2.determinant = function(a) {
			return a[0] * a[3] - a[2] * a[1]
		};
		mat2.multiply = function(out, a, b) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3];
			var b0 = b[0],
				b1 = b[1],
				b2 = b[2],
				b3 = b[3];
			out[0] = a0 * b0 + a2 * b1;
			out[1] = a1 * b0 + a3 * b1;
			out[2] = a0 * b2 + a2 * b3;
			out[3] = a1 * b2 + a3 * b3;
			return out
		};
		mat2.mul = mat2.multiply;
		mat2.rotate = function(out, a, rad) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				s = Math.sin(rad),
				c = Math.cos(rad);
			out[0] = a0 * c + a2 * s;
			out[1] = a1 * c + a3 * s;
			out[2] = a0 * -s + a2 * c;
			out[3] = a1 * -s + a3 * c;
			return out
		};
		mat2.scale = function(out, a, v) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				v0 = v[0],
				v1 = v[1];
			out[0] = a0 * v0;
			out[1] = a1 * v0;
			out[2] = a2 * v1;
			out[3] = a3 * v1;
			return out
		};
		mat2.str = function(a) {
			return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")"
		};
		mat2.frob = function(a) {
			return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2))
		};
		mat2.LDU = function(L, D, U, a) {
			L[2] = a[2] / a[0];
			U[0] = a[0];
			U[1] = a[1];
			U[3] = a[3] - L[2] * U[1];
			return [L, D, U]
		};
		if (typeof exports !== "undefined") {
			exports.mat2 = mat2
		}
		var mat2d = {};
		mat2d.create = function() {
			var out = new GLMAT_ARRAY_TYPE(6);
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 1;
			out[4] = 0;
			out[5] = 0;
			return out
		};
		mat2d.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(6);
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[4] = a[4];
			out[5] = a[5];
			return out
		};
		mat2d.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[4] = a[4];
			out[5] = a[5];
			return out
		};
		mat2d.identity = function(out) {
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 1;
			out[4] = 0;
			out[5] = 0;
			return out
		};
		mat2d.invert = function(out, a) {
			var aa = a[0],
				ab = a[1],
				ac = a[2],
				ad = a[3],
				atx = a[4],
				aty = a[5];
			var det = aa * ad - ab * ac;
			if (!det) {
				return null
			}
			det = 1 / det;
			out[0] = ad * det;
			out[1] = -ab * det;
			out[2] = -ac * det;
			out[3] = aa * det;
			out[4] = (ac * aty - ad * atx) * det;
			out[5] = (ab * atx - aa * aty) * det;
			return out
		};
		mat2d.determinant = function(a) {
			return a[0] * a[3] - a[1] * a[2]
		};
		mat2d.multiply = function(out, a, b) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				a4 = a[4],
				a5 = a[5],
				b0 = b[0],
				b1 = b[1],
				b2 = b[2],
				b3 = b[3],
				b4 = b[4],
				b5 = b[5];
			out[0] = a0 * b0 + a2 * b1;
			out[1] = a1 * b0 + a3 * b1;
			out[2] = a0 * b2 + a2 * b3;
			out[3] = a1 * b2 + a3 * b3;
			out[4] = a0 * b4 + a2 * b5 + a4;
			out[5] = a1 * b4 + a3 * b5 + a5;
			return out
		};
		mat2d.mul = mat2d.multiply;
		mat2d.rotate = function(out, a, rad) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				a4 = a[4],
				a5 = a[5],
				s = Math.sin(rad),
				c = Math.cos(rad);
			out[0] = a0 * c + a2 * s;
			out[1] = a1 * c + a3 * s;
			out[2] = a0 * -s + a2 * c;
			out[3] = a1 * -s + a3 * c;
			out[4] = a4;
			out[5] = a5;
			return out
		};
		mat2d.scale = function(out, a, v) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				a4 = a[4],
				a5 = a[5],
				v0 = v[0],
				v1 = v[1];
			out[0] = a0 * v0;
			out[1] = a1 * v0;
			out[2] = a2 * v1;
			out[3] = a3 * v1;
			out[4] = a4;
			out[5] = a5;
			return out
		};
		mat2d.translate = function(out, a, v) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				a4 = a[4],
				a5 = a[5],
				v0 = v[0],
				v1 = v[1];
			out[0] = a0;
			out[1] = a1;
			out[2] = a2;
			out[3] = a3;
			out[4] = a0 * v0 + a2 * v1 + a4;
			out[5] = a1 * v0 + a3 * v1 + a5;
			return out
		};
		mat2d.str = function(a) {
			return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")"
		};
		mat2d.frob = function(a) {
			return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1)
		};
		if (typeof exports !== "undefined") {
			exports.mat2d = mat2d
		}
		var mat3 = {};
		mat3.create = function() {
			var out = new GLMAT_ARRAY_TYPE(9);
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 1;
			out[5] = 0;
			out[6] = 0;
			out[7] = 0;
			out[8] = 1;
			return out
		};
		mat3.fromMat4 = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[4];
			out[4] = a[5];
			out[5] = a[6];
			out[6] = a[8];
			out[7] = a[9];
			out[8] = a[10];
			return out
		};
		mat3.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(9);
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[4] = a[4];
			out[5] = a[5];
			out[6] = a[6];
			out[7] = a[7];
			out[8] = a[8];
			return out
		};
		mat3.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[4] = a[4];
			out[5] = a[5];
			out[6] = a[6];
			out[7] = a[7];
			out[8] = a[8];
			return out
		};
		mat3.identity = function(out) {
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 1;
			out[5] = 0;
			out[6] = 0;
			out[7] = 0;
			out[8] = 1;
			return out
		};
		mat3.transpose = function(out, a) {
			if (out === a) {
				var a01 = a[1],
					a02 = a[2],
					a12 = a[5];
				out[1] = a[3];
				out[2] = a[6];
				out[3] = a01;
				out[5] = a[7];
				out[6] = a02;
				out[7] = a12
			} else {
				out[0] = a[0];
				out[1] = a[3];
				out[2] = a[6];
				out[3] = a[1];
				out[4] = a[4];
				out[5] = a[7];
				out[6] = a[2];
				out[7] = a[5];
				out[8] = a[8]
			}
			return out
		};
		mat3.invert = function(out, a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a10 = a[3],
				a11 = a[4],
				a12 = a[5],
				a20 = a[6],
				a21 = a[7],
				a22 = a[8],
				b01 = a22 * a11 - a12 * a21,
				b11 = -a22 * a10 + a12 * a20,
				b21 = a21 * a10 - a11 * a20,
				det = a00 * b01 + a01 * b11 + a02 * b21;
			if (!det) {
				return null
			}
			det = 1 / det;
			out[0] = b01 * det;
			out[1] = (-a22 * a01 + a02 * a21) * det;
			out[2] = (a12 * a01 - a02 * a11) * det;
			out[3] = b11 * det;
			out[4] = (a22 * a00 - a02 * a20) * det;
			out[5] = (-a12 * a00 + a02 * a10) * det;
			out[6] = b21 * det;
			out[7] = (-a21 * a00 + a01 * a20) * det;
			out[8] = (a11 * a00 - a01 * a10) * det;
			return out
		};
		mat3.adjoint = function(out, a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a10 = a[3],
				a11 = a[4],
				a12 = a[5],
				a20 = a[6],
				a21 = a[7],
				a22 = a[8];
			out[0] = a11 * a22 - a12 * a21;
			out[1] = a02 * a21 - a01 * a22;
			out[2] = a01 * a12 - a02 * a11;
			out[3] = a12 * a20 - a10 * a22;
			out[4] = a00 * a22 - a02 * a20;
			out[5] = a02 * a10 - a00 * a12;
			out[6] = a10 * a21 - a11 * a20;
			out[7] = a01 * a20 - a00 * a21;
			out[8] = a00 * a11 - a01 * a10;
			return out
		};
		mat3.determinant = function(a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a10 = a[3],
				a11 = a[4],
				a12 = a[5],
				a20 = a[6],
				a21 = a[7],
				a22 = a[8];
			return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20)
		};
		mat3.multiply = function(out, a, b) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a10 = a[3],
				a11 = a[4],
				a12 = a[5],
				a20 = a[6],
				a21 = a[7],
				a22 = a[8],
				b00 = b[0],
				b01 = b[1],
				b02 = b[2],
				b10 = b[3],
				b11 = b[4],
				b12 = b[5],
				b20 = b[6],
				b21 = b[7],
				b22 = b[8];
			out[0] = b00 * a00 + b01 * a10 + b02 * a20;
			out[1] = b00 * a01 + b01 * a11 + b02 * a21;
			out[2] = b00 * a02 + b01 * a12 + b02 * a22;
			out[3] = b10 * a00 + b11 * a10 + b12 * a20;
			out[4] = b10 * a01 + b11 * a11 + b12 * a21;
			out[5] = b10 * a02 + b11 * a12 + b12 * a22;
			out[6] = b20 * a00 + b21 * a10 + b22 * a20;
			out[7] = b20 * a01 + b21 * a11 + b22 * a21;
			out[8] = b20 * a02 + b21 * a12 + b22 * a22;
			return out
		};
		mat3.mul = mat3.multiply;
		mat3.translate = function(out, a, v) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a10 = a[3],
				a11 = a[4],
				a12 = a[5],
				a20 = a[6],
				a21 = a[7],
				a22 = a[8],
				x = v[0],
				y = v[1];
			out[0] = a00;
			out[1] = a01;
			out[2] = a02;
			out[3] = a10;
			out[4] = a11;
			out[5] = a12;
			out[6] = x * a00 + y * a10 + a20;
			out[7] = x * a01 + y * a11 + a21;
			out[8] = x * a02 + y * a12 + a22;
			return out
		};
		mat3.rotate = function(out, a, rad) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a10 = a[3],
				a11 = a[4],
				a12 = a[5],
				a20 = a[6],
				a21 = a[7],
				a22 = a[8],
				s = Math.sin(rad),
				c = Math.cos(rad);
			out[0] = c * a00 + s * a10;
			out[1] = c * a01 + s * a11;
			out[2] = c * a02 + s * a12;
			out[3] = c * a10 - s * a00;
			out[4] = c * a11 - s * a01;
			out[5] = c * a12 - s * a02;
			out[6] = a20;
			out[7] = a21;
			out[8] = a22;
			return out
		};
		mat3.scale = function(out, a, v) {
			var x = v[0],
				y = v[1];
			out[0] = x * a[0];
			out[1] = x * a[1];
			out[2] = x * a[2];
			out[3] = y * a[3];
			out[4] = y * a[4];
			out[5] = y * a[5];
			out[6] = a[6];
			out[7] = a[7];
			out[8] = a[8];
			return out
		};
		mat3.fromMat2d = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = 0;
			out[3] = a[2];
			out[4] = a[3];
			out[5] = 0;
			out[6] = a[4];
			out[7] = a[5];
			out[8] = 1;
			return out
		};
		mat3.fromQuat = function(out, q) {
			var x = q[0],
				y = q[1],
				z = q[2],
				w = q[3],
				x2 = x + x,
				y2 = y + y,
				z2 = z + z,
				xx = x * x2,
				yx = y * x2,
				yy = y * y2,
				zx = z * x2,
				zy = z * y2,
				zz = z * z2,
				wx = w * x2,
				wy = w * y2,
				wz = w * z2;
			out[0] = 1 - yy - zz;
			out[3] = yx - wz;
			out[6] = zx + wy;
			out[1] = yx + wz;
			out[4] = 1 - xx - zz;
			out[7] = zy - wx;
			out[2] = zx - wy;
			out[5] = zy + wx;
			out[8] = 1 - xx - yy;
			return out
		};
		mat3.normalFromMat4 = function(out, a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11],
				a30 = a[12],
				a31 = a[13],
				a32 = a[14],
				a33 = a[15],
				b00 = a00 * a11 - a01 * a10,
				b01 = a00 * a12 - a02 * a10,
				b02 = a00 * a13 - a03 * a10,
				b03 = a01 * a12 - a02 * a11,
				b04 = a01 * a13 - a03 * a11,
				b05 = a02 * a13 - a03 * a12,
				b06 = a20 * a31 - a21 * a30,
				b07 = a20 * a32 - a22 * a30,
				b08 = a20 * a33 - a23 * a30,
				b09 = a21 * a32 - a22 * a31,
				b10 = a21 * a33 - a23 * a31,
				b11 = a22 * a33 - a23 * a32,
				det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
			if (!det) {
				return null
			}
			det = 1 / det;
			out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
			out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
			out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
			out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
			out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
			out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
			out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
			out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
			out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
			return out
		};
		mat3.str = function(a) {
			return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")"
		};
		mat3.frob = function(a) {
			return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2))
		};
		if (typeof exports !== "undefined") {
			exports.mat3 = mat3
		}
		var mat4 = {};
		mat4.create = function() {
			var out = new GLMAT_ARRAY_TYPE(16);
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 0;
			out[5] = 1;
			out[6] = 0;
			out[7] = 0;
			out[8] = 0;
			out[9] = 0;
			out[10] = 1;
			out[11] = 0;
			out[12] = 0;
			out[13] = 0;
			out[14] = 0;
			out[15] = 1;
			return out
		};
		mat4.clone = function(a) {
			var out = new GLMAT_ARRAY_TYPE(16);
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[4] = a[4];
			out[5] = a[5];
			out[6] = a[6];
			out[7] = a[7];
			out[8] = a[8];
			out[9] = a[9];
			out[10] = a[10];
			out[11] = a[11];
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
			return out
		};
		mat4.copy = function(out, a) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[4] = a[4];
			out[5] = a[5];
			out[6] = a[6];
			out[7] = a[7];
			out[8] = a[8];
			out[9] = a[9];
			out[10] = a[10];
			out[11] = a[11];
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
			return out
		};
		mat4.identity = function(out) {
			out[0] = 1;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 0;
			out[5] = 1;
			out[6] = 0;
			out[7] = 0;
			out[8] = 0;
			out[9] = 0;
			out[10] = 1;
			out[11] = 0;
			out[12] = 0;
			out[13] = 0;
			out[14] = 0;
			out[15] = 1;
			return out
		};
		mat4.transpose = function(out, a) {
			if (out === a) {
				var a01 = a[1],
					a02 = a[2],
					a03 = a[3],
					a12 = a[6],
					a13 = a[7],
					a23 = a[11];
				out[1] = a[4];
				out[2] = a[8];
				out[3] = a[12];
				out[4] = a01;
				out[6] = a[9];
				out[7] = a[13];
				out[8] = a02;
				out[9] = a12;
				out[11] = a[14];
				out[12] = a03;
				out[13] = a13;
				out[14] = a23
			} else {
				out[0] = a[0];
				out[1] = a[4];
				out[2] = a[8];
				out[3] = a[12];
				out[4] = a[1];
				out[5] = a[5];
				out[6] = a[9];
				out[7] = a[13];
				out[8] = a[2];
				out[9] = a[6];
				out[10] = a[10];
				out[11] = a[14];
				out[12] = a[3];
				out[13] = a[7];
				out[14] = a[11];
				out[15] = a[15]
			}
			return out
		};
		mat4.invert = function(out, a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11],
				a30 = a[12],
				a31 = a[13],
				a32 = a[14],
				a33 = a[15],
				b00 = a00 * a11 - a01 * a10,
				b01 = a00 * a12 - a02 * a10,
				b02 = a00 * a13 - a03 * a10,
				b03 = a01 * a12 - a02 * a11,
				b04 = a01 * a13 - a03 * a11,
				b05 = a02 * a13 - a03 * a12,
				b06 = a20 * a31 - a21 * a30,
				b07 = a20 * a32 - a22 * a30,
				b08 = a20 * a33 - a23 * a30,
				b09 = a21 * a32 - a22 * a31,
				b10 = a21 * a33 - a23 * a31,
				b11 = a22 * a33 - a23 * a32,
				det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
			if (!det) {
				return null
			}
			det = 1 / det;
			out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
			out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
			out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
			out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
			out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
			out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
			out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
			out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
			out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
			out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
			out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
			out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
			out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
			out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
			out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
			out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
			return out
		};
		mat4.adjoint = function(out, a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11],
				a30 = a[12],
				a31 = a[13],
				a32 = a[14],
				a33 = a[15];
			out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
			out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
			out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
			out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
			out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
			out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
			out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
			out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
			out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
			out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
			out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
			out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
			out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
			out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
			out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
			out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
			return out
		};
		mat4.determinant = function(a) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11],
				a30 = a[12],
				a31 = a[13],
				a32 = a[14],
				a33 = a[15],
				b00 = a00 * a11 - a01 * a10,
				b01 = a00 * a12 - a02 * a10,
				b02 = a00 * a13 - a03 * a10,
				b03 = a01 * a12 - a02 * a11,
				b04 = a01 * a13 - a03 * a11,
				b05 = a02 * a13 - a03 * a12,
				b06 = a20 * a31 - a21 * a30,
				b07 = a20 * a32 - a22 * a30,
				b08 = a20 * a33 - a23 * a30,
				b09 = a21 * a32 - a22 * a31,
				b10 = a21 * a33 - a23 * a31,
				b11 = a22 * a33 - a23 * a32;
			return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
		};
		mat4.multiply = function(out, a, b) {
			var a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11],
				a30 = a[12],
				a31 = a[13],
				a32 = a[14],
				a33 = a[15];
			var b0 = b[0],
				b1 = b[1],
				b2 = b[2],
				b3 = b[3];
			out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
			out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
			out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
			out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
			b0 = b[4];
			b1 = b[5];
			b2 = b[6];
			b3 = b[7];
			out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
			out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
			out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
			out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
			b0 = b[8];
			b1 = b[9];
			b2 = b[10];
			b3 = b[11];
			out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
			out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
			out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
			out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
			b0 = b[12];
			b1 = b[13];
			b2 = b[14];
			b3 = b[15];
			out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
			out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
			out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
			out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
			return out
		};
		mat4.mul = mat4.multiply;
		mat4.translate = function(out, a, v) {
			var x = v[0],
				y = v[1],
				z = v[2],
				a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
			if (a === out) {
				out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
				out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
				out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
				out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
			} else {
				a00 = a[0];
				a01 = a[1];
				a02 = a[2];
				a03 = a[3];
				a10 = a[4];
				a11 = a[5];
				a12 = a[6];
				a13 = a[7];
				a20 = a[8];
				a21 = a[9];
				a22 = a[10];
				a23 = a[11];
				out[0] = a00;
				out[1] = a01;
				out[2] = a02;
				out[3] = a03;
				out[4] = a10;
				out[5] = a11;
				out[6] = a12;
				out[7] = a13;
				out[8] = a20;
				out[9] = a21;
				out[10] = a22;
				out[11] = a23;
				out[12] = a00 * x + a10 * y + a20 * z + a[12];
				out[13] = a01 * x + a11 * y + a21 * z + a[13];
				out[14] = a02 * x + a12 * y + a22 * z + a[14];
				out[15] = a03 * x + a13 * y + a23 * z + a[15]
			}
			return out
		};
		mat4.scale = function(out, a, v) {
			var x = v[0],
				y = v[1],
				z = v[2];
			out[0] = a[0] * x;
			out[1] = a[1] * x;
			out[2] = a[2] * x;
			out[3] = a[3] * x;
			out[4] = a[4] * y;
			out[5] = a[5] * y;
			out[6] = a[6] * y;
			out[7] = a[7] * y;
			out[8] = a[8] * z;
			out[9] = a[9] * z;
			out[10] = a[10] * z;
			out[11] = a[11] * z;
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
			return out
		};
		mat4.rotate = function(out, a, rad, axis) {
			var x = axis[0],
				y = axis[1],
				z = axis[2],
				len = Math.sqrt(x * x + y * y + z * z),
				s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
			if (Math.abs(len) < GLMAT_EPSILON) {
				return null
			}
			len = 1 / len;
			x *= len;
			y *= len;
			z *= len;
			s = Math.sin(rad);
			c = Math.cos(rad);
			t = 1 - c;
			a00 = a[0];
			a01 = a[1];
			a02 = a[2];
			a03 = a[3];
			a10 = a[4];
			a11 = a[5];
			a12 = a[6];
			a13 = a[7];
			a20 = a[8];
			a21 = a[9];
			a22 = a[10];
			a23 = a[11];
			b00 = x * x * t + c;
			b01 = y * x * t + z * s;
			b02 = z * x * t - y * s;
			b10 = x * y * t - z * s;
			b11 = y * y * t + c;
			b12 = z * y * t + x * s;
			b20 = x * z * t + y * s;
			b21 = y * z * t - x * s;
			b22 = z * z * t + c;
			out[0] = a00 * b00 + a10 * b01 + a20 * b02;
			out[1] = a01 * b00 + a11 * b01 + a21 * b02;
			out[2] = a02 * b00 + a12 * b01 + a22 * b02;
			out[3] = a03 * b00 + a13 * b01 + a23 * b02;
			out[4] = a00 * b10 + a10 * b11 + a20 * b12;
			out[5] = a01 * b10 + a11 * b11 + a21 * b12;
			out[6] = a02 * b10 + a12 * b11 + a22 * b12;
			out[7] = a03 * b10 + a13 * b11 + a23 * b12;
			out[8] = a00 * b20 + a10 * b21 + a20 * b22;
			out[9] = a01 * b20 + a11 * b21 + a21 * b22;
			out[10] = a02 * b20 + a12 * b21 + a22 * b22;
			out[11] = a03 * b20 + a13 * b21 + a23 * b22;
			if (a !== out) {
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15]
			}
			return out
		};
		mat4.rotateX = function(out, a, rad) {
			var s = Math.sin(rad),
				c = Math.cos(rad),
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11];
			if (a !== out) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15]
			}
			out[4] = a10 * c + a20 * s;
			out[5] = a11 * c + a21 * s;
			out[6] = a12 * c + a22 * s;
			out[7] = a13 * c + a23 * s;
			out[8] = a20 * c - a10 * s;
			out[9] = a21 * c - a11 * s;
			out[10] = a22 * c - a12 * s;
			out[11] = a23 * c - a13 * s;
			return out
		};
		mat4.rotateY = function(out, a, rad) {
			var s = Math.sin(rad),
				c = Math.cos(rad),
				a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a20 = a[8],
				a21 = a[9],
				a22 = a[10],
				a23 = a[11];
			if (a !== out) {
				out[4] = a[4];
				out[5] = a[5];
				out[6] = a[6];
				out[7] = a[7];
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15]
			}
			out[0] = a00 * c - a20 * s;
			out[1] = a01 * c - a21 * s;
			out[2] = a02 * c - a22 * s;
			out[3] = a03 * c - a23 * s;
			out[8] = a00 * s + a20 * c;
			out[9] = a01 * s + a21 * c;
			out[10] = a02 * s + a22 * c;
			out[11] = a03 * s + a23 * c;
			return out
		};
		mat4.rotateZ = function(out, a, rad) {
			var s = Math.sin(rad),
				c = Math.cos(rad),
				a00 = a[0],
				a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a10 = a[4],
				a11 = a[5],
				a12 = a[6],
				a13 = a[7];
			if (a !== out) {
				out[8] = a[8];
				out[9] = a[9];
				out[10] = a[10];
				out[11] = a[11];
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15]
			}
			out[0] = a00 * c + a10 * s;
			out[1] = a01 * c + a11 * s;
			out[2] = a02 * c + a12 * s;
			out[3] = a03 * c + a13 * s;
			out[4] = a10 * c - a00 * s;
			out[5] = a11 * c - a01 * s;
			out[6] = a12 * c - a02 * s;
			out[7] = a13 * c - a03 * s;
			return out
		};
		mat4.fromRotationTranslation = function(out, q, v) {
			var x = q[0],
				y = q[1],
				z = q[2],
				w = q[3],
				x2 = x + x,
				y2 = y + y,
				z2 = z + z,
				xx = x * x2,
				xy = x * y2,
				xz = x * z2,
				yy = y * y2,
				yz = y * z2,
				zz = z * z2,
				wx = w * x2,
				wy = w * y2,
				wz = w * z2;
			out[0] = 1 - (yy + zz);
			out[1] = xy + wz;
			out[2] = xz - wy;
			out[3] = 0;
			out[4] = xy - wz;
			out[5] = 1 - (xx + zz);
			out[6] = yz + wx;
			out[7] = 0;
			out[8] = xz + wy;
			out[9] = yz - wx;
			out[10] = 1 - (xx + yy);
			out[11] = 0;
			out[12] = v[0];
			out[13] = v[1];
			out[14] = v[2];
			out[15] = 1;
			return out
		};
		mat4.fromQuat = function(out, q) {
			var x = q[0],
				y = q[1],
				z = q[2],
				w = q[3],
				x2 = x + x,
				y2 = y + y,
				z2 = z + z,
				xx = x * x2,
				yx = y * x2,
				yy = y * y2,
				zx = z * x2,
				zy = z * y2,
				zz = z * z2,
				wx = w * x2,
				wy = w * y2,
				wz = w * z2;
			out[0] = 1 - yy - zz;
			out[1] = yx + wz;
			out[2] = zx - wy;
			out[3] = 0;
			out[4] = yx - wz;
			out[5] = 1 - xx - zz;
			out[6] = zy + wx;
			out[7] = 0;
			out[8] = zx + wy;
			out[9] = zy - wx;
			out[10] = 1 - xx - yy;
			out[11] = 0;
			out[12] = 0;
			out[13] = 0;
			out[14] = 0;
			out[15] = 1;
			return out
		};
		mat4.frustum = function(out, left, right, bottom, top, near, far) {
			var rl = 1 / (right - left),
				tb = 1 / (top - bottom),
				nf = 1 / (near - far);
			out[0] = near * 2 * rl;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 0;
			out[5] = near * 2 * tb;
			out[6] = 0;
			out[7] = 0;
			out[8] = (right + left) * rl;
			out[9] = (top + bottom) * tb;
			out[10] = (far + near) * nf;
			out[11] = -1;
			out[12] = 0;
			out[13] = 0;
			out[14] = far * near * 2 * nf;
			out[15] = 0;
			return out
		};
		mat4.perspective = function(out, fovy, aspect, near, far) {
			var f = 1 / Math.tan(fovy / 2),
				nf = 1 / (near - far);
			out[0] = f / aspect;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 0;
			out[5] = f;
			out[6] = 0;
			out[7] = 0;
			out[8] = 0;
			out[9] = 0;
			out[10] = (far + near) * nf;
			out[11] = -1;
			out[12] = 0;
			out[13] = 0;
			out[14] = 2 * far * near * nf;
			out[15] = 0;
			return out
		};
		mat4.ortho = function(out, left, right, bottom, top, near, far) {
			var lr = 1 / (left - right),
				bt = 1 / (bottom - top),
				nf = 1 / (near - far);
			out[0] = -2 * lr;
			out[1] = 0;
			out[2] = 0;
			out[3] = 0;
			out[4] = 0;
			out[5] = -2 * bt;
			out[6] = 0;
			out[7] = 0;
			out[8] = 0;
			out[9] = 0;
			out[10] = 2 * nf;
			out[11] = 0;
			out[12] = (left + right) * lr;
			out[13] = (top + bottom) * bt;
			out[14] = (far + near) * nf;
			out[15] = 1;
			return out
		};
		mat4.lookAt = function(out, eye, center, up) {
			var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0],
				eyey = eye[1],
				eyez = eye[2],
				upx = up[0],
				upy = up[1],
				upz = up[2],
				centerx = center[0],
				centery = center[1],
				centerz = center[2];
			if (Math.abs(eyex - centerx) < GLMAT_EPSILON && Math.abs(eyey - centery) < GLMAT_EPSILON && Math.abs(eyez - centerz) < GLMAT_EPSILON) {
				return mat4.identity(out)
			}
			z0 = eyex - centerx;
			z1 = eyey - centery;
			z2 = eyez - centerz;
			len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
			z0 *= len;
			z1 *= len;
			z2 *= len;
			x0 = upy * z2 - upz * z1;
			x1 = upz * z0 - upx * z2;
			x2 = upx * z1 - upy * z0;
			len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
			if (!len) {
				x0 = 0;
				x1 = 0;
				x2 = 0
			} else {
				len = 1 / len;
				x0 *= len;
				x1 *= len;
				x2 *= len
			}
			y0 = z1 * x2 - z2 * x1;
			y1 = z2 * x0 - z0 * x2;
			y2 = z0 * x1 - z1 * x0;
			len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
			if (!len) {
				y0 = 0;
				y1 = 0;
				y2 = 0
			} else {
				len = 1 / len;
				y0 *= len;
				y1 *= len;
				y2 *= len
			}
			out[0] = x0;
			out[1] = y0;
			out[2] = z0;
			out[3] = 0;
			out[4] = x1;
			out[5] = y1;
			out[6] = z1;
			out[7] = 0;
			out[8] = x2;
			out[9] = y2;
			out[10] = z2;
			out[11] = 0;
			out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
			out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
			out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
			out[15] = 1;
			return out
		};
		mat4.str = function(a) {
			return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")"
		};
		mat4.frob = function(a) {
			return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2))
		};
		if (typeof exports !== "undefined") {
			exports.mat4 = mat4
		}
		var quat = {};
		quat.create = function() {
			var out = new GLMAT_ARRAY_TYPE(4);
			out[0] = 0;
			out[1] = 0;
			out[2] = 0;
			out[3] = 1;
			return out
		};
		quat.rotationTo = function() {
			var tmpvec3 = vec3.create();
			var xUnitVec3 = vec3.fromValues(1, 0, 0);
			var yUnitVec3 = vec3.fromValues(0, 1, 0);
			return function(out, a, b) {
				var dot = vec3.dot(a, b);
				if (dot < -.999999) {
					vec3.cross(tmpvec3, xUnitVec3, a);
					if (vec3.length(tmpvec3) < 1e-6) vec3.cross(tmpvec3, yUnitVec3, a);
					vec3.normalize(tmpvec3, tmpvec3);
					quat.setAxisAngle(out, tmpvec3, Math.PI);
					return out
				} else if (dot > .999999) {
					out[0] = 0;
					out[1] = 0;
					out[2] = 0;
					out[3] = 1;
					return out
				} else {
					vec3.cross(tmpvec3, a, b);
					out[0] = tmpvec3[0];
					out[1] = tmpvec3[1];
					out[2] = tmpvec3[2];
					out[3] = 1 + dot;
					return quat.normalize(out, out)
				}
			}
		}();
		quat.setAxes = function() {
			var matr = mat3.create();
			return function(out, view, right, up) {
				matr[0] = right[0];
				matr[3] = right[1];
				matr[6] = right[2];
				matr[1] = up[0];
				matr[4] = up[1];
				matr[7] = up[2];
				matr[2] = -view[0];
				matr[5] = -view[1];
				matr[8] = -view[2];
				return quat.normalize(out, quat.fromMat3(out, matr))
			}
		}();
		quat.clone = vec4.clone;
		quat.fromValues = vec4.fromValues;
		quat.copy = vec4.copy;
		quat.set = vec4.set;
		quat.identity = function(out) {
			out[0] = 0;
			out[1] = 0;
			out[2] = 0;
			out[3] = 1;
			return out
		};
		quat.setAxisAngle = function(out, axis, rad) {
			rad = rad * .5;
			var s = Math.sin(rad);
			out[0] = s * axis[0];
			out[1] = s * axis[1];
			out[2] = s * axis[2];
			out[3] = Math.cos(rad);
			return out
		};
		quat.add = vec4.add;
		quat.multiply = function(out, a, b) {
			var ax = a[0],
				ay = a[1],
				az = a[2],
				aw = a[3],
				bx = b[0],
				by = b[1],
				bz = b[2],
				bw = b[3];
			out[0] = ax * bw + aw * bx + ay * bz - az * by;
			out[1] = ay * bw + aw * by + az * bx - ax * bz;
			out[2] = az * bw + aw * bz + ax * by - ay * bx;
			out[3] = aw * bw - ax * bx - ay * by - az * bz;
			return out
		};
		quat.mul = quat.multiply;
		quat.scale = vec4.scale;
		quat.rotateX = function(out, a, rad) {
			rad *= .5;
			var ax = a[0],
				ay = a[1],
				az = a[2],
				aw = a[3],
				bx = Math.sin(rad),
				bw = Math.cos(rad);
			out[0] = ax * bw + aw * bx;
			out[1] = ay * bw + az * bx;
			out[2] = az * bw - ay * bx;
			out[3] = aw * bw - ax * bx;
			return out
		};
		quat.rotateY = function(out, a, rad) {
			rad *= .5;
			var ax = a[0],
				ay = a[1],
				az = a[2],
				aw = a[3],
				by = Math.sin(rad),
				bw = Math.cos(rad);
			out[0] = ax * bw - az * by;
			out[1] = ay * bw + aw * by;
			out[2] = az * bw + ax * by;
			out[3] = aw * bw - ay * by;
			return out
		};
		quat.rotateZ = function(out, a, rad) {
			rad *= .5;
			var ax = a[0],
				ay = a[1],
				az = a[2],
				aw = a[3],
				bz = Math.sin(rad),
				bw = Math.cos(rad);
			out[0] = ax * bw + ay * bz;
			out[1] = ay * bw - ax * bz;
			out[2] = az * bw + aw * bz;
			out[3] = aw * bw - az * bz;
			return out
		};
		quat.calculateW = function(out, a) {
			var x = a[0],
				y = a[1],
				z = a[2];
			out[0] = x;
			out[1] = y;
			out[2] = z;
			out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
			return out
		};
		quat.dot = vec4.dot;
		quat.lerp = vec4.lerp;
		quat.slerp = function(out, a, b, t) {
			var ax = a[0],
				ay = a[1],
				az = a[2],
				aw = a[3],
				bx = b[0],
				by = b[1],
				bz = b[2],
				bw = b[3];
			var omega, cosom, sinom, scale0, scale1;
			cosom = ax * bx + ay * by + az * bz + aw * bw;
			if (cosom < 0) {
				cosom = -cosom;
				bx = -bx;
				by = -by;
				bz = -bz;
				bw = -bw
			}
			if (1 - cosom > 1e-6) {
				omega = Math.acos(cosom);
				sinom = Math.sin(omega);
				scale0 = Math.sin((1 - t) * omega) / sinom;
				scale1 = Math.sin(t * omega) / sinom
			} else {
				scale0 = 1 - t;
				scale1 = t
			}
			out[0] = scale0 * ax + scale1 * bx;
			out[1] = scale0 * ay + scale1 * by;
			out[2] = scale0 * az + scale1 * bz;
			out[3] = scale0 * aw + scale1 * bw;
			return out
		};
		quat.invert = function(out, a) {
			var a0 = a[0],
				a1 = a[1],
				a2 = a[2],
				a3 = a[3],
				dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3,
				invDot = dot ? 1 / dot : 0;
			out[0] = -a0 * invDot;
			out[1] = -a1 * invDot;
			out[2] = -a2 * invDot;
			out[3] = a3 * invDot;
			return out
		};
		quat.conjugate = function(out, a) {
			out[0] = -a[0];
			out[1] = -a[1];
			out[2] = -a[2];
			out[3] = a[3];
			return out
		};
		quat.length = vec4.length;
		quat.len = quat.length;
		quat.squaredLength = vec4.squaredLength;
		quat.sqrLen = quat.squaredLength;
		quat.normalize = vec4.normalize;
		quat.fromMat3 = function(out, m) {
			var fTrace = m[0] + m[4] + m[8];
			var fRoot;
			if (fTrace > 0) {
				fRoot = Math.sqrt(fTrace + 1);
				out[3] = .5 * fRoot;
				fRoot = .5 / fRoot;
				out[0] = (m[5] - m[7]) * fRoot;
				out[1] = (m[6] - m[2]) * fRoot;
				out[2] = (m[1] - m[3]) * fRoot
			} else {
				var i = 0;
				if (m[4] > m[0]) i = 1;
				if (m[8] > m[i * 3 + i]) i = 2;
				var j = (i + 1) % 3;
				var k = (i + 2) % 3;
				fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
				out[i] = .5 * fRoot;
				fRoot = .5 / fRoot;
				out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
				out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
				out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot
			}
			return out
		};
		quat.str = function(a) {
			return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")"
		};
		if (typeof exports !== "undefined") {
			exports.quat = quat
		}
	})(shim.exports)
})(this);

function E() {
	E = function() {}, D.Symbol || (D.Symbol = F)
}

function H() {
	E();
	var a = D.Symbol.iterator;
	a || (a = D.Symbol.iterator = D.Symbol(_[4])), _[0] != typeof Array.prototype[a] && p(Array.prototype, a, {
		configurable: !0,
		writable: !0,
		value: function() {
			return I(this)
		}
	}), H = function() {}
}

function I(a) {
	var b = 0;
	return J(function() {
		return b < a.length ? {
			done: !1,
			value: a[b++]
		} : {
			done: !0
		}
	})
}

function J(a) {
	return H(), a = {
		next: a
	}, a[D.Symbol.iterator] = function() {
		return this
	}, a
}
var K, _ = ["function", "undefined", "jscomp_symbol_", "", "iterator", "performance", "now", "string", "number", "object", "ms", "moz", "webkit", "o", "RequestAnimationFrame", "CancelAnimationFrame", "CancelRequestAnimationFrame", ".resize-triggers { ", "visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: ' '; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }", "head", "style", "text/css", "px", "animationstart", "Webkit", "Moz", "O", "webkitAnimationStart", "oAnimationStart", "MSAnimationStart", "fakeelement", "AnimationName", "-", "resizeanim", "@", "keyframes ", " { from { opacity: 0; } to { opacity: 0; } } ", "animation: 1ms ", "; ", "onresize", "static", "relative", "div", "resize-triggers", "<div class='expand-trigger'><div></div></div><div class='contract-trigger'></div>", "scroll", "Loading ", "%E5%8A%A0%E8%BD%BD%E4%B8%AD...", "%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E4%B8%AD%E2%80%A6", "loading error", "%E8%B5%84%E6%BA%90%E5%8A%A0%E8%BD%BD%E9%94%99%E8%AF%AF!", "%E3%83%AD%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E5%A4%B1%E6%95%97", "Normal View", "%E6%AD%A3%E5%B8%B8%E8%A7%86%E8%A7%92", "%E3%83%8E%E3%83%BC%E3%83%9E%E3%83%AB%E3%83%93%E3%83%A5%E3%83%BC", "Little Planet View", "%E5%B0%8F%E8%A1%8C%E6%98%9F%E8%A7%86%E8%A7%92", "%E6%83%91%E6%98%9F%E3%83%91%E3%83%8E%E3%83%A9%E3%83%9E%E3%83%93%E3%83%A5%E3%83%BC", "Fullscreen", "%E5%85%A8%E5%B1%8F", "%E5%85%A8%E7%94%BB%E9%9D%A2ON", "Exit Fullscreen", "%E9%80%80%E5%87%BA%E5%85%A8%E5%B1%8F", "%E5%85%A8%E7%94%BB%E9%9D%A2OFF", "video360", "fisheye", "littleplanet", "Sphere", "crystallball", "video2d", "Flat", "image/jpeg", "crossorigin", "anonymous", "2d", "image/png", "none", "WalkThrough", "Image", "Video", "immersive-vr", "XFov", "Auto", "sceneId", "sceneName", "myScene", "sceneTop", "sceneLeft", "sceneLng", "sceneLat", "sceneWidth", "sceneHeight", "sceneFileType", "sceneType", "sceneFilePath", "sence", "sceneModel", "sceneFormat", "videoType", "sceneSpeed", "sceneBlockModel", "isVideoAutoPlay", "isAutoRotate", "isVideoLoop", "minPan", "initPan", "maxPan", "minTilt", "initTilt", "maxTilt", "initFov", "minFov", "maxPixelZoom", "maxFov", "fovType", "curFov", "curTilt", "curPan", "curRoll", "cameraAt", "isLittlePlanetEffect", "renderType", "isMirror", "isBestFit", "rotationY", ".m3u8", "iphone", "ipod", "ipad", "Canvas", "h", "ame", "109509711211246110101116", "9711410111097991081111171004699111109", "is360pano", "Pyramid", "Cube", "2D", "LR3D", "UD3D", "file:", "_", "192.168.50.68", "10.124.124.103", "218.1.109.58", "123.234.129.71", "120.87.10.21", "222.198.115.66", "192.168.0.110", "192.168.0.170", "192.168.1.176", "123.234.129.80", "153.35.93.128", "container", "name", "UTPlayer", "width", "height", "zIndex", "loadingImg", "isMouseWheel", "isDBClick", "isDBViewPort", "DBViewIPD", "CRType", "CRImage", "initSceneId", "isGyro", "closeTransition", "isDragAble", "dragStarMode", "mdown", "dragMode", "dragDirectionMode", "webGLDeepBuffer", "scenesArr", "isBlackWebGL", "fullScreenDom", "initOverCallBack", "loadedStartCallBack", "loadedCallBack", "drawWebGLCallBack", "errorCallBack", "sceneResizeCallBack", "scenePanTiltFovChangerCallBack", "sceneEventMoveCallBack", "sceneEventUpCallBack", "sceneEventClickCallBack", "sceneEventDownCallBack", "fullScreenChangeCallBack", "videoLoadProgressCallBack", "videoLoadStartCallBack", "videoPlayerCallBack", "videoCanPlayerCallBack", "videoUpdateCallBack", "videoLoadMetaDataCallBack", "videoTogglePlayCallBack", "setVideoCurTimeCallBack", "videoPlayEndCallBack", "X5VideoExitFullscreen", "X5VideoEnterFullscreen", "vrStartCallBack", "vrDrawCallBack", "scenePlayDom", "absolute", "hidden", "100%", "black", "0px", "UserSelect", "TouchAction", "ContentZooming", "cubeDom", "0.0.0", ".", "android", "13.0.0", "debug=true", "50%", "rgb(255, 255, 255)", "14px", "-50%", "rgb(0, 0, 0) 1px 1px 2px", "center", "block", "ver: ", " w： ", "h： ", " ua: ", "30%", "24px", "-25px", "110%", "280px", "-105px", "-140px", "white", "10px", "20px", "gray", "AppleWebKit/533", "WnGjwbEXli9G1E5VMCMNf1lVCZsR5AFEHthdbMSPSoxgcq7592oQC", "hos", "me", "m2a", "et", "are", "om", "s3tc", "etc1", "pvrtc", "webgl", "experimental-webgl", "moz-webgl", "webkit-3d", "\n", "Shader Error!", "aVertex", "aTexture", "aTextureScaleX", "aTextureScaleY", "aTextureOffsetX", "aTextureOffsetY", "uMMatrix", "uPMatrix", "fAlpha", "isBGRFormat", "old_", "ho", "m2", "ar", "attribute vec3 aVertex; ", "attribute vec2 aTexture; ", "uniform mat4 uMMatrix; ", "uniform mat4 uPMatrix; ", "varying vec2 vTexture; ", "void main(){ ", "   gl_Position = uPMatrix * uMMatrix * vec4(aVertex,1.0); ", "   vTexture = aTexture; ", "}", "iVBORw0KGgoAAAANSUhEUgAAAKoAAABOCAMAAACHfX0kAAAAOVBMVEX", "1AAAAE3RSTlNACC81BgQeAAIBDBY+KiQROjIckTOrrgAABEZJREFUeF7szjENAAAMArB98+8YFRwkrYLez1BVLVFVVVVVVVVVVQ1v5rblOApD0QgLLAHYjv", "#ifdef GL_ES", "#ifdef GL_FRAGMENT_PRECISION_HIGH", "precision highp float;", "#else", "precision mediump float;", "#endif", "uniform float fAlpha;", "uniform int isBGRFormat;", "uniform float isMirror;", "uniform float is360pano;", "uniform float aTextureScaleX;", "uniform float aTextureScaleY;", "uniform float aTextureOffsetX;", "uniform float aTextureOffsetY;", "uniform sampler2D uSampler;", "varying vec2 vTexture;", "void main(){", "   vec2 tScale = vec2(aTextureScaleX,aTextureScaleY);", "   vec2 tOffset = vec2(aTextureOffsetX,aTextureOffsetY);", "   float s=vTexture.x;", "   float t=vTexture.y;", "   if(is360pano == 0.0)", "   {", "       if(s<=0.5)", "       {", "           s=s*2.0;", "       }", "       else", "           if(isMirror == 0.0)", "           {", "               s=10.0;", "           }", "           else", "               s=2.0-s*2.0;;", "   }", "   if(s > 2.0)", "       vec4 c=vec4(0.0,0.0,0.0,1.0);", "       gl_FragColor=bool(isBGRFormat) ? vec4(c.bgr,c.a*fAlpha) : vec4(c.rgb,c.a*fAlpha);", "   else", "       vec2 aText = vec2(s,t);", "       vec2 cTexture = (aText.xy * tScale.xy) + tOffset.xy;", "       vec4 c=texture2D(uSampler,vec2(cTexture.s,cTexture.t),-1.0);", "    }", "9TMLW3YEFxvSKjLG57xpRGU+bfiNqXK3HdxKhtym", "bZI+vkTMsdbQb8AOStUJJdeGvE1qlyWfMWppxM+pAK7lzHSlvljsW", "aimsPtJIywjqohafAm4H7XGoMpyE2G5iE1Qj0r3o16k8YFkhSWOLlBlod+drCCpWJR2PlUXRFhWVDPUAcQ3oqaU0pazEtVSAaEOvZuWiuVFFVEd6Y2otQJmyqDVQkxYD7NYo7Aa8jXqs+JvHViSRT0lZEjETFVJ4UWmLU6UiuVFFVG1o3tRt", "dK3NUbXgPOQraCbjCi+kfmqF0+BOQMi46RPsgvFW1UHxV55VyNhWwFragi6ukDP0c9lFeA3R4xsuqPikT6+QFIGU4tK9kKOlFF1NqN4RzVHtVLOWxGJ+1w2ZrR3WOrUNXWpQPJGctSRFSAZJPEHFUsfNtzyOcJbV3tiy5dT8lKLXzbiNrsKXCKyrGkS0IP0wlIL4lYleRbubGIinAY0zlqfLVgmemYI+Jv+6BicbU9ombcjLBmqLFkOzkTDIvKee", "video", "webkit-playsinline", "x5-video-player-type", "h5", "x5-video-player-fullscreen", "false", "playsinline", "preload", "metadata", "renderer", "standard", "rtmp://", ".m3u", "#EXT-X-ENDLIST", "error", "macintel", "safari", "muted", ".flv", "flv", "6NFJJ80mBCzGyDmf0b8bCAnBLBTCZBm1ugc66hTR5066tRRp446ddSpo04ddeqoU0edOupUADquG+pCzikkAAAAAElFTkSuQmCC", "8HAwPk5OTw8PAFAQEEAADAv79HcEwEAAAEAAAzMDCioKD8", "Pzd3NzR0NB8enr4+Pjp6emysbHSQ4", "Y2dlMhXdaszqbnfxBljyjsyRgDBJY9PlV5fV5KwxkbVe2Q1JV8amqOIe4ashse5mWlfKanJKigDG+m0uHqQrg1loJ6iEj09LyITLp1te5OXTRZqgEvSHtJZ55dzUSMq5PHTrx5K2XYIwQwWNSgQKFZlRnMMUFYfiGEgr4abhUbyp9myQ+ZdR4Y9QGXUMFyAmWPRANqjShrD+EOpqyB575ryr", "oZkUaUtNfPPolqUgub795o9qnkz", "ygq59q1N4TF0jhUG", "KfQRVnQ4cRdiMqvkDtlfgvojKzSuJRWK0Wo7LVoIaw3ohaM2sqpowIAIiZiL8T1qhPjXKNugDdiAqYiVVlqmVLKY2tARJxFNZSuxYVX6I+6o2o51lKeyMxZTglZMdWkTgKqxjXq0FNtdY2bHX7VdRnRDX17B3S", "SUyAMqxeWchVRiVxU70clbEJqcZywjKgCKiK0bmR1NyoTHN9n8T2zCMu0AbR61NrSYpLV", "Z0D+8kIWYUQl46hNdlbe3mVufr", "08FvrMr", "MIRhOVBGVnLDmqN+HtX", "WO36JdguSWVdFeQLVLLCmqOuFA+gvYC+ndgXjfpiLT1ckVK8FTyALlBXcsKao8Zj", "dKQWM9DOeRw", "Ly6Qvo9nnRVh7dm5a+q+9PRGO9GllhiostZVt20oDQLndM5dpaC6tMgLUvQKgPG9C2Bak+Br5Y+XfPoZ", "cCJqYHnDYCZ5sXvCzjBf", "/", "14px arial", "middle", ",", "%u4E0A%u6D77%u6770%u56FE%u8F6F%u4EF6%u6280%u672F%u6709%u9650%u516C%u53F8%u7248%u6743%u6240%u6709", "canvas", "%r", "%0r", "7niu", "x", "a", "0", "%0c", "g", "%c", "%s", "l", "1", "f", "2", "r", "3", "b", "4", "u", "5", "d", ".jpg", "M", "A", "B", "U", "YFov", "mover", "mouseover", "mousedown", "touchstart", "fullScreenChange", "pc", "keydown", "keyup", "contextmenu", "click", "mousewheel", "dblclick", "mousemove", "touchmove", "touchend", "mouseup", "mouseout", "TWP_rightTarget", "36px", "#000000", "12px", "cn", "SimSun", "Arial,Helvetica,sans-serif", "0px 0px 2px white", "3px", "pointer", "left", "rgba(255,255,255,0.85)", "1px", "4px solid #f1f1f1", "rgba(233, 232, 232,0.67)", "256px", "rgba(0, 0, 0, 0.5) 0px 0px 4px", "#dddddd 0px 0px 2px inset", "#e9e9e9", "#fafafa", "#cacaca", "40px", "#cdcdcd", "#f1f1f1", "#888787", "default", "visible", "progress", "timeupdate", "controls", "loop", "end", "local"],
	p = _[0] == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
		a != Array.prototype && a != Object.prototype && (a[b] = c.value)
	},
	D = _[1] != typeof window && window === this ? this : _[1] != typeof global && null != global ? global : this,
	F = function() {
		var a = 0;
		return function(b) {
			return _[2] + (b || _[3]) + a++
		}
	}();
! function() {
	if (!1 == _[5] in window && (window.performance = {}), Date.now = Date.now || function() {
		return (new Date)
			.getTime()
	}, !1 == _[6] in window.performance) {
		var a = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart : Date.now();
		window.performance.now = function() {
			return Date.now() - a
		}
	}
}(), K = K || function() {
		var a = [];
		return {
			getAll: function() {
				return a
			},
			ai: function() {
				a = []
			},
			add: function(b) {
				a.push(b)
			},
			remove: function(b) {
				b = a.indexOf(b), -1 !== b && a.splice(b, 1)
			},
			update: function(b) {
				if (0 === a.length) return !1;
				var c = 0;
				for (b = void 0 !== b ? b : window.performance.now(); c < a.length;) a[c].update(b) ? c++ : a.splice(c, 1);
				return !0
			}
		}
	}(), K.ia = function(a) {
		var o, b = {},
			c = {},
			d = {},
			e = 1e3,
			f = 0,
			g = !1,
			h = null,
			i = K.Y.bb.ud,
			j = K.Ab.bb,
			k = [],
			l = !1,
			m = null,
			n = null;
		for (o in a) b[o] = parseFloat(a[o], 10);
		this.la = function(a, b) {
			return void 0 !== b && (e = b), c = a, this
		}, this.start = function(e) {
			K.add(this), g = !0, l = !1, h = void 0 !== e ? e : window.performance.now(), h += 0;
			for (var f in c) {
				if (c[f] instanceof Array) {
					if (0 === c[f].length) continue;
					c[f] = [a[f]].concat(c[f])
				}
				b[f] = a[f], !1 == b[f] instanceof Array && (b[f] *= 1), d[f] = b[f] || 0
			}
			return this
		}, this.stop = function() {
			return g ? (K.remove(this), g = !1, this.yg(), this) : this
		}, this.yg = function() {
			for (var a = 0, b = k.length; b > a; a++) k[a].stop()
		}, this.repeat = function(a) {
			return f = a, this
		}, this.na = function(a) {
			return i = a, this
		}, this.ja = function(a) {
			return m = a, this
		}, this.ua = function(a) {
			return n = a, this
		}, this.update = function(g) {
			var o, p, q, r, s;
			if (h > g) return !0;
			!1 === l && (l = !0), p = (g - h) / e, p = p > 1 ? 1 : p, q = i(p);
			for (o in c) r = b[o] || 0, s = c[o], s instanceof Array ? a[o] = j(s, q) : (_[7] === typeof s && (s = r + parseFloat(s, 10)), _[8] === typeof s && (a[o] = r + (s - r) * q));
			if (null !== m && m.call(a, q), 1 === p) {
				if (!(f > 0)) {
					for (null !== n && n.call(a), g = 0, o = k.length; o > g; g++) k[g].start(h + e);
					return !1
				}
				isFinite(f) && f--;
				for (o in d) _[7] === typeof c[o] && (d[o] += parseFloat(c[o], 10)), b[o] = d[o];
				h = g + 0
			}
			return !0
		}
	}, K.Y = {
		bb: {
			ud: function(a) {
				return a
			}
		},
		ta: {
			fa: function(a) {
				return a * a
			},
			R: function(a) {
				return a * (2 - a)
			},
			ya: function(a) {
				return 1 > (a *= 2) ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
			}
		},
		vh: {
			fa: function(a) {
				return a * a * a
			},
			R: function(a) {
				return --a * a * a + 1
			},
			ya: function(a) {
				return 1 > (a *= 2) ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
			}
		},
		zh: {
			fa: function(a) {
				return a * a * a * a
			},
			R: function(a) {
				return 1 - --a * a * a * a
			},
			ya: function(a) {
				return 1 > (a *= 2) ? .5 * a * a * a * a : -.5 * ((a -= 2) * a * a * a - 2)
			}
		},
		Ah: {
			fa: function(a) {
				return a * a * a * a * a
			},
			R: function(a) {
				return --a * a * a * a * a + 1
			},
			ya: function(a) {
				return 1 > (a *= 2) ? .5 * a * a * a * a * a : .5 * ((a -= 2) * a * a * a * a + 2)
			}
		},
		Bh: {
			fa: function(a) {
				return 1 - Math.cos(a * Math.PI / 2)
			},
			R: function(a) {
				return Math.sin(a * Math.PI / 2)
			},
			ya: function(a) {
				return .5 * (1 - Math.cos(Math.PI * a))
			}
		},
		yh: {
			fa: function(a) {
				return 0 === a ? 0 : Math.pow(1024, a - 1)
			},
			R: function(a) {
				return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
			},
			ya: function(a) {
				return 0 === a ? 0 : 1 === a ? 1 : 1 > (a *= 2) ? .5 * Math.pow(1024, a - 1) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)
			}
		},
		uh: {
			fa: function(a) {
				return 1 - Math.sqrt(1 - a * a)
			},
			R: function(a) {
				return Math.sqrt(1 - --a * a)
			},
			ya: function(a) {
				return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
			}
		},
		xh: {
			fa: function(a) {
				var c, b = .1;
				return 0 === a ? 0 : 1 === a ? 1 : (!b || 1 > b ? (b = 1, c = .1) : c = .4 * Math.asin(1 / b) / (2 * Math.PI), -(b * Math.pow(2, 10 * --a) * Math.sin(2 * (a - c) * Math.PI / .4)))
			},
			R: function(a) {
				var c, b = .1;
				return 0 === a ? 0 : 1 === a ? 1 : (!b || 1 > b ? (b = 1, c = .1) : c = .4 * Math.asin(1 / b) / (2 * Math.PI), b * Math.pow(2, -10 * a) * Math.sin(2 * (a - c) * Math.PI / .4) + 1)
			},
			ya: function(a) {
				var c, b = .1;
				return 0 === a ? 0 : 1 === a ? 1 : (!b || 1 > b ? (b = 1, c = .1) : c = .4 * Math.asin(1 / b) / (2 * Math.PI), 1 > (a *= 2) ? -.5 * b * Math.pow(2, 10 * --a) * Math.sin(2 * (a - c) * Math.PI / .4) : .5 * b * Math.pow(2, -10 * --a) * Math.sin(2 * (a - c) * Math.PI / .4) + 1)
			}
		},
		sh: {
			fa: function(a) {
				return a * a * (2.70158 * a - 1.70158)
			},
			R: function(a) {
				return --a * a * (2.70158 * a + 1.70158) + 1
			},
			ya: function(a) {
				return 1 > (a *= 2) ? .5 * a * a * (3.5949095 * a - 2.5949095) : .5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
			}
		},
		vc: {
			fa: function(a) {
				return 1 - K.Y.vc.R(1 - a)
			},
			R: function(a) {
				return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
			},
			ya: function(a) {
				return .5 > a ? .5 * K.Y.vc.fa(2 * a) : .5 * K.Y.vc.R(2 * a - 1) + .5
			}
		}
	}, K.Ab = {
		bb: function(a, b) {
			var c = a.length - 1,
				d = c * b,
				e = Math.floor(d),
				f = K.Ab.Pb.bb;
			return 0 > b ? f(a[0], a[1], d) : b > 1 ? f(a[c], a[c - 1], c - d) : f(a[e], a[e + 1 > c ? c : e + 1], d - e)
		},
		th: function(a, b) {
			for (var c = 0, d = a.length - 1, e = Math.pow, f = K.Ab.Pb.Ie, g = 0; d >= g; g++) c += e(1 - b, d - g) * e(b, g) * a[g] * f(d, g);
			return c
		},
		td: function(a, b) {
			var c = a.length - 1,
				d = c * b,
				e = Math.floor(d),
				f = K.Ab.Pb.td;
			return a[0] === a[c] ? (0 > b && (e = Math.floor(d = c * (1 + b))), f(a[(e - 1 + c) % c], a[e], a[(e + 1) % c], a[(e + 2) % c], d - e)) : 0 > b ? a[0] - (f(a[0], a[0], a[1], a[1], -d) - a[0]) : b > 1 ? a[c] - (f(a[c], a[c], a[c - 1], a[c - 1], d - c) - a[c]) : f(a[e ? e - 1 : 0], a[e], a[e + 1 > c ? c : e + 1], a[e + 2 > c ? c : e + 2], d - e)
		},
		Pb: {
			bb: function(a, b, c) {
				return (b - a) * c + a
			},
			Ie: function(a, b) {
				var c = K.Ab.Pb.Ke;
				return c(a) / c(b) / c(a - b)
			},
			Ke: function() {
				var a = [1];
				return function(b) {
					var d, c = 1;
					if (a[b]) return a[b];
					for (d = b; d > 1; d--) c *= d;
					return a[b] = c
				}
			}(),
			td: function(a, b, c, d, e) {
				a = .5 * (c - a), d = .5 * (d - b);
				var f = e * e;
				return (2 * b - 2 * c + a + d) * e * f + (-3 * b + 3 * c - 2 * a - d) * f + a * e + b
			}
		}
	},
	function(a) {
		_[0] === typeof define && define.Ch ? define([], function() {
			return K
		}) : _[9] === typeof exports ? module.exports = K : a.zd = K
	}(this),
	function() {}.bind || (Function.prototype.bind = function(a) {
		var b = this,
			c = Array.prototype.slice.call(arguments);
		return function() {
			return b.apply(a, c.slice(1))
		}
	}),
	function() {
		for (var a = 0, b = [_[10], _[11], _[12], _[13]], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + _[14]], window.cancelAnimationFrame = window[b[c] + _[15]] || window[b[c] + _[16]];
		window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
			var c = (new Date)
				.getTime(),
				d = Math.max(0, 16 - (c - a)),
				e = window.setTimeout(function() {
					b(c + d)
				}, d);
			return a = c + d, e
		}), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
			clearTimeout(a)
		})
	}(),
	function() {
		function a() {
			if (!c) {
				var a = (o ? o : _[3]) + _[17] + (p ? p : _[3]) + _[18],
					b = document.head || document.getElementsByTagName(_[19])[0],
					d = document.createElement(_[20]);
				d.type = _[21], d.styleSheet ? d.styleSheet.cssText = a : d.appendChild(document.createTextNode(a)), b.appendChild(d), c = !0
			}
		}
		var d, e, f, g, h, i, j, k, l, m, n, o, p, b = document.attachEvent,
			c = !1;
		if (!b) {
			if (d = function() {
				var a = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(a) {
					return window.setTimeout(a, 20)
				};
				return function(b) {
					return a(b)
				}
			}(), e = function() {
				var a = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
				return function(b) {
					return a(b)
				}
			}(), f = function(a) {
				var c, b = a.Qa;
				a = b.firstElementChild, b = b.lastElementChild, c = a.firstElementChild, b.scrollLeft = b.scrollWidth, b.scrollTop = b.scrollHeight, c.style.width = a.offsetWidth + 1 + _[22], c.style.height = a.offsetHeight + 1 + _[22], a.scrollLeft = a.scrollWidth, a.scrollTop = a.scrollHeight
			}, g = function(a) {
				var b = this;
				f(this), this.xd && e(this.xd), this.xd = d(function() {
					(b.offsetWidth != b.Qb.width || b.offsetHeight != b.Qb.height) && (b.Qb.width = b.offsetWidth, b.Qb.height = b.offsetHeight, b.Bb.forEach(function(c) {
						c.call(b, a)
					}))
				})
			}, h = !1, i = _[3], j = _[23], k = [_[24], _[25], _[26], _[10]], l = [_[27], _[23], _[28], _[29]], m = _[3], m = document.createElement(_[30]), void 0 !== m.style.animationName && (h = !0), !1 === h)
				for (h = 0; h < k.length; h++)
					if (void 0 !== m.style[k[h] + _[31]]) {
						m = k[h], i = _[32] + m.toLowerCase() + _[32], j = l[h], h = !0;
						break
					} n = _[33], o = _[34] + i + _[35] + n + _[36], p = i + _[37] + n + _[38]
		}
		window.Cb = function(c, d) {
			b ? c.attachEvent(_[39], d) : (c.Qa || (_[40] == getComputedStyle(c)
				.position && (c.style.position = _[41]), a(), c.Qb = {}, c.Bb = [], (c.Qa = document.createElement(_[42]))
				.className = _[43], c.Qa.innerHTML = _[44], c.appendChild(c.Qa), f(c), c.addEventListener(_[45], g, !0), j && c.Qa.addEventListener(j, function(a) {
					a.animationName == n && f(c)
				})), c.Bb.push(d))
		}, window.Fh = function(a, c) {
			b ? a.detachEvent(_[39], c) : (a.Bb.splice(a.Bb.indexOf(c), 1), a.Bb.length || (a.removeEventListener(_[45], g), a.Qa = !a.removeChild(a.Qa)))
		}
	}(),
	function() {
		function a() {}

		function b(a, b, c) {
			return _[1] == typeof a[b] ? c : a[b]
		}
		var i, j, k, c = {
				en: _[46],
				cn: _[47],
				jp: _[48]
			},
			d = {
				en: _[49],
				cn: _[50],
				jp: _[51]
			},
			e = {
				en: _[52],
				cn: _[53],
				jp: _[54]
			},
			f = {
				en: _[55],
				cn: _[56],
				jp: _[57]
			},
			g = {
				en: _[58],
				cn: _[59],
				jp: _[60]
			},
			h = {
				en: _[61],
				cn: _[62],
				jp: _[63]
			};
		a.Cb = function(a) {
			function b() {
				_[0] === typeof this.Md && this.Md.apply(this, arguments)
			}
			return b.prototype = a, b.constructor = b, b.prototype.api_dispose = function() {
				this.Zc(), this.bg(this.ba), this.aa && (this.aa.destroy(), this.aa = null)
			}, b.prototype.api_getRoll = function() {
				return this.Af
			}, b.prototype.api_changeFLength = function(a) {
				if (a *= 1, a > 100 && (a = 100), 0 > a && (a = 0), 30 > a) {
					this.lc(0);
					var b = (30 - this.Ka) / 30;
					this.eb(this.Ka + b * (30 - a))
				} else 70 > a ? this.lc(-.02 * (a - 30)) : (b = (150 - this.Ka) / 30, this.lc(-.8 + (-.9 + .8) / 30 * (a - 70)), this.Sa(-3 * (a - 70)), this.eb(this.Ka + b * (a - 70)));
				this.Ga(), 30 == a ? this.l.Ca = _[64] : 55 == a ? this.l.Ca = _[65] : 100 == a && (this.l.Ca = _[66])
			}, b.prototype.api_getRenderType = function() {
				var a = _[3];
				return this.l && (a = this.l.Ca), a
			}, b.prototype.api_changeRenderType = function(a) {
				_[65] === a ? (this.l && _[67] != this.l.A && this.api_setCurSceneModel(_[67]), this.api_fishEyeView()) : _[66] === a ? (this.l && _[67] != this.l.A && this.api_setCurSceneModel(_[67]), this.api_littlePlanet()) : _[68] === a ? (this.l && _[67] != this.l.A && this.api_setCurSceneModel(_[67]), this.api_crystallBallView()) : _[64] === a ? (this.l && _[67] != this.l.A && this.api_setCurSceneModel(_[67]), this.api_normalView()) : _[69] === a && this.l && this.api_setCurSceneModel(_[70])
			}, b.prototype.api_screenShot = function() {
				return this.preserveDrawingBuffer ? this.Fa.toDataURL(_[71], 1) : _[3]
			}, b.prototype.api_readPixels = function(a, b, c, d) {
				var e = new Uint8Array(4 * c * d);
				return this.a.readPixels(a, b, c, d, this.a.RGBA, this.a.UNSIGNED_BYTE, e), e
			}, b.prototype.api_getVideoFrame = function(a) {
				var c, d, b = this.api_getVideoDom();
				return a && this.api_setVideoCurTime(a), b ? (a = b.videoWidth || 1920, c = b.videoHeight || 960, d = JTUtil.cDom(this.u([99, 97, 110, 118, 97, 115])), d.width = a, d.height = c, d.setAttribute(_[72], _[73]), d.getContext(_[74])
					.drawImage(b, 0, 0, d.width, d.height), d.toDataURL(_[75], 1)) : null
			}, b.prototype.api_stopAll = function() {
				this.V()
			}, b.prototype.api_autoPlay = function() {
				this.V(), this.If && this.api_right()
			}, b.prototype.api_reset = function() {
				this.V();
				var a = this.Nc,
					b = this.Ka;
				this.v = parseInt(this.kb), this.C = parseInt(a), this.o = parseInt(b), this.nc()
			}, b.prototype.api_left = function() {
				this.V(), this.oa = 37, this.O && this.api_CloseGyro()
			}, b.prototype.api_right = function() {
				this.V(), this.oa = 39, this.O && this.api_CloseGyro()
			}, b.prototype.api_up = function() {
				this.V(), this.oa = 38, this.O && this.api_CloseGyro()
			}, b.prototype.api_down = function() {
				this.V(), this.oa = 40, this.O && this.api_CloseGyro()
			}, b.prototype.api_zoomin = function() {
				this.V(), this.oa = 16, this.O && this.api_CloseGyro()
			}, b.prototype.api_zoomout = function() {
				this.V(), this.oa = 17, this.O && this.api_CloseGyro()
			}, b.prototype.api_previousScene = function() {
				this.V(), this.api_changerSceneByIndex(this.Ub - 1)
			}, b.prototype.api_nextScene = function() {
				this.V(), this.api_changerSceneByIndex(this.Ub + 1)
			}, b.prototype.api_changerSceneById = function(a, b, c, d) {
				this.V(), a = this.api_getSceneIndexById(a, b, c, d), this.api_changerSceneByIndex(a, b, c, d)
			}, b.prototype.api_changerSceneByIndex = function(a, b, c, d) {
				this.Xa = !1, this.m && this.m.pause(), this.V(), this.Cc(a, b, c, d)
			}, b.prototype.api_ToggleDragEffectMode = function() {
				return this.Va = !this.Va
			}, b.prototype.api_ToggleDragDirection = function() {
				return this.Xb = !this.Xb
			}, b.prototype.api_updateAngle = function(a) {
				this.mc(this.v + a)
			}, b.prototype.api_updateTiltAngle = function(a) {
				this.Gb(this.C + a)
			}, b.prototype.api_updatePanTiltAngle = function(a, b) {
				a = this.v + a, b = this.C + b, this.rb(a, b)
			}, b.prototype.api_setPanTiltFov = function(a, b, c) {
				this.nc(a, b, c)
			}, b.prototype.api_setPanTiltFovZ = function(a, b, c, d) {
				this.sb(a, b, c, d)
			}, b.prototype.api_setCameraAt = function(a) {
				this.lc(a)
			}, b.prototype.api_getSceneIndexById = function(a) {
				for (var b, c = 0; c < this.Da.length; c++)
					if (this.Da[c].sceneId == a) {
						b = c;
						break
					} return b
			}, b.prototype.api_getCurSceneType = function() {
				return this.l.va
			}, b.prototype.api_getCurSceneModel = function() {
				return this.l.A
			}, b.prototype.api_getCurRotationY = function() {
				return this.l.pb
			}, b.prototype.api_setCurSceneModel = function(a) {
				this.l.A = a || _[67], a = this.Ce(this.l), this.He(a, this.l)
			}, b.prototype.api_getSceneDataById = function(a) {
				return a = this.api_getSceneIndexById(a), this.api_getSceneDataByIndex(a)
			}, b.prototype.api_getSceneDataByIndex = function(a) {
				return this.Da[a] ? this.Da[a] : this.Da[this.Ub]
			}, b.prototype.api_addJsonSceneData = function(a) {
				var c, b = a.sceneId;
				return b ? (c = this.api_getSceneIndexById(b), isNaN(c) ? (this.Da.push(a), b) : b) : null
			}, b.prototype.api_delSceneById = function(a) {
				a = this.api_getSceneIndexById(a), -1 != a && this.Da.splice(a, 1)
			}, b.prototype.api_resize = function(a, b) {
				this.bd(a, b), this.Zf(), this.kc && this.kc()
			}, b.prototype.api_CloseGyro = function() {
				return j.isMobile ? (this.ma = 0, this.O = !1, this.api_setDragStatus(!0), stopGyroEffect(), this.nc(), this.O) : this.O = !1
			}, b.prototype.api_OpenGyro = function() {
				return j.isMobile ? (addGyroEffect && addGyroEffect(this), this.O = !0) : this.O = !1
			}, b.prototype.api_ToggleGyro = function() {
				return this.O ? this.api_CloseGyro() : this.api_OpenGyro()
			}, b.prototype.api_getGyroStatus = function() {
				return this.O
			}, b.prototype.api_getViewPortStatus = function() {
				return this.qa
			}, b.prototype.api_setViewPortStatus = function(a) {
				this.qa = a ? !0 : !1, this.Ga(), this.kc && this.kc()
			}, b.prototype.api_getDragStatus = function() {
				return this.Pc
			}, b.prototype.api_setDragStatus = function(a) {
				this.Pc = !!a
			}, b.prototype.api_formatEffectParams = function(a) {
				var d, e, f, g, h, i, j, k, b = a[4] ? a[4] : _[76],
					c = a[5] ? a[5] : 2;
				switch (b) {
					case _[77]:
						d = this.v, e = this.C, f = this.o, g = 1 * a[6], h = 1 * a[7], i = 1 * a[8], j = 1 * a[9], k = 1 * a[10], a = 1 * a[11];
						break;
					default:
						j = a.pan || a[1], k = a.M || a[2], a = a.J || a[3]
				}
				return {
					effectName: b,
					effectTime: 1 * c,
					nextPan: j,
					nextTilt: k,
					nextFov: a,
					sPan: d,
					sTilt: e,
					sFov: f,
					ePan: g,
					eTilt: h,
					eFov: i
				}
			}, b.prototype.api_walkDefaultTilt = function(a, b) {
				a = isNaN(a) ? 1 : a;
				var c = this;
				new K.ia({
						M: this.C
					})
					.la({
						M: 0
					}, 1e3 * a)
					.na(K.Y.bb.ud)
					.ja(function() {
						c.Gb(this.M)
					})
					.ua(function() {
						K.remove(this), _[0] == typeof b && b()
					})
					.start()
			}, b.prototype.api_walkThrough = function(a, b, c, d, e) {
				var g, h, i, j, k, f = this;
				a = isNaN(a) ? 1 : a, g = this.v, h = this.C, i = this.o, b -= g, j = b > 0 ? 1 : -1, b = Math.abs(b), b > 180 && (b = 360 - b, j *= -1), c = new K.ia({
						pan: g,
						M: h
					})
					.la({
						pan: g + b * j,
						M: c
					}, 1e3 * (a / 2))
					.na(K.Y.ta.R)
					.ja(function() {
						f.rb(this.pan, this.M)
					})
					.ua(function() {
						K.remove(this), k.start()
					}), k = new K.ia({
						J: i
					})
					.la({
						J: d
					}, 1e3 * (a / 2))
					.na(K.Y.ta.R)
					.ja(function() {
						f.Za(this.J)
					})
					.ua(function() {
						K.remove(this), cancelAnimationFrame(null), f.api_stopAll(), _[0] == typeof e && e()
					}), this.O ? k.start() : c.start()
			}, b.prototype.api_walkThroughVR = function(a, b, c) {
				a = isNaN(a) ? 1 : a;
				var d = this;
				new K.ia({
						J: this.o
					})
					.la({
						J: b
					}, 1e3 * a)
					.na(K.Y.ta.R)
					.ja(function() {
						d.Za(this.J)
					})
					.ua(function() {
						K.remove(this), d.api_stopAll(), _[0] == typeof c && c()
					})
					.start()
			}, b.prototype.api_littlePlanet = function(a, b) {
				a = isNaN(a) ? 1 : a;
				var c = this;
				new K.ia({
						pan: this.v,
						M: this.C,
						J: this.o,
						$: this.U
					})
					.la({
						pan: this.kb,
						M: -90,
						J: 150,
						$: -.9
					}, 1e3 * a)
					.na(K.Y.ta.R)
					.ja(function() {
						c.sb(this.pan, this.M, this.J, this.$)
					})
					.ua(function() {
						K.remove(this), c.La = !0, _[0] == typeof b && b()
					})
					.start()
			}, b.prototype.api_SpherePlanet = function(a, b) {
				a = isNaN(a) ? 1 : a;
				var c = this;
				new K.ia({
						pan: this.v,
						M: this.C,
						J: this.o,
						$: this.U
					})
					.la({
						pan: 0,
						M: -45,
						J: 100,
						$: -.5
					}, 1e3 * a)
					.na(K.Y.ta.R)
					.ja(function() {
						c.sb(this.pan, this.M, this.J, this.$)
					})
					.ua(function() {
						K.remove(this), c.La = !0, _[0] == typeof b && b()
					})
					.start()
			}, b.prototype.api_normalView = function(a, b) {
				a = isNaN(a) ? 1 : a;
				var c = this;
				new K.ia({
						pan: this.v,
						M: this.C,
						J: this.o,
						$: this.U
					})
					.la({
						pan: this.kb,
						M: 0,
						J: this.Ka,
						$: 0
					}, 1e3 * a)
					.na(K.Y.ta.fa)
					.ja(function() {
						c.sb(this.pan, this.M, this.J, this.$)
					})
					.ua(function() {
						K.remove(this), c.La = !1, _[0] == typeof b && b()
					})
					.start()
			}, b.prototype.api_fishEyeView = function(a, b) {
				a = isNaN(a) ? 1 : a;
				var c = this,
					d = this.v;
				new K.ia({
						pan: d,
						M: this.C,
						J: this.o,
						$: this.U
					})
					.la({
						pan: d,
						M: 0,
						J: 90,
						$: -.7
					}, 1e3 * a)
					.na(K.Y.ta.fa)
					.ja(function() {
						c.sb(this.pan, this.M, this.J, this.$)
					})
					.ua(function() {
						K.remove(this), c.La = !1, _[0] == typeof b && b()
					})
					.start()
			}, b.prototype.api_crystallBallView = function(a, b) {
				a = isNaN(a) ? 1 : a;
				var c = this,
					d = this.v,
					e = this.C;
				new K.ia({
						pan: d,
						M: e,
						J: this.o,
						$: this.U
					})
					.la({
						pan: d,
						M: e,
						J: 90,
						$: -1.4
					}, 1e3 * a)
					.na(K.Y.ta.fa)
					.ja(function() {
						c.sb(this.pan, this.M, this.J, this.$)
					})
					.ua(function() {
						K.remove(this), c.La = !1, _[0] == typeof b && b()
					})
					.start()
			}, b.prototype.api_initSceneEffect = function(a, b) {
				b = this.api_formatEffectParams(b), _[77] == b.qf ? this.api_walkThrough(a, (new Date)
					.getTime(), b) : this.api_changerSceneByIndex(a, b.Zh, b.$h, b.Yh, b.qf, b.Jh)
			}, b.prototype.api_getCurSceneLngLat = function() {
				return {
					lng: this.gg,
					lat: this.fg
				}
			}, b.prototype.api_screenToSphere = function(a, b) {
				return a = this.Jd(a, b), {
					pan: a.pan,
					tilt: a.tilt,
					fov: this.o
				}
			}, b.prototype.api_screenToModel = function(a, b) {
				return a = this.Jd(a, b), {
					pan: a.pan,
					tilt: a.tilt,
					fov: this.o
				}
			}, b.prototype.api_sphereToScreen = function(a, b) {
				return a = this.api_get3DXYZByPanTilt(a, b), a = this.api_3DXYZToScreen(a.x, a.y, a.z), {
					x: a.x,
					y: a.y,
					roll: this.ma,
					isShow: a.isInner,
					isInner: a.isInner
				}
			}, b.prototype.api_get3DXYZByPanTilt = function(a, b) {
				var d, c = [0, 0, -1];
				return _[70] == this.A ? (c[0] = (a - 180) / 180, c[1] = b / 90) : (a += this.pb, d = mat4.create(), mat4.rotateY(d, d, -(a * this.vb)), mat4.rotateX(d, d, b * this.vb), vec3.transformMat4(c, c, d)), {
					x: c[0],
					y: c[1],
					z: c[2]
				}
			}, b.prototype.api_3DXYZArrToScreen = function(a) {
				var c, d, b = a.za;
				if (a = a.Ia, c = a.length, b = this.api_3DXYZToScreen(b[0], b[1], b[2]), b.isInner) return b;
				for (b = 0; c > b; b += 3)
					if (d = this.api_3DXYZToScreen(a[b], a[b + 1], a[b + 2]), d.isInner) return d;
				return {
					x: -1e3,
					y: -1e3,
					isInner: !1
				}
			}, b.prototype.api_3DXYZToScreen = function(a, b, c) {
				c = [a, b, c], b = [];
				var d = this.width,
					e = this.height;
				return null != this.g.ca ? mat4.multiply(b, this.g.D, this.g.Ja) : mat4.multiply(b, this.D, this.s), vec3.transformMat4(c, c, b), a = c[0], b = c[1], c = c[2], c > 1 || -1 > c ? {
					x: -1e3,
					y: -1e3,
					isInner: !1
				} : (this.qa && (this.width > this.height ? (d = .5 * this.width, e = this.height) : (d = this.width, e = .5 * this.height)), a = .5 * (a + 1) * d, b = .5 * (1 - b) * e, c = !0, (0 > a || 0 > b || a > d || b > e) && (c = !1), {
					x: a,
					y: b,
					isInner: c
				})
			}, b.prototype.api_getCurSceneId = function() {
				return this.L
			}, b.prototype.api_getVideoDom = function() {
				return this.m
			}, b.prototype.api_setVideoDom = function(a) {
				this.m = a
			}, b.prototype.api_getVideoLoadStartCallBack = function() {
				return this.md
			}, b.prototype.api_getVideoLoadProgressCallBack = function() {
				return this.Kb
			}, b.prototype.api_getVideoPlayerCallBack = function() {
				return this.nd
			}, b.prototype.api_getVideoUpdateCallBack = function() {
				return this.Lb
			}, b.prototype.api_getVideoLoadMetaDataCallBack = function() {
				return this.ld
			}, b.prototype.api_IsBlackWebGL = function() {
				return this.K
			}, b.prototype.api_setVideoPlay = function() {
				this.m && (this.Ud ? this.Dh(1) : (this.m.ended && (this.m.currentTime = .1), this.m.play(), this.m.paused && setTimeout(this.api_setVideoPlay, 200), this.Xa = !0, this.sc && this.sc()))
			}, b.prototype.api_setVideoPause = function() {
				this.m.pause(), this.Xa = !1, this.sc && this.sc()
			}, b.prototype.api_setVideoMute = function(a) {
				this.m.muted = a
			}, b.prototype.api_getVideoMute = function() {
				return this.m.muted
			}, b.prototype.api_getVideoAutoPlayStatus = function() {
				return this.Ya
			}, b.prototype.api_getVideoPlayStatus = function() {
				return this.Xa
			}, b.prototype.api_setVideoToggle = function() {
				_[78] != this.va && (this.Xa ? this.api_setVideoPause() : this.api_setVideoPlay())
			}, b.prototype.api_setVideoCurTime = function(a) {
				this.m.currentTime = a, this.se && this.se()
			}, b.prototype.api_getVideoCurTime = function() {
				return this.m.currentTime
			}, b.prototype.api_getCurScenePTF = function() {
				return {
					pan: this.v,
					tilt: this.C,
					fov: this.o
				}
			}, b.prototype.api_getCameraAt = function() {
				return this.U
			}, b.prototype.api_getPlayDom = function() {
				return this.ba
			}, b.prototype.api_getTargetDom = function() {
				return this.target
			}, b.prototype.api_getRotateStatus = function() {
				return this.oa ? !0 : !1
			}, b.prototype.api_getPlayerSize = function() {
				return {
					width: this.width,
					height: this.height,
					left: this.left,
					top: this.top
				}
			}, b.prototype.api_getFovLength = function() {
				return this.Kd()
			}, b.prototype.api_setMPMatrix = function(a, b) {
				this.gf(a, b)
			}, b.prototype.api_getAllSceneData = function() {
				return this.Da
			}, b.prototype.api_playerError = function(a) {
				4 == a ? this.Lf() : this.ug(this.m, a), this.ib(), this.Hd = !0, this.Yb && this.Yb(a)
			}, b.prototype.api_getWebGLInfo = function() {
				return {
					webGL: this.a,
					viewWidth: this.Wb,
					viewHeight: this.Vb,
					vertex: this.B.kd,
					texture: this.B.da
				}
			}, b.prototype.api_getViewPortSize = function() {
				var a = this.ea();
				return {
					wh: a.sd,
					w: a.j,
					h: a.i
				}
			}, b.prototype.api_getCurMPMatrix = function() {
				return {
					mm: this.s,
					pm: this.D
				}
			}, b.prototype.api_formatTexture = function(a, b) {
				this.ab(a, b)
			}, b.prototype.api_uploadMatrixUniforms = function(a, b, c) {
				this.X(a, b, c)
			}, b.prototype.api_setTextureSize = function(a, b, c, d) {
				this.F(a, b, c, d)
			}, b.prototype.api_loadVideo = function(a) {
				this.De(a)
			}, b.prototype.api_setDBViewIPD = function(a) {
				a = 1 * a || .05, 0 > a && (a = 0), a > .15 && (a = .15), this.zb = a
			}, b.prototype.api_getDBViewIPD = function() {
				return this.zb
			}, b.prototype.api_getVRMode = function() {
				return this.Tc
			}, b.prototype.api_enterVRModel = function() {
				this.V(), this.api_setViewPortStatus(!0), this.Tc = !0;
				var a = this;
				return _[79] == this.va && this.api_setVideoPlay(), navigator.xr && navigator.xr.isSessionSupported(_[80])
					.then(function(b) {
						b && navigator.xr.requestSession(_[80])
							.then(a.xg.bind(a))
					}), this.zb
			}, b.prototype.api_exitVRModel = function() {
				return this.api_setViewPortStatus(!1), this.Tc = !1, this.zb
			}, b.prototype.api_setWebVRSensor = function(a, b, c) {
				this.dc = a, this.ke = b, this.Lc = c
			}, b.prototype.api_changeVideoPath = function(a, b, c, d, e) {
				b = isNaN(b) ? this.m.currentTime : b, this.api_setVideoPause(), this.ff(a, b, d, e)
			}, b.prototype.api_changeScenePath = function(a, b) {
				this.ef(a, b)
			}, b.prototype.api_enterFullScreen = function() {
				return JTUtil.isSupportFullScreen() ? (this.rf(this.Ic || this.target), void 0) : !1
			}, b.prototype.api_exitFullScreen = function() {
				return JTUtil.isSupportFullScreen() ? (this.sf(this.Ic || this.target), void 0) : !1
			}, b.prototype.api_fullScreen = function() {
				return JTUtil.isSupportFullScreen() ? JTUtil.reqFullScreen(this.Ic || this.target) : !1
			}, b.prototype.api_getCurMVMatrix = function() {
				return this.s
			}, b.prototype.api_createVideoDom = function() {
				return this.Vc()
			}, b.prototype.api_loadVideoDom = function(a, b, c, d, e) {
				this.rc = {}, this.Uc(a, b, c, d, e)
			}, b.prototype.api_clearAll = function() {
				this.Xa = !1, this.m && this.m.pause(), this.m = null, this.api_stopAll(), this.Cd(this.L), this.ze(), this.L = null
			}, b.prototype.api_getGLMaxTextureSize = function() {
				return this.a.getParameter(this.a.MAX_TEXTURE_SIZE)
			}, b.prototype.api_setSceneBlockModel = function(a) {
				a && a != this.l.W && (this.ph(), this.kh(a))
			}, b.prototype.api_getBestFitFov = function() {
				var b, c, d, e, a = this.o;
				return _[70] == this.A && (b = this.l.T, c = this.l.S, d = b / c, a = this.ea(), e = _[81] == this.Wa || _[82] == this.Wa && a.Ma > a.wa, b = d > a.sd ? .5 * (b > c ? a.Ma : a.Ma / d) : .5 * (c > b ? a.wa : a.wa * b / c), a = e ? 2 * this.sa * Math.atan(.5 * a.Ma / b) : 2 * this.sa * Math.atan(.5 * a.wa / b)), a
			}, b.prototype.api_scenefadeOutById = function(a, b) {
				this.re(a, b)
			}, b
		}, k = a.Cb({
			Md: function(a) {
				this.nb = 0, this.$c = !1, this.vb = Math.PI / 180, this.sa = 180 / Math.PI, this.g = {
					Qc: !0,
					ca: null,
					je: null,
					ie: null,
					Bc: 0,
					Ac: 0,
					zc: 0,
					D: mat4.create(),
					s: mat4.create(),
					Ja: mat4.create(),
					Zb: mat4.create()
				}, this.ob = !1, this.pb = 0, this.Db = [], i = JTUtil.getLanguage(), j = JTUtil.getBrowser(), this.jg(a), this.qg(), this.ng(), this.pg(a), this.kg(a), this.mg(), this.nf(), this.tg(), this.jf(), this.hf(), this.lf() ? (this.rh(), this.Me(this.ba), this.gd(), a = this.api_getSceneIndexById(this.Ff), this.Od && this.Od(), this.Cc(a), this.Ge()) : (this.gd(), this.api_playerError(0))
			},
			rg: function(a) {
				var d, e, c = {};
				return c.L = b(a, _[83], _[3]) || b(a, _[84], _[85]), c.ci = b(a, _[84], _[85]), c.di = b(a, _[86], 0), c.bi = b(a, _[87], 0), c.gg = b(a, _[88], _[3]), c.fg = b(a, _[89], _[3]), c.T = b(a, _[90], 0), c.S = b(a, _[91], 0), c.va = b(a, _[92], _[3]) || b(a, _[93], _[79]), c.jc = b(a, _[94], _[95]), c.A = b(a, _[96], _[67]), c.Z = b(a, _[97], _[3]) || b(a, _[98], _[3]), this.hg = b(a, _[99], 8), c.W = b(a, _[100], null), c.Ya = b(a, _[101], !1), c.If = !!b(a, _[102], !1), c.Jf = b(a, _[103], !0), c.Xd = b(a, _[104], 0), c.kb = b(a, _[105], 180), c.Wd = b(a, _[106], 360), c.Yc = b(a, _[107], -90), c.Nc = b(a, _[108], 0), c.Xc = b(a, _[109], 90), c.Ka = b(a, _[110], 90), c.Id = !!a.hc, c.hc = b(a, _[111], 10), c.Wc = b(a, _[112], 2), c.Vd = b(a, _[113], 150), c.Wa = b(a, _[114], _[82]), c.o = b(a, _[115], 0), c.C = b(a, _[116], 0), c.v = b(a, _[117], 0), c.ma = b(a, _[118], 0), c.U = b(a, _[119], 0), c.La = b(a, _[120], !1), c.Ca = b(a, _[121], _[64]), c.Rc = b(a, _[122], !1) ? 1 : 0, c.Eb = b(a, _[123], !0), c.wb = _[82], c.N = 0, c.Ba = !1, c.ra = {}, c.qb = [], c.pb = b(a, _[124], _[67] == c.A ? 90 : 0), null != c.W && (d = c.W, e = d.levelBeginIndex ? d.levelBeginIndex : 0, d.sceneWidth && 0 < d.sceneWidth.length && d.sceneHeight && 0 < d.sceneHeight.length && d.sceneWidth.length == d.sceneHeight.length ? d.sceneWidth.forEach(function(a, b) {
					c.qb.push({
						fileBlockDir: d.fileBlockDir.replace(/%l/g, b + e),
						rowBeginIndex: d.rowBeginIndex,
						columnBeginIndex: d.columnBeginIndex,
						fileBlockWidth: d.fileBlockWidth,
						fileBlockHeight: d.fileBlockHeight,
						sceneWidth: a,
						sceneHeight: d.sceneHeight[b]
					})
				}) : c.qb.push(d), c.W = null), c
			},
			sg: function(a, b, c, d) {
				if (a) {
					a.La ? (a.v = (a.kb + 179) % 360, a.C = -90, a.o = 150, a.U = -.9, a.Ca = _[66]) : (a.v = 1 * (b || a.kb), a.C = 1 * (c || a.Nc), a.o = 1 * (d || a.Ka), a.U = 1 * a.U || 0, this.O && (a.C = 0), _[65] === a.Ca ? (a.C = 0, a.o = 90, a.U = -.7) : _[66] === a.Ca ? (a.v = 0, a.C = -90, a.o = 150, a.U = -.9) : _[68] === a.Ca ? (a.o = 90, a.U = -1.4) : _[69] === a.Ca && (a.A = _[70]));
					for (var e in a) this[e] = a[e]
				} else this.Xd = 0, this.Wd = this.kb = 180, this.Yc = -90, this.Nc = 0, this.Ka = this.Xc = 90, this.hc = 10, this.Vd = 150, this.Wa = _[82], this.o = 90, this.C = 0, this.v = 90, this.U = this.ma = 0
			},
			Gf: function(a) {
				var c, d, e, f, g, b = this.Da.length;
				if (a = 1 * a ? 1 * a : 0, a = 0 > a ? b - 1 : a >= b ? 0 : a, (b = this.api_getSceneDataByIndex(a)) && this.L != b.sceneId) {
					if (this.jb = this.L, this.Ub = a, (a = this.ac(this.jb)) && (c = mat4.create(), d = mat4.create(), mat4.copy(c, this.s), mat4.copy(d, this.D), a.s = c, a.D = d, a.Ea))
						for (e = 0, f = a.Ea.length; f > e; e++) g = a.Ea[e], g.s = c, g.D = d;
					return this.rg(b)
				}
			},
			Ef: function(a) {
				if (a) {
					var b = j.plat,
						c = JTUtil.getFileExt(a.jc),
						d = this.Oa.toLowerCase();
					_[125] != c || _[126] != b && _[127] != b && _[128] != b || (a.wb = _[129]), (b = /AppleWebKit\/(\d+\.\d)/i.test(this.Oa) ? 1 * RegExp.$1 : null) && b >= 602 && (a.wb = _[82]), d.match(/edge|msie|trident/) && (a.wb = _[129])
				}
			},
			Ne: function(a) {
				a.Dd = function() {
					var c, d, e;
					if (_[129] == a.wb && _[79] == a.va ? this.uc(a) : _[79] == a.va && this.Xa && this.uc(a), c = this.Na(this.Ob[_[130] + this.u([111, 115, 116, 110]) + _[131]])
						.join(_[3]), -1 == c.indexOf(_[132]) && -1 == c.indexOf(_[133]))
						if (this.a.uniform1f(this.B.Hf, b(a, _[134], 1)), this.a.uniform1f(this.B.Rc, a.Rc), _[67] == a.A) this.Pa(a), this.Vg(a);
						else if (_[135] == a.A) this.Pa(a), this.Ug(a);
					else if (_[70] == a.A) this.Pa(a), this.Ng(a), a.W && this.pd(a);
					else if (_[136] == a.A) {
						if (a.Ea)
							for (c = 0, d = a.Ea.length; d > c; c++) e = a.Ea[c], e.N = a.N, this.Pa(e), this.Be(e);
						else this.Pa(a), this.Be(a);
						a.W && this.pd(a)
					}
				}.bind(this)
			},
			Cc: function(a, b, d, e) {
				if (this.ob) this.Db.push(this.Cc.bind(this, a, b, d, e));
				else if (this.ob = !0, a = this.Gf(a)) {
					if (this.l = a, this.Ef(this.l), this.Fe(this.l), this.sg(this.l, b, d, e), this.Rb(), this.Ga(), b = this.Ce(this.l), Array.isArray(b)) {
						for (d = [], e = 0, a = b.length; a > e; e++) d.push(this.Nb(b[e]));
						this.l.Ea = d
					} else this.Nb(b, this.l);
					this.Ne(this.l), this.ze(), this.ka.push(this.l), this.tb(decodeURI(c[i])), _[79] == this.l.va ? this.De(this.l) : _[78] == this.l.va && this.lh(this.l), this.Rd && this.Rd()
				} else this.ob = !1
			},
			rf: function(a) {
				a = a ? a : document.documentElement, JTUtil.isFullScreen() || (a.cg && a.cg(), a.webkitRequestFullScreen && a.webkitRequestFullScreen(), a.msRequestFullscreen && a.msRequestFullscreen(), a.mozRequestFullScreen && a.mozRequestFullScreen(), a.Yf && a.Yf())
			},
			sf: function() {
				JTUtil.isFullScreen() && (document.exitFullscreen && document.exitFullscreen(), document.Cb && document.Cb(), document.webkitCancelFullScreen && document.webkitCancelFullScreen(), document.msExitFullscreen && document.msExitFullscreen(), document.mozCancelFullScreen && document.mozCancelFullScreen(), document.zd && document.zd())
			},
			vf: function(a, b, c) {
				var d = 0;
				return _[78] == a && (d = 10), _[79] == a && (d = 20), a = 0, _[137] == b && (a = 0), _[138] == b && (a = 1), _[139] == b && (a = 2), c ? -1 : d + a
			},
			yf: function() {
				var a = _[3];
				try {
					a = window.top == window ? _[3] : top.location.href
				} catch (b) {
					a = _[3]
				}
				return a
			},
			ei: function(a, b) {
				if (a && _[140] != this.Ob.protocol) {
					var c = a.T ? a.T : 0,
						d = a.S ? a.S : 1,
						e = new Image,
						f = this.u([47, 47, 97, 46, 117, 116, 111, 118, 114, 46, 99, 111, 109, 47, 116, 46, 112, 110, 103]),
						g = encodeURIComponent(this.yf()),
						h = this.u([49, 46, 48, 46, 49, 49, 57, 52]),
						i = this.xc.join(_[141]);
					a = this.vf(a.va, a.Z, b), b = (c / d)
						.toFixed(2), c = c + _[141] + d, d = this.u([104]), f += this.u([63, 117, 116, 61, 49]), g && (f += this.u([38, 100, 61]) + g), h && (f += this.u([38, 118, 61]) + h), i && (f += this.u([38, 107, 61]) + i), a && (f += this.u([38, 116, 61]) + a), b && (f += this.u([38, 115, 61]) + b), f += this.u([38, 97, 61]) + 360, c && (f += this.u([38, 119, 61]) + c), d && (f += this.u([38, 109, 61]) + d), this.u(this.xc), e.src = f
				}
			},
			jf: function() {
				var c, a = this.Ob,
					b = a[this.u([104, 111, 115, 116, 110, 97, 109, 101])];
				if (this.ag = b, c = this.Na(b)
					.join(_[3]), 1 === this.xb && _[1] !== typeof JTC && _[1] !== typeof JTR && 1 == JTR) this.b = this.c = !1, this.f = !0;
				else if (_[142] === b && 1665504e6 > (new Date)
					.getTime()) this.b = this.c = !1, this.f = !0;
				else if (_[143] === b) 16818336e5 > (new Date)
					.getTime() && (this.b = this.c = !1, this.f = !0);
				else if (_[144] === b) 1682784e6 > (new Date)
					.getTime() && (this.b = this.c = !1, this.f = !0);
				else if (_[145] === b) this.b = this.c = !1, this.f = !0;
				else if (_[146] === b || _[147] === b || _[148] === b || _[149] === b) this.b = this.c = !1, this.f = !0;
				else if (_[150] === b) this.b = this.c = !1, this.f = !0;
				else if (_[151] === b) this.b = this.c = !1, this.f = !0;
				else if (_[152] === b) this.b = this.c = !1, this.f = !0;
				else {
					if (_[140] == a[this.u([112, 114, 111, 116, 111, 99, 111, 108])]) return !1;
					for (a = -1, b = 0; b < this.Mc.length; b++)
						if (-1 != c.indexOf(this.Mc[b].join(_[3]))) {
							a = b;
							break
						} - 1 !== a && (this.xc = this.Mc[a], 0 === a || 4 === a || 5 === a || 46 === a || 47 === a || 42 === a || 43 === a || 69 === a || 70 === a || 75 === a || 76 === a || 77 === a || 81 === a || 82 === a || 83 === a || 96 === a || 97 === a ? this.b = this.c = !1 : 6 === a || 11 === a || 12 === a || 16 === a || 18 === a || 19 === a || 20 === a || 21 === a || 29 === a || 30 === a || 31 === a || 34 == a || 38 == a ? (this.c = !1, this.f = this.b = !0) : 2 === a || 22 === a || 24 === a || 25 === a || 28 == a || 40 == a || 39 === a ? this.c = !1 : 10 === a || 23 === a || 32 === a || 33 === a || 53 === a || 48 === a || 49 === a || 50 === a || 61 === a || 62 === a || 65 === a || 68 === a || 7 === a || 8 === a || 9 === a || 13 === a || 71 === a || 72 === a || 73 === a || 90 === a || 93 === a || 94 === a || 26 === a || 101 === a ? (this.b = this.c = !1, this.f = !0) : 186 === a ? (this.b = this.c = !1, this.f = !0) : 185 === a ? (this.b = this.c = !1, this.f = !0) : 184 === a ? (this.b = this.c = !1, this.f = !0) : 183 === a ? (this.b = this.c = !1, this.f = !0) : 181 === a ? (this.b = this.c = !1, this.f = !0) : 180 === a ? (this.b = this.c = !1, this.f = !0) : 167 === a || 168 === a || 169 === a || 170 === a ? (this.b = this.c = !1, this.f = !0) : 156 === a ? (this.b = this.c = !1, this.f = !0) : 1 === a ? (this.c = !1, this.f = this.b = !0) : 152 === a ? (this.b = this.c = !1, this.f = !0) : 150 === a ? (this.b = this.c = !1, this.f = !0) : 149 === a || 154 === a ? (this.b = this.c = !1, this.f = !0) : 148 === a ? (this.b = this.c = !1, this.f = !0) : 147 === a ? (this.b = this.c = !1, this.f = !0) : 146 === a || 160 === a ? (this.b = this.c = !1, this.f = !0) : 145 === a ? (this.b = this.c = !1, this.f = !0) : 144 === a ? (this.b = this.c = !1, this.f = !0) : 143 === a ? this.f = this.b = this.c = !1 : 142 === a ? (this.b = this.c = !1, this.f = !0) : 141 === a ? (this.b = this.c = !1, this.f = !0) : 139 === a || 140 === a ? (this.b = this.c = !1, this.f = !0) : 3 === a ? (this.b = this.c = !1, this.f = !0) : 138 === a ? (this.b = this.c = !1, this.f = !0) : 67 === a ? (this.b = this.c = !1, this.f = !0) : 137 === a ? (this.b = this.c = !1, this.f = !0) : 134 === a ? (this.b = this.c = !1, this.f = !0) : 130 === a || 131 === a || 132 === a ? (this.b = this.c = !1, this.f = !0) : 129 === a ? (this.b = this.c = !1, this.f = !0) : 128 === a ? (this.b = this.c = !1, this.f = !0) : 102 === a || 60 === a ? (this.b = this.c = !1, this.f = !0) : 126 === a ? (this.b = this.c = !1, this.f = !0) : 125 === a || 151 === a ? (this.b = this.c = !1, this.f = !0) : 124 === a ? (this.b = this.c = !1, this.f = !0) : 123 === a ? (this.b = this.c = !1, this.f = !0) : 122 === a ? (this.b = this.c = !1, this.f = !0) : 120 === a ? (this.b = this.c = !1, this.f = !0) : 117 === a || 118 === a ? (this.b = this.c = !1, this.f = !0) : 116 === a ? (this.b = this.c = !1, this.f = !0) : 115 === a || 136 === a ? (this.b = this.c = !1, this.f = !0) : 106 === a || 107 === a ? (this.b = this.c = !1, this.f = !0) : 108 === a ? (this.b = this.c = !1, this.f = !0) : 110 === a ? (this.b = this.c = !1, this.f = !0) : 112 === a ? (this.b = this.c = !1, this.f = !0) : 14 === a || 15 === a || 17 === a || 27 === a ? this.f = !0 : 86 === a || 85 === a ? (this.b = this.c = !1, this.f = !0) : (c = (new Date)
						.getTime(), 92 === a || 93 === a ? 1528694122881 > c && (this.f = this.b = this.c = !1) : 35 === a ? 1488162183430 > c && (this.c = !1, this.f = this.b = !0) : 36 === a ? 1499331710824 > c && (this.c = !1, this.f = this.b = !0) : 37 === a ? 1491472632606 > c && (this.c = !1, this.f = this.b = !0) : 41 === a ? 1525153217345 > c && (this.b = this.c = !1) : 44 === a || 45 === a ? 1525943823575 > c && (this.b = this.c = !1, this.f = !0) : 51 === a ? 1527412065494 > c && (this.f = this.b = this.c = !1) : 52 === a ? 1527412065494 > c && (this.b = this.c = !1, this.f = !0) : 58 === a ? 1527821843058 > c && (this.b = this.c = !1, this.f = !0) : 59 === a ? 1528695136486 > c && (this.b = this.c = !1, this.f = !0) : 63 === a ? 149266983e4 > c && (this.b = this.c = !1, this.f = !0) : 64 === a ? 15238944e5 > c && (this.b = this.c = !1, this.f = !0) : 66 === a ? 1529823637044 > c && (this.b = this.c = !1, this.f = !0) : 74 === a ? 15664896e5 > c && (this.b = this.c = !1, this.f = !0) : 78 === a || 79 === a ? 1532415403613 > c && (this.b = this.c = !1, this.f = !0) : 80 === a ? 1503283406411 > c && (this.f = !0) : 84 === a ? 15715008e5 > c && (this.b = this.c = !1, this.f = !0) : 87 === a || 88 === a || 89 === a ? 1539238217873 > c && (this.b = this.c = !1, this.f = !0) : 98 === a ? 1522317702383 > c && (this.b = !1, this.f = !0) : 99 === a ? 1549009809442 > c && (this.b = this.c = !1) : 100 === a ? 1551944613942 > c && (this.b = this.c = !1, this.f = !0) : 103 === a || 109 === a ? 1555988875541 > c && (this.b = this.c = !1, this.f = !0) : 104 === a ? 16065792e5 > c && (this.b = this.c = !1, this.f = !0) : 43 === a ? 1531152e6 > c && (this.b = this.c = !1, this.f = !0) : 105 === a ? 16837344e5 > c && (this.b = this.c = !1, this.f = !0) : 111 === a ? 15530112e5 > c && (this.f = this.b = this.c = !1) : 113 === a ? 1581696e6 > c && (this.b = this.c = !1, this.f = !0) : 114 === a ? (this.b = this.c = !1, this.f = !0) : 119 === a || 157 === a ? (this.b = this.c = !1, this.f = !0) : 176 === a ? 1647792e6 > c && (this.b = this.c = !1, this.f = !0) : 127 === a ? 16515936e5 > c && (this.b = this.c = !1, this.f = !0) : 133 === a ? 156528e7 > c && (this.b = this.c = !1, this.f = !0) : 135 === a ? 15722784e5 > c && (this.f = this.b = this.c = !0) : 153 === a ? (this.b = this.c = !1, this.f = !0) : 155 === a ? 16264512e5 > c && (this.b = this.c = !1, this.f = !0) : 158 === a ? 16360416e5 > c && (this.b = this.c = !1, this.f = !0) : 159 === a ? 16329312e5 > c && (this.b = this.c = !1, this.f = !0) : 161 === a ? 16364736e5 > c && (this.b = this.c = !1, this.f = !0) : 162 === a ? 163656e7 > c && (this.b = this.c = !1, this.f = !0) : 163 === a || 164 === a || 165 === a ? 1703952e6 > c && (this.b = this.c = !1, this.f = !0) : 166 === a ? (this.b = this.c = !1, this.f = !0) : 171 === a ? 16617888e5 > c && (this.b = this.c = !1, this.f = !0) : 172 === a ? 17171712e5 > c && (this.b = this.c = !1, this.f = !0) : 173 === a ? 16613568e5 > c && (this.b = this.c = !1, this.f = !0) : 174 === a ? 17038656e5 > c && (this.b = this.c = !1, this.f = !0) : 175 === a ? (this.b = this.c = !1, this.f = !0) : 177 === a || 178 === a || 179 === a ? 166248e7 > c && (this.b = this.c = !1, this.f = !0) : 182 === a ? 16769952e5 > c && (this.b = this.c = !1, this.f = !0) : 187 === a ? 16998912e5 > c && (this.b = this.c = !1, this.f = !0) : 188 === a && 1682784e6 > c && (this.b = this.c = !1, this.f = !0)))
				}
			},
			Na: function(a) {
				for (var b = [], c = 0; c < a.length; c++) b.push(a.charCodeAt(c));
				return b
			},
			u: function(a) {
				for (var b = [], c = 0; c < a.length; c++) b.push(String.fromCharCode(a[c]));
				return b.join(_[3])
			},
			Vh: function() {
				return [49, 46, 48, 46, 49, 49, 57, 52]
			},
			Kc: function() {
				return this.u(1 === this.xb ? [74, 73, 69, 84, 85, 83, 79, 70, 84, 32, 83, 68, 75, 32] : [85, 116, 111, 86, 82, 32, 80, 108, 97, 121, 101, 114, 32, 83, 68, 75, 32]) + this.u([49, 46, 48, 46, 49, 49, 57, 52])
			},
			jg: function(a) {
				this.Bd = b(a, _[153], document.body), this.name = b(a, _[154], _[155]), this.width = b(a, _[156], 800), this.height = b(a, _[157], 600), this.zIndex = b(a, _[158], 0), this.gc = b(a, _[159], _[3]), this.Oa = navigator.userAgent, this.gc && (c.en = this.gc, c.cn = this.gc, c.jp = this.gc)
			},
			pg: function(a) {
				this.Sc = b(a, _[160], !0), this.Pd = b(a, _[161], !0), this.qa = b(a, _[162], !1), this.Tc = !1, this.zb = b(a, _[163], 0), this.xb = b(a, _[164], 0), this.Je = b(a, _[165], _[3]), this.Ff = b(a, _[166], _[3]), this.O = b(a, _[167], !1), this.mf = b(a, _[168], !1), this.Pc = b(a, _[169], !0), this.Hc = b(a, _[170], _[171]), this.Va = b(a, _[172], !1), this.Ec = .1, this.Xb = b(a, _[173], !0), this.preserveDrawingBuffer = b(a, _[174], !1), this.Da = b(a, _[175], []), this.K = b(a, _[176], !1), this.mb = this.f = !1, this.xc = [102, 114, 101, 101], this.c = !0, this.Fb = !1, this.b = !0, this.Ic = b(a, _[177], null), j.isMobile || (this.O = !1)
			},
			kg: function(a) {
				this.Od = b(a, _[178], null), this.Rd = b(a, _[179], null), this.fc = b(a, _[180], null), this.Ed = b(a, _[181], null), this.Yb = b(a, _[182], null), this.kc = b(a, _[183], null), this.qe = b(a, _[184], null), this.oe = b(a, _[185], null), this.pe = b(a, _[186], null), this.me = b(a, _[187], null), this.ne = b(a, _[188], null), this.$b = b(a, _[189], null), this.Kb = b(a, _[190], null), this.md = b(a, _[191], null), this.nd = b(a, _[192], null), this.qc = b(a, _[193], null), this.Lb = b(a, _[194], null), this.ld = b(a, _[195], null), this.sc = b(a, _[196], null), this.se = b(a, _[197], null), this.ue = b(a, _[198], null), this.wd = b(a, _[199], null), this.vd = b(a, _[200], null), this.xe = b(a, _[201], null), this.ve = b(a, _[202], null)
			},
			og: function() {
				var b, c, a = DomUtil.getSize(this.target);
				this.api_resize(a.width, a.height), window.Cb(this.target, EventUtil.debounce(function() {
						var a = DomUtil.getSize(this.target);
						this.api_resize(a.width, a.height)
					}, 100, !0)
					.bind(this)), b = this, c = new(window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver)(function() {
					JTUtil.gId(_[203]) || (b.api_setVideoPause(), b.m = null, c.disconnect())
				}), c.observe(document.body, {
					childList: !0,
					subtree: !0
				})
			},
			qg: function() {
				this.D = mat4.create(), this.ce = mat4.create(), this.s = mat4.create(), this.Ub = this.Vb = this.Wb = 0, this.Ob = window.location, this.jb = null
			},
			ng: function() {
				this.lb = this.Aa = !1, this.pa = this.Ta = this.$a = this.oa = this.Tb = this.Sb = this.dd = this.cd = 0, this.Mc = [
					[99, 104, 105, 110, 97, 110, 101, 119, 115, 46, 99, 111, 109],
					[99, 110, 116, 118, 46, 99, 110],
					[105, 112, 97, 110, 100, 97, 46, 99, 111, 109],
					[56, 49, 46, 99, 110],
					[55, 50, 48, 121, 117, 110, 46, 99, 111, 109],
					[55, 50, 48, 115, 116, 97, 116, 105, 99, 46, 99, 111, 109],
					[117, 116, 111, 118, 114, 46, 99, 111, 109],
					[122, 104, 111, 110, 103, 103, 117, 111, 119, 97, 110, 103, 115, 104, 105, 46, 99, 111, 109],
					[120, 105, 110, 104, 117, 97, 97, 112, 112, 46, 99, 111, 109],
					[120, 105, 110, 104, 117, 97, 109, 109, 46, 110, 101, 116],
					[104, 117, 97, 119, 101, 105, 46, 99, 111, 109],
					[115, 110, 97, 105, 108, 118, 114, 46, 99, 111, 109],
					[119, 104, 97, 108, 101, 121, 45, 118, 114, 46, 99, 111, 109],
					[56, 55, 56, 55, 48, 46, 99, 111, 109],
					[122, 106, 111, 108, 46, 99, 111, 109],
					[115, 111, 98, 101, 121, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[117, 116, 111, 118, 114, 46, 99, 110],
					[117, 116, 111, 118, 114, 104, 108, 115, 112, 108, 97, 121, 46, 100, 110, 105, 111, 110, 46, 99, 111, 109],
					[119, 121, 122, 99, 46, 99, 111, 109],
					[103, 107, 107, 46, 99, 110],
					[117, 112, 52, 103, 46, 99, 111, 109],
					[107, 101, 122, 104, 117, 97, 110, 106, 105, 97, 46, 99, 111, 109],
					[99, 108, 105, 99, 107, 45, 118, 46, 99, 111, 109],
					[109, 105, 103, 117, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[104, 117, 105, 120, 105, 97, 111, 101, 114, 46, 99, 111, 109],
					[98, 97, 111, 109, 105, 104, 117, 97, 46, 99, 111, 109],
					[99, 122, 116, 118, 46, 99, 111, 109],
					[120, 105, 110, 104, 117, 105, 119, 101, 110, 46, 99, 111, 109],
					[118, 114, 99, 100, 107, 106, 46, 99, 111, 109],
					[99, 121, 106, 120, 46, 99, 111, 109],
					[116, 111, 117, 99, 104, 101, 118, 46, 99, 111, 109],
					[116, 115, 121, 116, 118, 46, 99, 111, 109, 46, 99, 110],
					[108, 105, 119, 118, 114, 46, 99, 111, 109],
					[104, 108, 115, 46, 108, 105, 119, 46, 100, 110, 105, 111, 110, 46, 99, 111, 109],
					[99, 99, 116, 118, 46, 99, 111, 109],
					[115, 117, 112, 101, 114, 115, 116, 97, 114, 99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 115, 46, 99, 111, 109],
					[109, 111, 106, 105, 110, 103, 46, 99, 110],
					[108, 101, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[122, 101, 114, 111, 109, 111, 110, 105, 116, 111, 114, 46, 99, 111, 109],
					[106, 105, 110, 103, 106, 105, 114, 105, 98, 97, 111, 46, 99, 110],
					[106, 102, 106, 98, 97, 112, 112, 46, 99, 110],
					[118, 114, 45, 115, 104, 111, 119, 115, 46, 99, 110],
					[109, 97, 100, 118, 51, 54, 48, 46, 99, 111, 109],
					[109, 97, 100, 118, 51, 54, 48, 46, 99, 110],
					[119, 101, 99, 104, 97, 110, 103, 46, 110, 101, 116],
					[122, 109, 105, 116, 105, 46, 99, 111, 109],
					[112, 101, 97, 114, 118, 105, 100, 101, 111, 46, 99, 111, 109],
					[112, 101, 97, 114, 109, 101, 100, 105, 97, 46, 99, 110],
					[116, 97, 97, 103, 111, 111, 46, 99, 111, 109],
					[116, 97, 97, 103, 111, 111, 46, 99, 110],
					[120, 105, 97, 111, 121, 117, 97, 110, 121, 111, 117, 46, 99, 110],
					[100, 100, 105, 112, 105, 110, 103, 46, 99, 111, 109],
					[119, 111, 110, 105, 117, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[115, 104, 105, 107, 111, 110, 103, 46, 116, 118],
					[117, 112, 97, 110, 111, 46, 99, 110],
					[117, 112, 97, 110, 111, 118, 114, 46, 99, 111, 109],
					[117, 112, 97, 110, 111, 46, 108, 105, 118, 101],
					[117, 112, 97, 110, 111, 46, 110, 101, 116],
					[109, 105, 97, 111, 109, 114, 46, 99, 111, 109],
					[107, 101, 121, 110, 111, 46, 99, 110],
					[104, 111, 115, 118, 114, 46, 99, 110],
					[101, 97, 115, 121, 118, 97, 97, 115, 46, 99, 111, 109],
					[121, 122, 98, 46, 116, 118],
					[112, 121, 114, 97, 109, 105, 100, 118, 114, 46, 99, 110],
					[110, 103, 98, 108, 97, 98, 46, 99, 111, 109],
					[121, 105, 122, 104, 105, 98, 111, 46, 116, 118],
					[122, 115, 108, 105, 118, 101, 46, 116, 111, 112],
					[99, 105, 116, 121, 56, 46, 99, 111, 109],
					[103, 111, 116, 110, 46, 99, 110],
					[120, 105, 97, 111, 121, 105, 46, 99, 111, 109],
					[121, 105, 116, 101, 99, 104, 110, 111, 108, 111, 103, 121, 46, 99, 111, 109],
					[120, 105, 97, 111, 112, 97, 110, 111, 46, 99, 111, 109],
					[116, 97, 97, 103, 111, 111, 46, 110, 101, 116],
					[99, 104, 105, 110, 97, 109, 111, 110, 115, 46, 99, 111, 109],
					[55, 50, 48, 118, 118, 46, 99, 111, 109],
					[102, 112, 104, 105, 115, 46, 99, 111, 109],
					[120, 105, 110, 121, 105, 108, 105, 110, 107, 46, 99, 111, 109],
					[110, 101, 116, 105, 109, 101, 46, 99, 111, 109, 46, 99, 110],
					[114, 105, 112, 112, 108, 101, 45, 99, 111, 114, 112, 46, 99, 111, 109],
					[99, 104, 97, 110, 101, 108, 46, 99, 111, 109, 46, 99, 110],
					[114, 101, 97, 100, 105, 116, 101, 99, 46, 99, 111, 109],
					[100, 97, 114, 108, 105, 110, 103, 46, 99, 110],
					[112, 114, 111, 116, 114, 117, 108, 121, 46, 99, 111, 109, 46, 99, 110],
					[98, 113, 108, 110, 118, 46, 99, 111, 109, 46, 99, 110],
					[116, 118, 49, 56, 57, 46, 99, 111, 109],
					[111, 117, 114, 106, 105, 97, 110, 103, 115, 117, 110, 46, 99, 111, 109],
					[106, 115, 116, 118, 46, 99, 111, 109],
					[122, 104, 105, 49, 48, 46, 99, 111, 109],
					[122, 104, 105, 104, 101, 100, 111, 110, 103, 102, 97, 110, 103, 46, 99, 111, 109],
					[122, 104, 119, 101, 98, 105, 110, 97, 114, 46, 99, 111, 109],
					[122, 111, 108, 46, 99, 111, 109, 46, 99, 110],
					[49, 48, 48, 56, 54, 46, 99, 110],
					[115, 109, 97, 114, 116, 46, 99, 111, 109],
					[106, 97, 101, 97, 112, 112, 46, 99, 111, 109],
					[99, 99, 116, 118, 52, 103, 46, 99, 111, 109],
					[105, 99, 104, 101, 110, 103, 122, 105, 46, 99, 111, 109],
					[104, 111, 109, 101, 119, 101, 98, 46, 99, 110],
					[108, 105, 108, 108, 121, 97, 100, 109, 105, 110, 46, 99, 110],
					[122, 106, 111, 108, 46, 99, 111, 109, 46, 99, 110],
					[104, 107, 115, 111, 102, 116, 46, 99, 110],
					[119, 120, 106, 121, 46, 99, 111, 109, 46, 99, 110],
					[106, 115, 101, 99, 111, 110, 111, 109, 121, 46, 99, 111, 109],
					[104, 111, 115, 115, 107, 121, 46, 99, 111, 109],
					[103, 117, 105, 115, 101, 110, 46, 99, 111, 109, 46, 99, 110],
					[119, 120, 116, 111, 111, 46, 99, 111, 109],
					[98, 97, 99, 107, 118, 46, 99, 111, 109, 46, 99, 110],
					[119, 117, 100, 97, 111, 109, 101, 100, 105, 97, 46, 99, 111, 109],
					[99, 116, 118, 105, 116, 46, 116, 118],
					[99, 122, 116, 118, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[108, 101, 109, 107, 111, 111, 46, 99, 111, 109],
					[99, 100, 121, 115, 120, 121, 46, 99, 110],
					[116, 101, 110, 99, 101, 110, 116, 45, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[104, 111, 103, 101, 46, 99, 110],
					[115, 99, 104, 111, 111, 108, 45, 108, 105, 118, 101, 46, 99, 110],
					[105, 113, 105, 108, 117, 46, 99, 111, 109],
					[109, 97, 107, 101, 109, 97, 103, 105, 99, 46, 99, 99],
					[101, 110, 118, 105, 115, 105, 111, 110, 45, 116, 101, 99, 104, 46, 99, 110],
					[98, 101, 46, 106, 122, 121, 113, 46, 108, 116, 100],
					[112, 101, 111, 112, 108, 101, 97, 112, 112, 46, 99, 111, 109],
					[49, 55, 119, 111, 46, 99, 110],
					[104, 111, 114, 116, 105, 45, 101, 120, 112, 111, 50, 48, 49, 57, 46, 99, 111, 109],
					[101, 113, 118, 114, 97, 114, 46, 99, 111, 109],
					[97, 110, 97, 45, 115, 101, 114, 118, 105, 99, 101, 46, 99, 110],
					[110, 98, 115, 46, 99, 110],
					[116, 118, 53, 118, 114, 46, 99, 99],
					[121, 105, 115, 112, 97, 99, 101, 46, 99, 110],
					[99, 99, 116, 118, 52, 103, 46, 99, 111, 109],
					[118, 116, 99, 51, 54, 53, 46, 99, 111, 109],
					[118, 114, 45, 116, 46, 99, 111, 109],
					[106, 108, 110, 116, 118, 46, 99, 110],
					[53, 103, 110, 108, 105, 118, 101, 46, 110, 101, 116],
					[53, 103, 110, 108, 105, 118, 101, 46, 99, 111, 109],
					[53, 103, 110, 108, 105, 118, 101, 46, 99, 110],
					[50, 119, 101, 110, 46, 99, 110],
					[119, 97, 115, 101, 101, 46, 99, 111, 109],
					[57, 54, 49, 56, 57, 46, 99, 111, 109],
					[110, 120, 108, 116, 49, 48, 48, 49, 48, 46, 99, 111, 109],
					[102, 111, 114, 116, 117, 110, 101, 45, 110, 101, 116, 46, 99, 110],
					[99, 117, 110, 111, 118, 115, 46, 99, 111, 109],
					[104, 101, 108, 108, 111, 110, 105, 104, 97, 111, 46, 99, 110],
					[104, 97, 111, 121, 117, 98, 97, 110, 46, 99, 111, 109],
					[106, 105, 103, 117, 97, 110, 116, 111, 110, 103, 46, 99, 111, 109],
					[105, 102, 97, 110, 98, 111, 46, 99, 111, 109],
					[97, 111, 109, 121, 103, 111, 100, 46, 99, 111, 109],
					[103, 120, 121, 115, 112, 119, 101, 98, 46, 99, 111, 109],
					[55, 50, 48, 115, 103, 46, 99, 111, 109],
					[122, 104, 111, 110, 103, 103, 117, 111, 119, 97, 110, 103, 115, 104, 105, 46, 99, 111, 109],
					[116, 121, 114, 101, 97, 100, 46, 99, 111, 109],
					[109, 111, 117, 110, 116, 45, 116, 97, 105, 46, 99, 111, 109, 46, 99, 110],
					[103, 109, 99, 99, 46, 110, 101, 116],
					[105, 121, 111, 111, 118, 114, 46, 99, 111, 109],
					[86, 82, 102, 108, 121, 46, 99, 110],
					[110, 106, 104, 117, 97, 113, 117, 110, 46, 99, 111, 109],
					[115, 121, 99, 111, 109, 109, 101, 114, 99, 105, 97, 108, 46, 99, 111, 109],
					[122, 111, 110, 101, 49, 51, 57, 46, 99, 111, 109],
					[97, 105, 114, 121, 111, 117, 46, 99, 110],
					[118, 114, 112, 111, 114, 116, 46, 99, 110],
					[99, 104, 105, 110, 97, 117, 110, 105, 99, 111, 109, 118, 105, 100, 101, 111, 46, 99, 110],
					[99, 100, 99, 121, 121, 46, 99, 110],
					[107, 117, 108, 101, 105, 109, 97, 110, 46, 99, 111, 109],
					[120, 105, 110, 104, 117, 97, 120, 109, 116, 46, 99, 111, 109],
					[116, 111, 117, 114, 103, 97, 110, 115, 117, 46, 99, 111, 109],
					[55, 50, 48, 106, 111, 121, 46, 99, 111, 109],
					[109, 101, 108, 100, 105, 110, 103, 99, 108, 111, 117, 100, 46, 99, 111, 109],
					[99, 114, 105, 46, 99, 110],
					[99, 103, 116, 110, 46, 99, 111, 109],
					[121, 111, 111, 110, 103, 111, 111, 46, 99, 111, 109],
					[115, 122, 116, 118, 46, 99, 111, 109, 46, 99, 110],
					[115, 122, 109, 103, 46, 99, 111, 109, 46, 99, 110],
					[115, 122, 99, 109, 99, 46, 116, 101, 99, 104],
					[115, 122, 99, 109, 99, 46, 110, 101, 116],
					[99, 104, 105, 110, 97, 109, 111, 98, 105, 108, 101, 46, 99, 111, 109],
					[98, 101, 115, 116, 109, 111, 118, 105, 101, 46, 99, 111, 109, 46, 99, 110],
					[106, 120, 122, 98, 46, 99, 111, 109, 46, 99, 110],
					[116, 111, 110, 116, 114, 111, 110, 46, 99, 111, 109, 46, 99, 110],
					[99, 109, 105, 105, 118, 105, 112, 46, 99, 111, 109],
					[57, 49, 57, 118, 114, 46, 99, 110],
					[104, 101, 98, 121, 117, 110, 46, 99, 111, 109, 46, 99, 110],
					[112, 100, 109, 105, 114, 121, 117, 110, 46, 99, 111, 109],
					[116, 97, 105, 99, 97, 110, 103, 102, 109, 99, 46, 99, 111, 109],
					[100, 117, 108, 119, 105, 99, 104, 46, 111, 114, 103],
					[108, 105, 116, 101, 110, 101, 119, 115, 46, 99, 110],
					[102, 115, 116, 118, 46, 99, 111, 109, 46, 99, 110],
					[49, 48, 48, 49, 48, 46, 99, 111, 109],
					[101, 99, 111, 117, 114, 116, 46, 99, 111, 109, 46, 99, 110],
					[111, 101, 101, 101, 101, 46, 99, 111, 109],
					[103, 114, 101, 101, 110, 115, 99, 104, 111, 111, 108, 46, 111, 114, 103],
					[106, 105, 101, 116, 117, 116, 105, 97, 110, 120, 105, 97, 46, 99, 111, 109],
					[107, 97, 110, 107, 97, 110, 101, 119, 115, 46, 99, 111, 109]
				]
			},
			mg: function() {
				this.hb = this.ba = this.target = null
			},
			nf: function() {
				this.target = JTUtil.cDom(_[42]), DomUtil.setProperties(this.target, {
					name: this.name
				}), DomUtil.setStyles(this.target, {
					position: _[204],
					overflow: _[205],
					width: _[206],
					height: _[206],
					backgroundColor: _[207],
					left: _[208],
					top: _[208],
					zIndex: this.zIndex
				}), DomUtil.inject(this.target, this.Bd), this.ba = JTUtil.cDom(_[42]), DomUtil.setProperties(this.ba, {
					id: _[203],
					tabIndex: -1
				}), DomUtil.setStyles(this.ba, {
					position: _[204],
					overflow: _[205],
					height: _[206],
					width: _[206],
					outline: _[76]
				}), DomUtil.inject(this.ba, this.target), this.ba.style[j.prefix + _[209]] = _[76], this.ba.style[j.prefix + _[210]] = _[76], this.ba.style[j.prefix + _[211]] = _[76], this.hb = JTUtil.cDom(_[42]), DomUtil.setProperties(this.hb, {
					id: _[212]
				}), DomUtil.setStyles(this.hb, {
					position: _[204],
					width: _[206],
					height: _[206],
					pointerEvents: _[76]
				}), DomUtil.inject(this.hb, this.ba)
			},
			Gg: function(a, b) {
				var c, d, e, f;
				if (a = a ? a.replace(/[vV]/, _[3]) : _[213], b = b ? b.replace(/[vV]/, _[3]) : _[213], a == b) return !1;
				for (c = !1, a = a.split(_[214]), b = b.split(_[214]), d = Math.min(a.length, b.length), e = 0, f = 0; d > e && (f = parseInt(a[e]) - parseInt(b[e]), 0 == f);) e++;
				return 0 > f && (c = !0), c
			},
			hf: function() {
				this.K = !1;
				var a = j.plat,
					b = this.Oa,
					c = /chrome\//i.test(b),
					d = /chrome\/(\d+\.\d)/i.test(b) ? 1 * RegExp.$1 : null,
					e = /AppleWebKit\/(\d+\.\d)/i.test(b) ? 1 * RegExp.$1 : null,
					f = /MQQBrowser\/(\d+\.\d)/i.test(b) ? 1 * RegExp.$1 : null,
					g = /UCBrowser\//i.test(b),
					h = /UCBrowser\/(\d+(\.\d+){0,2})/i.test(b) ? RegExp.$1 : null,
					i = /SogouMobileBrowser\//i.test(b),
					k = /MiuiBrowser\//i.test(b),
					l = /Version\/4.0 Mobile/i.test(b),
					m = /baiduboxapp\//i.test(b),
					n = /baidubrowser\//i.test(b),
					o = /TBS\/(\d+)/i.test(b) ? 1 * RegExp.$1 : null;
				_[215] == a && (c && 42 > d && (this.K = !0), e && 537 > e && (this.K = !0), k && (this.K = !0), g && !this.Gg(_[216], h) && (this.K = !0), i && (this.K = !0), l && (this.K = !0), m && (this.K = !0, /chrome\/70.0.3538.110/i.test(b) && (this.K = !1), /chrome\/80.0.3987.99/i.test(b) && (this.K = !1), /chrome\/99.0.4844.88/i.test(b) && (this.K = !1), /chrome\/108.0.5359.128/i.test(b) && (this.K = !1)), n && (this.K = !0), /chrome\/45.0.2454.94/i.test(b) && (this.K = !1), /chrome\/44.0.2403.133/i.test(b) && (this.K = !1), f && f >= 7 && (this.K = !1), o && o >= 36824 && (this.K = !1)), (_[126] == a || _[127] == a || _[128] == a) && (g && (this.K = !0), f && (this.K = !0))
			},
			lf: function() {
				return JTUtil.support_WebGL() ? !0 : !1
			},
			kf: function() {
				this.Qd = 0 < this.Ob.search.indexOf(_[217]) ? !0 : !1
			},
			tg: function() {
				this.kf(), this.Qd && (this.hd = JTUtil.cDom(_[42]), DomUtil.setStyles(this.hd, {
					position: _[204],
					left: _[218],
					top: _[218],
					color: _[219],
					fontSize: _[220],
					zIndex: 9999,
					pointerEvents: _[76]
				}), DomUtil.inject(this.hd, this.target), this.jd = JTUtil.cDom(_[42]), DomUtil.setStyles(this.jd, {
					position: _[41],
					left: _[221],
					top: _[221],
					lineHeight: _[206],
					textShadow: _[222]
				}), DomUtil.inject(this.jd, this.hd), this.oc = JTUtil.cDom(_[223]), DomUtil.inject(this.oc, this.jd), DomUtil.setStyles(this.oc, {
					display: _[224],
					textAlign: _[223]
				}))
			},
			gd: function() {
				if (this.Qd) {
					var a = _[225] + this.u([49, 46, 48, 46, 49, 49, 57, 52]) + _[226] + this.width + _[227] + this.height + _[228] + this.Oa;
					this.oc && (this.oc.innerHTML = a)
				}
			},
			tb: function(a) {
				this.ib(), this.Hb = JTUtil.cDom(_[42]), DomUtil.setStyles(this.Hb, {
					position: _[204],
					left: _[218],
					top: _[229],
					color: _[219],
					fontSize: _[230],
					zIndex: 9999,
					opacity: .7,
					pointerEvents: _[76]
				}), DomUtil.inject(this.Hb, this.target), this.fd = JTUtil.cDom(_[42]), DomUtil.setStyles(this.fd, {
					position: _[41],
					left: _[221],
					top: _[231],
					lineHeight: _[232],
					textShadow: _[222]
				}), DomUtil.inject(this.fd, this.Hb), this.ed = JTUtil.cDom(_[223]), DomUtil.setStyles(this.ed, {
					display: _[224],
					textAlign: _[223]
				}), DomUtil.inject(this.ed, this.fd), this.ed.innerHTML = a
			},
			ib: function() {
				this.Hb && DomUtil.destroy(this.Hb)
			},
			Lf: function() {
				var b, a = JTUtil.cDom(_[42]);
				DomUtil.setStyles(a, {
					position: _[204],
					left: _[218],
					top: _[218],
					width: _[233],
					zIndex: 1,
					marginTop: _[234],
					marginLeft: _[235],
					backgroundColor: _[236],
					borderRadius: _[237],
					overflow: _[205]
				}), DomUtil.inject(a, this.target), b = JTUtil.cDom(_[42]), DomUtil.setStyles(b, {
					position: _[41],
					padding: _[238],
					textAlign: _[223],
					color: _[239]
				}), DomUtil.inject(b, a), b.innerHTML = this.u([30452, 25773, 25480, 26435, 35831, 32852, 31995, 65306, 60, 98, 114, 62, 60, 98, 114, 62, 30005, 35805, 65306, 48, 50, 49, 45, 53, 48, 50, 55, 54, 49, 57, 50, 32, 60, 98, 114, 62, 60, 98, 114, 62, 25163, 26426, 58, 49, 51, 52, 56, 50, 51, 53, 55, 49, 52, 55, 32, 60, 98, 114, 62, 60, 98, 114, 62, 81, 81, 65306, 57, 52, 51, 54, 48, 49, 49, 57, 57])
			},
			Ua: function(a) {
				return a * this.vb
			},
			Jd: function(a, b) {
				var c = this.width / 2,
					d = this.height / 2;
				return a = [(a - c) / c, -(b - d) / d, .9980020246002823, 1], b = mat4.create(), mat4.multiply(b, this.D, this.s), mat4.invert(b, b), vec4.transformMat4(a, a, b), b = a[0], c = a[1], d = a[2], _[70] == this.A ? (a = 180 * b + 180, b = 90 * c) : (a = Math.atan2(d, b) * this.sa, a = (a + 450 - this.pb) % 360, b = Math.atan2(c, Math.sqrt(b * b + d * d)) * this.sa), {
					pan: a,
					tilt: b
				}
			},
			Jc: function() {
				return 0 <= this.Oa.indexOf(_[240]) ? 1 : window.devicePixelRatio ? window.devicePixelRatio : 1
			},
			bd: function(a, b) {
				this.width = parseInt(a) || window.innerWidth, this.height = parseInt(b) || window.innerHeight, a = this.Jc(), this.Wb = this.width * a, this.Vb = this.height * a, this.Se = _[241]
			},
			yc: function(a) {
				var c, b = _[137];
				a.Z ? (2 != a.Z && _[137] != a.Z || (b = _[137]), 4 != a.Z && _[139] != a.Z || (b = _[139]), 5 != a.Z && _[138] != a.Z || (b = _[138]), 6 != a.Z && _[138] != a.Z || (b = _[138])) : (b = a.T / a.S, b = 1 === b ? _[139] : 4 === b ? _[138] : _[137]), a.is360pano = 6 == a.Z || 3 == a.Z ? 0 : 1, c = this.Na(window.location[_[242] + this.u([116, 110, 97]) + _[243]])
					.join(_[3]), (-1 != c.indexOf(this.Na(_[244] + this.u([112, 112, 46, 110]) + _[245])
						.join(_[3])) || -1 != c.indexOf(this.Na(_[246] + this.u([110, 97, 99, 108, 111, 117, 100, 46, 99]) + _[247])
						.join(_[3]))) && (a.is360pano = 0), a.Z = b
			},
			ge: function(a) {
				var b = this;
				b.mf ? (a.N = 1, b.Ad()) : (new K.ia({
						x: 0
					})
					.la({
						x: 1
					}, 800)
					.na(K.Y.ta.R)
					.ja(function() {
						a.N = this.x
					})
					.ua(function() {
						b.Ad()
					})
					.start(), _[70] == a.A && this.jb && a.L != this.jb && this.re(this.jb))
			},
			Ad: function() {
				if (this.Cd(this.jb), this.tc(), this.api_autoPlay(), this.fc && this.fc(), this.ob = !1, 0 < this.Db.length) {
					var a = this.Db[this.Db.length - 1];
					this.Db = [], a()
				}
			},
			Th: function(a) {
				var b, c, d, e;
				for (b = a.getSupportedExtensions(), c = [_[248], _[249], _[250]], d = 0; d < b.length; d++)
					for (e = 0; e < c.length; e++)
						if (0 < b[d].indexOf(c[e])) return b = a.getExtension(b[d]), {
							type: c[e],
							Kh: b,
							Lh: a.getParameter(a.COMPRESSED_TEXTURE_FORMATS)
						}
			},
			hh: function() {
				this.Fa = JTUtil.cDom(this.u([99, 97, 110, 118, 97, 115])), DomUtil.setStyles(this.Fa, {
					position: _[204],
					width: _[206],
					height: _[206],
					left: _[208],
					top: _[208]
				}), DomUtil.inject(this.Fa, this.hb)
			},
			jh: function() {
				for (var a = null, b = {
					alpha: !1,
					depth: !0,
					stencil: !1,
					antialias: !0,
					premultipliedAlpha: !0,
					preserveDrawingBuffer: this.preserveDrawingBuffer,
					xrCompatible: !0
				}, c = 0; 4 > c && !(a = this.Fa.getContext([_[251], _[252], _[253], _[254]][c], b)); c++);
				a.frontFace(a.CCW), a.enable(a.CULL_FACE), a.cullFace(a.BACK), a.enable(a.BLEND), a.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.a = a
			},
			Pg: function() {
				this.a.clearColor(0, 0, 0, 1)
			},
			nh: function() {
				this.a && (this.Pg(), this.Fa.width = this.Wb, this.Fa.height = this.Vb, this.Fa.style.width = this.width + _[22], this.Fa.style.height = this.height + _[22])
			},
			Ae: function(a, b) {
				return a = this.a.createShader(a), this.a.shaderSource(a, b.join(_[255])), this.a.compileShader(a), a
			},
			ih: function(a, b) {
				var c = this.a.createProgram();
				return a = this.Ae(this.a.VERTEX_SHADER, a), b = this.Ae(this.a.FRAGMENT_SHADER, b), this.a.attachShader(c, a), this.a.attachShader(c, b), this.a.linkProgram(c), this.a.deleteShader(a), this.a.deleteShader(b), this.a.getProgramParameter(c, this.a.LINK_STATUS) || console.log(_[256]), c
			},
			gh: function() {
				this.Dc = this.ih(this.Jg, this.uf), this.rd(), this.ah(this.Dc)
			},
			rd: function(a) {
				this.a.useProgram(a || this.Dc)
			},
			ah: function(a) {
				a = a ? a : this.Dc, this.B.kd = this.a.getAttribLocation(a, _[257]), this.B.da = this.a.getAttribLocation(a, _[258]), this.B.Rc = this.a.getUniformLocation(a, _[122]), this.B.Hf = this.a.getUniformLocation(a, _[134]), this.B.Bg = this.a.getUniformLocation(a, _[259]), this.B.Cg = this.a.getUniformLocation(a, _[260]), this.B.zg = this.a.getUniformLocation(a, _[261]), this.B.Ag = this.a.getUniformLocation(a, _[262]), this.B.Qf = this.a.getUniformLocation(a, _[263]), this.B.$f = this.a.getUniformLocation(a, _[264]), this.B.tf = this.a.getUniformLocation(a, _[265]), this.B.Oc = this.a.getUniformLocation(a, _[266]), this.a.enableVertexAttribArray(this.B.kd), this.a.enableVertexAttribArray(this.B.da), this.F(1, 0, 1, 0)
			},
			Fe: function(a) {
				var b = /iphone|ipod|ipad/gi.test(navigator.platform),
					c = /AppleWebKit\/(\d+\.\d)/i.test(this.Oa) ? 1 * RegExp.$1 : null,
					d = !1;
				c && c >= 603 && 604 > c && (d = !0), b && d && a && _[79] == a.va && _[82] == a.wb ? this.a.uniform1i(this.B.Oc, 1) : this.a.uniform1i(this.B.Oc, 0)
			},
			X: function(a, b, c) {
				b = b || this.D, this.a.uniformMatrix4fv(this.B.Qf, !1, a || this.s), this.a.uniformMatrix4fv(this.B.$f, !1, b), this.a.uniform1f(this.B.tf, isNaN(c) ? 1 : c)
			},
			F: function(a, b, c, d) {
				this.a.uniform1fv(this.B.Bg, new Float32Array([a])), this.a.uniform1fv(this.B.zg, new Float32Array([b])), this.a.uniform1fv(this.B.Cg, new Float32Array([c])), this.a.uniform1fv(this.B.Ag, new Float32Array([d]))
			},
			ab: function(a, b) {
				this.a.bindTexture(this.a.TEXTURE_2D, a), this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MAG_FILTER, this.a.LINEAR), this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MIN_FILTER, this.a.LINEAR), this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_S, this.a.CLAMP_TO_EDGE), this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_T, this.a.CLAMP_TO_EDGE), this.a.texImage2D(this.a.TEXTURE_2D, 0, this.a.RGBA, this.a.RGBA, this.a.UNSIGNED_BYTE, b), this.a.bindTexture(this.a.TEXTURE_2D, null)
			},
			od: function(a) {
				a && a.xa && (this.a.deleteBuffer(a.xa), this.a.deleteBuffer(a.ub), this.a.deleteBuffer(a.ga), this.a.deleteTexture(a.da))
			},
			ze: function() {
				this.Ra = {}
			},
			ph: function() {
				var e, f, a = {},
					b = !1,
					c = [],
					d = this.l;
				for (f in d.ra) - 1 === f.indexOf(_[267]) ? (a[_[267] + f] = d.ra[f], b = !0) : c.push(f);
				if (b)
					for (b = 0, e = c.length; e > b; b++) f = c[b], this.od(d.ra[f]);
				else
					for (b = 0, e = c.length; e > b; b++) f = c[b], a[f] = d.ra[f];
				d.ra = a, this.Ra = {}
			},
			Pa: function(a) {
				this.a.bindBuffer(this.a.ARRAY_BUFFER, a.xa), this.a.vertexAttribPointer(this.B.kd, a.xa.cc, this.a.FLOAT, !0, 0, 0), this.a.bindBuffer(this.a.ARRAY_BUFFER, a.ub), this.a.vertexAttribPointer(this.B.da, a.ub.cc, this.a.FLOAT, !0, 0, 0), this.a.bindTexture(this.a.TEXTURE_2D, a.da), this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, a.ga)
			},
			rh: function() {
				this.api_setDBViewIPD(this.zb), this.oh(), this.hh(), this.jh(), this.gh(), this.og(), this.Of(), this.Nf(), this.Mf()
			},
			Ge: function() {
				window.cancelAnimationFrame(this.Sd), this.Ee(0), this.O && this.api_OpenGyro()
			},
			fi: function(a, b) {
				return a = parseFloat(a), b = parseFloat(b), {
					x: 2 * a / 180,
					y: Math.log(Math.tan((90 + b) * Math.PI / 360)) / this.vb / 180
				}
			},
			ji: function(a, b) {
				return [180 * (a / 2), this.sa * (2 * Math.atan(Math.exp(180 * (b / 1) * this.vb)) - Math.PI / 2)]
			},
			Og: function() {
				var a, b;
				for (this.oa && this.Kf(), this.lb && this.Tf(), this.Va && this.Aa && this.Oe(), this.rd(), a = 0; a < this.ka.length; a++) b = this.ka[a], this.Fe(b), b.Ba && b.Dd()
			},
			Tg: function() {
				var a = this.P,
					b = mat4.create(),
					c = mat4.create(),
					d = this.ea();
				this.X(c, b), this.Pa(a), this.F(1, 0, 1, 0, 1), this.a.viewport(d.j - a.Hg, d.i - a.Kg, a.Jb, a.Ib), this.a.drawElements(this.a.TRIANGLES, a.ga.ha, this.a.UNSIGNED_SHORT, 0)
			},
			Sg: function() {
				var a = this.yb,
					b = mat4.create(),
					c = mat4.create(),
					d = this.ea();
				this.X(c, b), this.Pa(a), this.F(1, 0, 1, 0, 1), this.a.viewport(d.j / 2 - a.Jb / 2, d.i / 2 - a.Ib / 2, a.Jb, a.Ib), this.a.drawElements(this.a.TRIANGLES, a.ga.ha, this.a.UNSIGNED_SHORT, 0)
			},
			Ng: function(a) {
				var b = a.ga.ha,
					c = this.ea(),
					d = a.Eb ? mat4.create() : a.D,
					e = a.Eb ? mat4.create() : a.s;
				this.X(e, d, a.N), this.F(1, 0, 1, 0), this.qa ? c.j > c.i ? a.Eb ? (a = JTUtil.getBestFitSize(a.T, a.S, .5 * c.j, c.i), this.a.viewport(a.left, a.top, a.width, a.height), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0), this.a.viewport(.5 * c.j + a.left, a.top, a.width, a.height)) : (this.a.viewport(0, 0, .5 * c.j, c.i), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0), this.a.viewport(.5 * c.j, 0, .5 * c.j, c.i)) : a.Eb ? (a = JTUtil.getBestFitSize(a.T, a.S, c.j, .5 * c.i), this.a.viewport(a.left, a.top, a.width, a.height), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0), this.a.viewport(a.left, a.top + .5 * c.i, a.width, a.height)) : (this.a.viewport(0, 0, c.j, .5 * c.i), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0), this.a.viewport(0, .5 * c.i, c.j, .5 * c.i)) : a.Eb ? (a = JTUtil.getBestFitSize(a.T, a.S, c.j, c.i), this.a.viewport(a.left, a.top, a.width, a.height)) : this.a.viewport(0, 0, c.j, c.i), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0)
			},
			Vg: function(a) {
				_[137] == a.Z ? this.Qg(a) : this.Rg(a), a.W && this.pd(a)
			},
			Qg: function(a) {
				var b, c;
				this.g.ca ? this.Mb(a) : (b = this.Na(this.Ob[_[268] + this.u([115, 116, 110, 97]) + _[243]])
					.join(_[3]), (-1 != b.indexOf(this.Na(_[269] + this.u([97, 112, 112, 46, 110]) + _[245])
						.join(_[3])) || -1 != b.indexOf(this.Na(_[270] + this.u([101, 110, 97, 99, 108, 111, 117, 100, 46, 99]) + _[247])
						.join(_[3]))) && (a.N = .6), b = a.ga.ha, c = this.ea(), this.X(a.s, a.D, a.N), this.F(1, 0, 1, 0), this.qa ? (c.j > c.i ? (this.a.viewport(0, 0, .5 * c.j, c.i), this.dc && this.X(this.Lc, this.dc, a.N), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0), this.a.viewport(.5 * c.j, 0, .5 * c.j, c.i)) : (this.a.viewport(0, 0, c.j, .5 * c.i), this.dc && this.X(this.Lc, this.dc, a.N), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0), this.a.viewport(0, .5 * c.i, c.j, .5 * c.i)), this.ke && this.X(this.Lc, this.ke, a.N)) : this.a.viewport(0, 0, c.j, c.i), this.a.drawElements(this.a.TRIANGLES, b, this.a.UNSIGNED_SHORT, 0))
			},
			Rg: function(a) {
				var c, d, b = a.Z;
				this.g.ca ? this.Mb(a, b) : (c = this.ea(), d = a.ga.ha, this.X(a.s, a.D, a.N), this.qa ? c.j > c.i ? (_[138] == b && this.F(.5, 0, 1, 0), _[139] == b && this.F(1, 0, .5, 0), this.a.viewport(0, 0, .5 * c.j, c.i), this.a.drawElements(this.a.TRIANGLES, d, this.a.UNSIGNED_SHORT, 0), _[138] == b && this.F(.5, .5, 1, 0), _[139] == b && this.F(1, 0, .5, .5), this.a.viewport(.5 * c.j, 0, .5 * c.j, c.i)) : (_[138] == b && this.F(.5, 0, 1, 0), _[139] == b && this.F(1, 0, .5, 0), this.a.viewport(0, 0, c.j, .5 * c.i), this.a.drawElements(this.a.TRIANGLES, d, this.a.UNSIGNED_SHORT, 0), _[138] == b && this.F(.5, .5, 1, 0), _[139] == b && this.F(1, 0, .5, .5), this.a.viewport(0, .5 * c.i, c.j, .5 * c.i)) : (_[138] == b && this.F(.5, 0, 1, 0), _[139] == b && this.F(1, 0, .5, 0), this.a.viewport(0, 0, c.j, c.i)), this.a.drawElements(this.a.TRIANGLES, d, this.a.UNSIGNED_SHORT, 0))
			},
			Ug: function(a) {
				if (this.g.ca) this.Mb(a);
				else {
					var b = this.ea();
					this.X(a.s, a.D, a.N), this.F(1, 0, 1, 0), this.qa ? b.j > b.i ? (this.a.viewport(0, 0, .5 * b.j, b.i), this.a.drawArrays(this.a.TRIANGLES, 0, a.xa.ha), this.a.viewport(.5 * b.j, 0, .5 * b.j, b.i)) : (this.a.viewport(0, 0, b.j, .5 * b.i), this.a.drawArrays(this.a.TRIANGLES, 0, a.xa.ha), this.a.viewport(0, .5 * b.i, b.j, .5 * b.i)) : this.a.viewport(0, 0, b.j, b.i), this.a.drawArrays(this.a.TRIANGLES, 0, a.xa.ha)
				}
			},
			Be: function(a) {
				if (this.g.ca) this.Mb(a);
				else {
					var b = this.ea();
					this.X(a.s, a.D, a.N), this.F(1, 0, 1, 0), a = a.ga.ha, this.qa ? b.j > b.i ? (this.a.viewport(0, 0, .5 * b.j, b.i), this.a.drawElements(this.a.TRIANGLES, a, this.a.UNSIGNED_SHORT, 0), this.a.viewport(.5 * b.j, 0, .5 * b.j, b.i)) : (this.a.viewport(0, 0, b.j, .5 * b.i), this.a.drawElements(this.a.TRIANGLES, a, this.a.UNSIGNED_SHORT, 0), this.a.viewport(0, .5 * b.i, b.j, .5 * b.i)) : this.a.viewport(0, 0, b.j, b.i), this.a.drawElements(this.a.TRIANGLES, a, this.a.UNSIGNED_SHORT, 0)
				}
			},
			pd: function(a) {
				var b, c, d;
				if (!JTUtil.isEmptyObject(a.ra)) {
					b = this.ea(), this.g.ca && a.L != this.L && mat4.multiply(this.g.Zb, this.g.s, a.s), this.F(1, 0, 1, 0);
					for (c in a.ra) d = a.ra[c], this.g.ca ? a.L != this.L ? this.X(this.g.Zb, this.g.D, d.N) : this.X(this.g.Ja, this.g.D, d.N) : this.X(a.s, a.D, a.N), this.Wg(d, b, c)
				}
			},
			Wg: function(a, b) {
				this.Pa(a), this.g.ca ? this.Mb(a, null, !0) : (a = a.ga.ha, this.qa ? b.j > b.i ? (this.a.viewport(0, 0, .5 * b.j, b.i), this.a.drawElements(this.a.TRIANGLES, a, this.a.UNSIGNED_SHORT, 0), this.a.viewport(.5 * b.j, 0, .5 * b.j, b.i)) : (this.a.viewport(0, 0, b.j, .5 * b.i), this.a.drawElements(this.a.TRIANGLES, a, this.a.UNSIGNED_SHORT, 0), this.a.viewport(0, .5 * b.i, b.j, .5 * b.i)) : this.a.viewport(0, 0, b.j, b.i), this.a.drawElements(this.a.TRIANGLES, a, this.a.UNSIGNED_SHORT, 0))
			},
			Ce: function(a) {
				return _[67] == a.A ? this.bh() : _[135] == a.A ? this.$g() : _[70] == a.A ? {
					I: [-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1],
					H: [0, 1, 1, 1, 0, 0, 1, 0],
					G: [0, 1, 2, 1, 3, 2]
				} : _[136] == a.A ? this.Xg() : void 0
			},
			gi: function() {
				return {
					I: [1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1],
					H: [.1666666666666667, 1, 0, 1, 0, 0, .1666666666666667, 0, .3333333333333333, 1, .1666666666666667, 1, .1666666666666667, 0, .3333333333333333, 0, .5, 1, .3333333333333333, 1, .3333333333333333, 0, .5, 0, .6666666666666667, 1, .5, 1, .5, 0, .6666666666666667, 0, .6666666666666667, 0, .8333333333333333, 0, .8333333333333333, 1, .6666666666666667, 1, 1, 1, .8333333333333333, 1, .8333333333333333, 0, 1, 0],
					G: [0, 2, 1, 0, 3, 2, 4, 6, 5, 4, 7, 6, 8, 10, 9, 8, 11, 10, 12, 14, 13, 12, 15, 14, 16, 18, 17, 16, 19, 18, 20, 22, 21, 20, 23, 22]
				}
			},
			Xg: function() {
				var a = [1, 1, 0, 1, 0, 0, 1, 0],
					b = [0, 2, 1, 0, 3, 2];
				return [{
					I: [1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1],
					H: a,
					G: b
				}, {
					I: [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
					H: a,
					G: b
				}, {
					I: [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1],
					H: a,
					G: b
				}, {
					I: [1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1],
					H: a,
					G: b
				}, {
					I: [1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1],
					H: [0, 0, 1, 0, 1, 1, 0, 1],
					G: b
				}, {
					I: [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1],
					H: a,
					G: b
				}]
			},
			Yg: function(a, b, c, d, e, f) {
				var h, g = -(2 * (b / d) - 1);
				return b = -(2 * ((b + f) / d) - 1), d = -(2 * (a / c) - 1), a = -(2 * ((a + e) / c) - 1), c = (g + b) / 2, e = (d + a) / 2, f = [0, 1, 1, 1, 1, 0, 0, 0], h = [0, 1, 2, 0, 2, 3], [{
					I: [1, a, -g, 1, a, -b, 1, d, -b, 1, d, -g],
					H: f,
					G: h,
					za: [1, e, -c],
					Ia: [1, a, -g, 1, a, -b, 1, d, -b, 1, d, -g]
				}, {
					I: [g, a, 1, b, a, 1, b, d, 1, g, d, 1],
					H: f,
					G: h,
					za: [c, e, 1],
					Ia: [g, a, 1, b, a, 1, b, d, 1, g, d, 1]
				}, {
					I: [-1, a, g, -1, a, b, -1, d, b, -1, d, g],
					H: f,
					G: h,
					za: [-1, e, c],
					Ia: [-1, a, g, -1, a, b, -1, d, b, -1, d, g]
				}, {
					I: [-g, a, -1, -b, a, -1, -b, d, -1, -g, d, -1],
					H: f,
					G: h,
					za: [-c, e, -1],
					Ia: [-g, a, -1, -b, a, -1, -b, d, -1, -g, d, -1]
				}, {
					I: [g, 1, -a, b, 1, -a, b, 1, -d, g, 1, -d],
					H: f,
					G: [0, 1, 2, 0, 2, 3],
					za: [c, 1, -e],
					Ia: [g, 1, -a, b, 1, -a, b, 1, -d, g, 1, -d]
				}, {
					I: [g, -1, a, b, -1, a, b, -1, d, g, -1, d],
					H: f,
					G: h,
					za: [c, -1, e],
					Ia: [g, -1, a, b, -1, a, b, -1, d, g, -1, d]
				}]
			},
			bh: function() {
				var a, b, c, d, e, f, g, h, i, j, k, l, m;
				for (a = [], b = [], c = [], d = [], e = 0; 36 >= e; e++)
					for (f = e * Math.PI / 36, g = Math.sin(f), f = Math.cos(f), h = 0; 72 >= h; h++) i = 2 * h * Math.PI / 72, j = Math.cos(i) * g, k = f, i = Math.sin(i) * g, l = h / 72, m = e / 36, b.push(j), b.push(k), b.push(i), c.push(l), c.push(m), a.push(j), a.push(k), a.push(i), 36 != e && 72 != h && (j = 73 * e + h, k = j + 73, d.push(j), d.push(k), d.push(j + 1), d.push(k), d.push(k + 1), d.push(j + 1));
				return {
					Xf: b,
					H: c,
					I: a,
					G: d
				}
			},
			hi: function() {
				return {
					I: [-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1],
					H: [0, 1, 1, 1, 0, 0, 1, 0],
					G: [0, 1, 2, 1, 3, 2]
				}
			},
			Zg: function(a, b, c, d, e, f) {
				var g = 2 * (b / d) - 1;
				return b = 2 * ((b + f) / d) - 1, d = -(2 * (a / c) - 1), a = -(2 * ((a + e) / c) - 1), {
					I: [g, a, -1, b, a, -1, g, d, -1, b, d, -1],
					H: [0, 1, 1, 1, 0, 0, 1, 0],
					G: [0, 1, 2, 1, 3, 2],
					za: [(g + b) / 2, (d + a) / 2, -1],
					Ia: [g, d, -1, b, d, -1, g, a, -1, b, a, -1]
				}
			},
			$g: function() {
				var a = Math.sqrt(Math.pow(5, 2) + Math.pow(5, 2)) / 2;
				return a = 5 * a / (Math.sqrt(Math.pow(5, 2) + Math.pow(a, 2)) + a), {
					I: [0, 0, a - 5, -5, 0, a, 0, -5, a, 0, 0, a - 5, 0, -5, a, 5, 0, a, 0, 0, a - 5, 5, 0, a, 0, 5, a, 0, 0, a - 5, 0, 5, a, -5, 0, a, -5, 0, a, 0, 5, a, 0, -5, a, 0, -5, a, 0, 5, a, 5, 0, a],
					H: [1, 1, 1, .5, .5, 1, 0, 1, .5, 1, 0, .5, 0, 0, 0, .5, .5, 0, 1, 0, .5, 0, 1, .5, 1, .5, .5, 0, .5, 1, .5, 1, .5, 0, 0, .5],
					G: [0, 1, 2]
				}
			},
			dh: function(a, b, c, d, e, f) {
				var n, o, p, q, r, s, g = [],
					h = [],
					i = [],
					j = a + e / 2,
					k = b + f / 2,
					l = (a + e - a) / 24,
					m = (b + f - b) / 24;
				for (f = [], n = 0; 24 >= n; n++)
					for (e = (a + l * n) * Math.PI / c, o = Math.sin(e), p = Math.cos(e), q = 0; 24 >= q; q++) e = 2 * (b + m * q) * Math.PI / d, r = Math.sin(e), s = Math.cos(e), s *= o, e = p, r *= o, g.push(s), g.push(e), g.push(r), 0 == n && 0 == q && (f.push(s), f.push(e), f.push(r)), 0 == n && 12 == q && (f.push(s), f.push(e), f.push(r)), 0 == n && 24 == q && (f.push(s), f.push(e), f.push(r)), 12 == n && 0 == q && (f.push(s), f.push(e), f.push(r)), 12 == n && 12 == q && (f.push(s), f.push(e), f.push(r)), 12 == n && 24 == q && (f.push(s), f.push(e), f.push(r)), 24 == n && 0 == q && (f.push(s), f.push(e), f.push(r)), 24 == n && 12 == q && (f.push(s), f.push(e), f.push(r)), 24 == n && 24 == q && (f.push(s), f.push(e), f.push(r));
				for (e = 0; 24 >= e; e++)
					for (s = 0; 24 >= s; s++) a = s / 24, b = e / 24, h.push(a), h.push(b);
				for (e = 0; 24 > e; e++)
					for (s = 0; 24 > s; s++) a = 25 * e + s, b = a + 25, i.push(a), i.push(b), i.push(a + 1), i.push(b), i.push(b + 1), i.push(a + 1), a = s / 24, b = e / 24, h.push(a), h.push(b);
				return a = [], e = j * Math.PI / c, o = Math.sin(e), p = Math.cos(e), e = 2 * k * Math.PI / d, r = Math.sin(e), s = Math.cos(e), e = p, r *= o, a.push(s * o), a.push(e), a.push(r), {
					H: h,
					I: g,
					G: i,
					za: a,
					Ia: f
				}
			},
			ii: function(a, b, c, d) {
				var k, l, m, n, o, p, q, e = [],
					f = [],
					g = [],
					h = [],
					i = 1 * (1e4 * a)
					.toFixed(0),
					j = 1 * (1e4 * b)
					.toFixed(0);
				for (a += c / 2, b += d / 2, c = (i + 1 * (1e4 * c)
					.toFixed(0) - i) / 48, k = (j + 1 * (1e4 * d)
					.toFixed(0) - j) / 48, l = 0; 48 >= l; l++)
					for (d = (i + c * l) / 1e4 * Math.PI / 180, m = Math.sin(d), n = Math.cos(d), o = 0; 48 >= o; o++) d = 2 * ((j + k * o) / 1e4) * Math.PI / 360, p = Math.sin(d), q = Math.cos(d), q *= m, d = n, p *= m, f.push(q), f.push(d), f.push(p), e.push(q), e.push(d), e.push(p);
				for (d = 0; 48 >= d; d++)
					for (q = 0; 48 >= q; q++) i = q / 48, j = d / 48, g.push(i), g.push(j);
				for (d = 0; 48 > d; d++)
					for (q = 0; 48 > q; q++) i = 49 * d + q, j = i + 49, h.push(i), h.push(j), h.push(i + 1), h.push(j), h.push(j + 1), h.push(i + 1), i = q / 48, j = d / 48, g.push(i), g.push(j);
				return i = [], d = a * Math.PI / 180, m = Math.sin(d), n = Math.cos(d), d = 2 * b * Math.PI / 360, p = Math.sin(d), q = Math.cos(d), d = n, p *= m, i.push(q * m), i.push(d), i.push(p), {
					Xf: f,
					H: g,
					I: e,
					G: h,
					za: i
				}
			},
			oh: function() {
				this.Fa = this.a = null, this.Jg = [_[271], _[272], _[273], _[274], _[275], _[276], _[277], _[278], _[279]], this.Qe = _[280], this.Re = _[281], this.uf = [_[282], _[283], _[284], _[285], _[286], _[287], _[287], _[288], _[289], _[290], _[291], _[292], _[293], _[294], _[295], _[296], _[297], _[298], _[299], _[300], _[301], _[302], _[303], _[304], _[305], _[306], _[307], _[308], _[309], _[306], _[310], _[311], _[312], _[313], _[314], _[311], _[315], _[313], _[308], _[316], _[317], _[304], _[318], _[319], _[316], _[320], _[304], _[321], _[322], _[323], _[319], _[324], _[279]], this.B = {}, this.m = null, this.Xa = !1, this.ka = []
			},
			ac: function(a) {
				for (var b = null, c = this.ka.length, d = 0; c > d; d++)
					if (this.ka[d].L === a) {
						b = this.ka[d];
						break
					} return b
			},
			Cd: function(a) {
				var b, c, d, e;
				for (b = null, c = 0, d = 0; d < this.ka.length; d++)
					if (this.ka[d].L == a) {
						c = d, b = this.ka[d];
						break
					} if (b) {
					this.od(b);
					for (e in b.ra) this.od(b.ra[e]);
					this.ka.splice(c, 1)
				}
			},
			Nb: function(a, b) {
				return b = b || {}, b.da = this.a.createTexture(), b.ub = this.a.createBuffer(), b.xa = this.a.createBuffer(), b.ga = this.a.createBuffer(), this.He(a, b), b
			},
			He: function(a, b) {
				this.a.bindBuffer(this.a.ARRAY_BUFFER, b.ub), this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(a.H), this.a.STATIC_DRAW), b.ub.cc = 2, b.ub.ha = .5 * a.H.length, this.a.bindBuffer(this.a.ARRAY_BUFFER, b.xa), this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(a.I), this.a.STATIC_DRAW), b.xa.cc = 3, b.xa.ha = a.I.length / 3, this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, b.ga), this.a.bufferData(this.a.ELEMENT_ARRAY_BUFFER, new Uint16Array(a.G), this.a.STATIC_DRAW), b.ga.cc = 1, b.ga.ha = a.G.length
			},
			ea: function() {
				var e, a = this.Wb,
					b = this.Vb,
					c = this.width,
					d = this.height;
				return this.qa ? a > b ? (c *= .5, e = .5 * a / b) : (d *= .5, e = a / (.5 * b)) : e = a / b, {
					sd: e,
					j: a,
					i: b,
					Ma: c,
					wa: d
				}
			},
			Ga: function(a) {
				var g, h, i, b = this.C,
					c = this.zf(),
					d = this.v,
					e = this.U,
					f = this.ea()
					.sd;
				this.lb && _[70] == this.A && mat4.copy(this.ce, this.D), mat4.perspective(this.D, this.Ua(c), f, .001, 1e3), 0 != e && mat4.translate(this.D, this.D, [0, 0, e]), a ? (a.rotateX(this.Ua(b)), b = [a.x, a.y, a.z, a.w], quat.invert(b, b), b = mat4.fromQuat([], b), mat4.rotateX(b, b, this.Ua(90)), mat4.rotateY(b, b, this.Ua(90)), mat4.rotateY(b, b, this.Ua(d)), this.s = b) : (mat4.identity(this.s), _[70] == this.A ? (a = this.l.T, c = this.l.S, a && c && (this.lb && (f = this.Bd.getBoundingClientRect(), e = this.clientX - f.left, f = this.clientY - f.top, g = this.width / 2, h = this.height / 2, e = (e - g) / g, f = -(f - h) / h, g = [1, 1, -1], vec3.transformMat4(g, g, this.ce), h = e / g[0], i = f / g[1], g[0] = 1, g[1] = 1, g[2] = -1, vec3.transformMat4(g, g, this.D), f /= g[1], d -= 180 * (e / g[0] - h) * (a > c ? 1 : c / a), b -= 90 * (f - i) * (c > a ? 1 : a / c), this.fb(d), this.Sa(b)), a > c ? mat4.scale(this.s, this.s, [1, c / a, 1]) : mat4.scale(this.s, this.s, [a / c, 1, 1]), mat4.translate(this.s, this.s, [-(d - 180) / 180, -b / 90, 0]))) : (mat4.rotateX(this.s, this.s, this.Ua(-b)), mat4.rotateY(this.s, this.s, this.Ua(d + this.pb))), this.Af = 0), this.$c = !0, this.qe && this.qe()
			},
			Of: function() {
				this.Ha = JTUtil.cDom(this.u([99, 97, 110, 118, 97, 115])), this.Ha.setAttribute(_[72], _[73]), this.cf = this.Ha.getContext(_[74]), this.Te = _[325], this.Ue = _[326], this.Ve = _[327], this.We = _[328]
			},
			Vc: function() {
				var a = JTUtil.cDom(_[329]);
				return a.setAttribute(_[330], !0), a.setAttribute(_[331], _[332]), a.setAttribute(_[333], _[334]), a.setAttribute(_[335], !0), a.setAttribute(_[72], _[73]), a.setAttribute(_[336], _[337]), a.setAttribute(_[338], _[339]), a
			},
			ec: function(a, b, c, d) {
				var e = !0;
				!1 === d && (e = !1), d = new Image, e && (d.crossOrigin = _[73]), d.onload = function() {
					b && b(this)
				}, d.onerror = function() {
					c && c(this)
				}, d.src = a
			},
			Uc: function(a, b, c, d, e, f, g) {
				a.ig = c || 0, a.Fd = f, a.Gd = g, a.Ya = e;
				for (var h in d) this.rc[h] = EventUtil.addEvent(a, h, d[h].bind(this));
				return this.Pf(a, b), a.load(), this.ib(), a
			},
			Pf: function(a, b) {
				var e, c = JTUtil.getFileExt(b)
					.substring(0, 5),
					d = b.indexOf(_[340]);
				this.Ud = !1, _[125] == c || _[341] == c ? (e = this, JTUtil.loadResource(b, function(c) {
					if (e.mb = 0 >= c.indexOf(_[342]) ? !0 : !1, e.mb && !e.f) e.api_playerError(4);
					else if (-1 < c.indexOf("_[343]")) e.Ud = !0, e.api_playerError(1);
					else if (j.isMobile) {
						c = j.plat;
						var d = navigator.userAgent,
							f = /chrome\//i.test(d),
							g = /chrome\/(\d+\.\d)/i.test(d) ? 1 * RegExp.$1 : null;
						/TBS\/(\d+)/i.test(d), _[215] == c && f && g >= 70 && window.Hls && window.Hls.isSupported() ? (c = a, e.aa && (e.aa.destroy(), e.aa = null), e.aa = new window.Hls({
							Rf: 15
						}), e.aa.attachMedia(c), e.aa.loadSource(b)) : a.src = b
					} else window.Hls && window.Hls.isSupported() ? _[344] == j.plat && _[345] == j.type ? a.src = b : (c = a, e.aa && (e.aa.destroy(), e.aa = null), e.aa = new window.Hls({
						Rf: 15
					}), e.aa.attachMedia(c), e.aa.loadSource(b)) : e.api_playerError(6)
				})) : 0 === d ? (this.mb = !0, this.f ? (a.src = b, window.enableInlineVideo && window.enableInlineVideo(this.m, !this.m.hasAttribute(_[346]), !0)) : this.api_playerError(4)) : _[347] == c ? window.flvjs && window.flvjs.isSupported() ? (c = window.flvjs.Ih({
					type: _[348],
					url: b
				}), c.attachMediaElement(a), c.load()) : this.api_playerError(66666) : (a.src = b, window.enableInlineVideo && window.enableInlineVideo(this.m, !this.m.hasAttribute(_[346]), !0))
			},
			ff: function(a, b, c, d) {
				this.tb(this.u([20999, 25442, 20013, 46, 46, 46, 46, 46, 46])), this.Uc(this.m, a, b, {}, !0, c, d), this.mb && this.m.Ya && setTimeout(this.api_setVideoPlay.bind(this), 500)
			},
			ef: function(a) {
				var b = this;
				this.tb(this.u([20999, 25442, 20013, 46, 46, 46, 46, 46, 46])), this.ec(a, function(a) {
					b.ib(), this.T = a.width, this.S = a.height;
					var c = b.ac(b.L);
					b.yc(this.T, this.S, _[78], c), b.a.bindTexture(b.a.TEXTURE_2D, c.da), b.a.texImage2D(b.a.TEXTURE_2D, 0, b.a.RGBA, b.a.RGBA, b.a.UNSIGNED_BYTE, a), b.a.bindTexture(b.a.TEXTURE_2D, null), b.fc && b.fc()
				}, function() {
					b.tb(decodeURI(d[i]))
				})
			},
			Nf: function() {
				this.Xe = _[349];
				var a = this.u([100, 97, 116, 97, 58, 105, 109, 97, 103, 101, 47, 112, 110, 103, 59, 98, 97, 115, 101, 54, 52, 44]),
					b = [this.Qe, _[3], _[3], _[350], _[351], this.Re, _[3], _[352], _[353], _[354], _[355], this.Se, _[356], this.Ve, this.We, _[3], _[357], _[358], _[359], this.Te, _[360], _[361], this.Ue, _[362], _[363], this.Xe],
					c = this.Jc(),
					d = 15 / c,
					e = _[3],
					f = c;
				e = {
					I: [-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1],
					H: [0, 1, 1, 1, 0, 0, 1, 0],
					G: [0, 1, 2, 1, 3, 2]
				}, !this.P && (this.P = this.Nb(e)), 1 === this.xb ? (this.gb = this.Je, f = 1.2, e = a + this.gb) : (f = 2, this.gb = b.join(_[364]), e = a + this.gb), this.ec(e, function(a) {
					var b = a.width,
						e = a.height,
						g = b / f,
						h = e / f;
					this.P.Ig = d, this.P.Jb = g * c, this.P.Ib = h * c, this.P.Hg = g * c + d, this.P.Kg = h * c + d, this.P.eg = b, this.P.dg = e, this.P.Ba = !0, this.ab(this.P.da, a)
				}.bind(this), null, !1)
			},
			Mf: function() {
				var b, c, a = document.createElement(this.u([99, 97, 110, 118, 97, 115]));
				a.width = 270, a.height = 60, b = a.getContext(_[74]), b.clearRect(0, 0, a.width, a.height), this.lg(b, {
					font: _[365],
					textAlign: _[223],
					textBaseline: _[366],
					fillStyle: _[236]
				}), c = this.Kc() + _[367] + this.ag, b.fillText(c, 135, 20), c = this.u([169]) + unescape(_[368]), b.fillText(c, 135, 40), this.yb = this.Nb({
					I: [-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1],
					H: [0, 1, 1, 1, 0, 0, 1, 0],
					G: [0, 1, 2, 1, 3, 2]
				}), this.yb.Jb = 270, this.yb.Ib = 60, this.yb.Ba = !0, this.ab(this.yb.da, a)
			},
			lh: function(a) {
				var b = this;
				this.ec(a.jc, function(c) {
					a.T = c.width || a.T, a.S = c.height || a.S, b.Id || b.ye(), _[70] == a.A && b.Ga(), b.yc(a), b.fh(c, a), b.ib()
				}, function() {
					b.tb(decodeURI(d[i]))
				})
			},
			mh: function(a, b, c, d, e) {
				var f = document.createElement(_[369]);
				return f.width = d, f.height = e, f.getContext(_[74])
					.drawImage(a, b, c, d, e, 0, 0, d, e), f
			},
			fh: function(a, b) {
				if (b.Ea) {
					if (_[136] == b.A)
						for (var c = a.width > a.height, d = c ? a.height : a.width, e = 0, f = b.Ea.length; f > e; e++) this.ab(b.Ea[e].da, this.mh(a, c ? e * d : 0, c ? 0 : e * d, d, d))
				} else this.ab(b.da, a);
				this.ge(b), b.Ba = !0
			},
			kh: function(a) {
				var c, d, e, f, g, h, i, j, k, l, m, n, o, p, b = this.l;
				if (a && b.W != a) {
					for (b.W = a, a = b.W.sceneWidth, c = b.W.sceneHeight, d = b.W.fileBlockWidth, b = b.W.fileBlockHeight, e = Math.ceil(a / d), f = Math.ceil(c / b), g = c % b, h = a % d, i = _[67] == this.A, j = _[136] == this.A, k = 0; f > k; k++)
						for (l = 0; e > l; l++)
							if (m = 0 !== g && k == f - 1 ? g : b, n = 0 !== h && l == e - 1 ? h : d, o = k * b, p = l * d, m = i ? this.dh(o, p, c, a, m, n) : j ? this.Yg(o, p, c, a, m, n) : this.Zg(o, p, c, a, m, n), Array.isArray(m))
								for (n = 0, o = m.length; o > n; n++) this.Ra[k + _[141] + l + _[141] + n] = m[n];
							else this.Ra[k + _[141] + l] = m;
					this.qd()
				}
			},
			tc: function() {
				var c, d, a = this.l.qb,
					b = null;
				if (0 < a.length) {
					c = 0, d = 0, b = this.l.A, _[67] == b ? d = 2 * this.pa * Math.PI * window.devicePixelRatio : _[70] == b ? (d = this.l.T, b = this.l.S, d = 2 * (d > b ? 1 : d / b) * this.pa * window.devicePixelRatio) : _[136] == b && (d = 2 * this.pa * window.devicePixelRatio);
					do b = a[c], c++; while (c < a.length && d > b.sceneWidth)
				}
				b && this.l.W != b && this.api_setSceneBlockModel(b)
			},
			ye: function() {
				var b, c, d, a = this.l;
				a && (0 < a.qb.length ? (b = a.qb[a.qb.length - 1], c = b.T, b = b.S) : (c = a.T, b = a.S), c && b && (a = a.A, d = this.ea(), c = 2 * Math.atan(.5 * (d.j > d.i ? d.j : d.i) / (_[67] == a ? .5 * c * Math.sqrt(this.Wc) / Math.PI : _[136] == a ? c * Math.sqrt(this.Wc) / 2 : .5 * (c > b ? c : b) * Math.sqrt(this.Wc))) * this.sa, this.hc = c > 60 ? 60 : c))
			},
			De: function(a) {
				var b, d, e, f, g, h, k;
				this.m = this.Vc(), this.Hd = !1, this.Ya = j.isMobile ? !1 : this.Ya, this.rc = {}, b = {}, d = !0, e = !0, f = 0, g = this.m, b.loadstart = function() {
					e = d = !0, f = 0, this.tb(decodeURI(c[i])), this.md && this.md()
				}, b.loadeddata = function() {
					a.T = g.videoWidth || 1920, a.S = g.videoHeight || 960, this.Ha.width = a.T, this.Ha.height = a.S, this.yc(a), this.ld && this.ld(), g.Ya && this.api_setVideoPlay()
				}, b.progress = function() {
					this.Kb && this.Kb()
				}, b.timeupdate = function() {
					e && 0 != this.m.seekable.length && 0 !== this.m.seekable.end(0) && (f = 1 * this.m.ig, this.mb || 0 == f || this.api_setVideoCurTime(f), e = !1), this.Lb && this.Lb()
				}, b.play = function() {
					this.nd && this.nd()
				}, b.canplaythrough = function() {
					if (a.Ba = !0, this.ib(), d) {
						this.ab(a.da, this.Ha);
						var b = this.m.Fd,
							c = this.m.Gd;
						isNaN(b) && isNaN(c) || this.api_walkThrough(.5, b, c, null, null), this.m.Fd = _[1], this.m.Gd = _[1], this.qc && this.qc(), this.uc(a), this.ge(a)
					} else this.qc && this.qc(), this.uc(a);
					d = !1
				}, b.error = function() {
					this.Yb && this.Yb(1)
				}, b.ended = function() {
					a.Jf ? this.api_setVideoPlay() : this.ue && this.ue()
				}, h = /TBS\/(\d+)/i.test(this.Oa) ? 1 * RegExp.$1 : null, k = /MQQBrowser\/(\d+\.\d)/i.test(this.Oa) ? 1 * RegExp.$1 : null, h >= 36900 || k >= 7.2 ? (b.x5videoexitfullscreen = function() {
					this.api_setVideoPause(), this.wd && this.wd()
				}, b.x5videoenterfullscreen = function() {
					this.vd && this.vd()
				}) : b.x5videoenterfullscreen = function() {
					this.api_setVideoPause()
				}, this.K ? this.api_playerError(3) : (this.Uc(this.m, a.jc, 0, b, !1), this.Ya && this.api_setVideoPlay())
			},
			eh: function() {
				var a, b;
				return this.qa ? this.width > this.height ? (a = .5 * this.width, b = this.height) : (a = this.width, b = .5 * this.height) : (a = this.width, b = this.height), {
					width: .5 * a,
					height: .5 * b
				}
			},
			qd: function() {
				var a, b, c, d, e;
				if (!JTUtil.isEmptyObject(this.Ra)) {
					a = [], b = this.eh(), b = {
						x: b.width,
						y: b.height
					};
					for (c in this.Ra) d = this.Ra[c], e = this.api_3DXYZArrToScreen(d, c), e.isInner && (a.push({
						le: this.L,
						key: c,
						df: d,
						position: this.he(e, b)
					}), delete this.Ra[c]);
					0 !== a.length && (a.sort(function(a, b) {
						return a.position > b.position ? 1 : -1
					}), this.Td(a, 0, this.l.W))
				}
			},
			Td: function(a, b, c) {
				var d, e, f, g, h, i, j, k;
				if (this.l.W == c && (d = a[b], d.le == this.L)) {
					if (e = d.key.split(_[141]), f = e[0], g = e[1], h = c.fileBlockDir, i = null, j = h.indexOf(_[370]), i = -1 != h.indexOf(_[371]), _[372] == c.fileBlockType) e = c.fileBlockWidth, i = c.fileBlockHeight, i = h + (e + _[373] + i + _[374] + g * e + _[374] + f * i);
					else if (-1 != j || i) {
						if (j = c.columnBeginIndex ? c.columnBeginIndex : 0, f = parseInt(f) + (c.rowBeginIndex ? c.rowBeginIndex : 0), i && 10 > f && (f = _[375] + f), k = -1 != h.indexOf(_[376]), g = parseInt(g) + j, k && 10 > g && (g = _[375] + g), i = h.replace(new RegExp(i ? _[371] : _[370], _[377]), f)
							.replace(new RegExp(k ? _[376] : _[378], _[377]), g), 3 === e.length && -1 !== h.indexOf(_[379])) {
							switch (h = null, e[2]) {
								case _[375]:
									h = _[380];
									break;
								case _[381]:
									h = _[382];
									break;
								case _[383]:
									h = _[384];
									break;
								case _[385]:
									h = _[386];
									break;
								case _[387]:
									h = _[388];
									break;
								case _[389]:
									h = _[390];
									break;
								default:
									h = _[382]
							}
							i = i.replace(/%s/g, h)
						}
					} else i = h + (f + _[141] + g + _[391]);
					this.ec(i, function(e) {
						d.le == this.L && (this.qh(e, d.key, d.df), b += 1, a.length > b && this.Td(a, b, c))
					}.bind(this))
				}
			},
			qh: function(a, b, c) {
				c = this.Nb(c), c.N = 1, this.ab(c.da, a), this.l.ra[b] = c
			},
			uc: function(a) {
				var b, c;
				if (a && !this.Hd) {
					b = this.a, _[129] == a.wb ? (this.cf.drawImage(this.m, 0, 0, this.Ha.width, this.Ha.height), c = this.Ha) : c = this.m;
					try {
						b.bindTexture(b.TEXTURE_2D, a.da), b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, c), b.bindTexture(b.TEXTURE_2D, null)
					} catch (d) {
						this.api_playerError(2)
					}
				}
			},
			Ee: function(a) {
				this.Sd = requestAnimationFrame(this.Ee.bind(this)), this.a.clear(this.a.COLOR_BUFFER_BIT | this.a.DEPTH_BUFFER_BIT);
				var b = this.ac(this.L);
				K.update(), this.Og(), this.$c && !this.ob && 199 < a - this.nb && (this.$c = !1, this.nb = a, (this.Ye != this.o || this.Ze != this.L) && (this.Ye = this.o, this.Ze = this.L, this.tc()), this.qd()), this.c && this.P.Ba && this.Tg(), this.Fb && this.P.Ba && this.Sg(), b && b.Ba && this.Ed && this.Ed(a)
			},
			Hh: function() {
				var a = this.P.eg,
					b = this.P.dg;
				160 === a && 48 === b || 170 === a && 78 === b || this.api_playerError(5)
			},
			Gh: function() {
				if (this.gb) {
					var a = this.gb.charAt(51),
						b = this.gb.charAt(88);
					_[392] === a && _[393] === b || _[394] === a && _[395] === b || this.api_playerError(5)
				} else this.api_playerError(5)
			},
			Le: function(a) {
				var d, e, f, b = this.Jc(),
					c = EventUtil.getOffsetX(a);
				a = EventUtil.getOffsetY(a), d = this.P.Ig / b, e = this.P.Jb / b, b = this.P.Ib / b, f = this.width, a > d && b + d > a && c > f - e - d && f - d > c && window.open(this.u(1 === this.xb ? [104, 116, 116, 112, 58, 47, 47, 119, 119, 119, 46, 106, 105, 101, 116, 117, 115, 111, 102, 116, 46, 99, 111, 109] : [104, 116, 116, 112, 58, 47, 47, 119, 119, 119, 46, 106, 105, 101, 116, 117, 115, 111, 102, 116, 46, 99, 111, 109, 47, 116, 114, 97, 99, 107, 47, 114, 101, 100, 105, 114, 101, 99, 116, 46, 97, 115, 112, 120, 63, 102, 114, 111, 109, 61, 115, 100, 107, 45, 99, 111, 112, 121, 114, 105, 103, 104, 116, 38, 116, 111, 61, 104, 116, 116, 112, 37, 51, 65, 37, 50, 70, 37, 50, 70, 119, 119, 119, 46, 117, 116, 111, 118, 114, 46, 99, 111, 109, 37, 50, 70, 100, 101, 118, 101, 108, 111, 112, 101, 114, 99, 101, 110, 116, 101, 114, 37, 50, 70]))
			},
			Ph: function(a) {
				return 180 * (.01 <= Math.sqrt(1 - a[6] * a[6]) ? Math.atan2(-a[4], a[5]) : Math.atan2(a[1], a[0])) / Math.PI
			},
			xf: function(a) {
				return 180 * (Math.asin(a[6]) / Math.PI)
			},
			Ld: function(a) {
				return this.pb - 180 * (.01 <= Math.sqrt(1 - a[6] * a[6]) ? Math.atan2(-a[2], a[10]) : 0) / Math.PI
			},
			lg: function(a, b) {
				for (var c in b) a[c] = b[c]
			},
			Kd: function() {
				var a = this.ea();
				return this.pa = .5 * (_[81] == this.Wa ? a.Ma : _[396] == this.Wa ? a.wa : a.Ma > a.wa ? a.Ma : a.wa) / Math.tan(.5 * this.o * this.vb)
			},
			zf: function() {
				var a = 0,
					b = this.ea();
				return a = _[396] == this.Wa ? this.o : _[81] == this.Wa ? 2 * Math.atan(.5 * b.wa / this.pa) * this.sa : b.Ma > b.wa ? 2 * Math.atan(.5 * b.wa / this.pa) * this.sa : this.o
			},
			Oh: function() {
				return this.o
			},
			Uh: function() {
				return this.C
			},
			Rh: function() {
				return this.v
			},
			Sh: function() {
				return this.ma
			},
			Mh: function() {
				return this.U
			},
			Nh: function() {
				return {
					x: this.$e || 0,
					y: this.af || 0,
					z: this.bf || 0
				}
			},
			Eh: function(a, b, c) {
				this.$e = a || 0, this.af = b || 0, this.bf = c || 0, this.Ga()
			},
			lc: function(a) {
				this.U = a, this.Ga()
			},
			Sa: function(a) {
				var b = this.Xc,
					c = this.Yc;
				a = (isNaN(a) ? this.C : a) % 360, a > b && (a = b), c > a && (a = c), this.C = a
			},
			eb: function(a) {
				var b = this.hc,
					c = this.Vd;
				this.o = isNaN(a) ? this.o : a, this.o < b && (this.o = b), this.o > c && (this.o = c), this.Kd()
			},
			fb: function(a) {
				this.v = isNaN(a) ? this.v : a, _[70] == this.A ? 360 < this.v ? this.v = 360 : 0 > this.v && (this.v = 0) : (this.v = this.v % 360, 0 > this.v && (this.v += 360))
			},
			Rb: function() {
				this.fb(), this.Sa(), this.eb()
			},
			sb: function(a, b, c, d) {
				this.fb(a), this.Sa(b), this.eb(c), this.U = d, this.cb()
			},
			nc: function(a, b, c) {
				this.fb(a), this.Sa(b), this.eb(c), this.Rb(), this.cb()
			},
			rb: function(a, b) {
				this.Sa(b), this.fb(a), this.cb()
			},
			Za: function(a) {
				this.eb(a), this.Rb(), this.cb()
			},
			mc: function(a) {
				this.fb(a), this.cb()
			},
			Gb: function(a) {
				this.Sa(a), this.cb()
			},
			cb: function() {
				!this.O && this.Ga()
			},
			gf: function(a, b) {
				this.Ga(a, b)
			},
			Zf: function() {
				this.gd(), this.Rb(), this.nh(), this.Ga(), this.Id || this.ye()
			},
			Me: function(a) {
				_[397] == this.Hc ? EventUtil.addEvent(a, _[398], this.Zd, this) : EventUtil.addEvent(a, _[399], this.ic, this), EventUtil.addEvent(a, _[400], this.ic, this), EventUtil.addEvent(document, _[401], function() {
					this.$b && this.$b()
				}, this), _[402] == j.pc && (EventUtil.addEvent(a, _[403], this.de, this), EventUtil.addEvent(document, _[403], this.ee, this), EventUtil.addEvent(document, _[404], this.fe, this), EventUtil.addEvent(document, _[403], function(a) {
					a.altKey && a.shiftKey && a.ctrlKey && 86 == a.keyCode && (this.Fb = !this.Fb)
				}, this), EventUtil.addEvent(this.target, _[405], function(a) {
					EventUtil.stopDefault(a), this.Aa = !1, this.b && this.te(a, this.Kc())
				}, this), EventUtil.addEvent(document, _[406], this.bc, this), this.Sc && EventUtil.addEvent(a, _[407], this.ae, this), this.Pd && EventUtil.addEvent(a, _[408], this.api_fullScreen, this), this.be = EventUtil.addEvent(a, _[409], this.wc, this))
			},
			bg: function(a) {
				_[397] == this.Hc ? EventUtil.removeEvent(a, _[398], this.Zd) : EventUtil.removeEvent(a, _[399], this.ic), EventUtil.removeEvent(a, _[400], this.ic), EventUtil.removeEvent(document, _[401], function() {
					this.$b && this.$b()
				}), _[402] == j.pc && (EventUtil.removeEvent(a, _[403], this.de), EventUtil.removeEvent(document, _[403], this.ee), EventUtil.removeEvent(document, _[404], this.fe), EventUtil.removeEvent(document, _[403], function(a) {
					a.altKey && a.shiftKey && a.ctrlKey && 86 == a.keyCode && (this.Fb = !this.Fb)
				}), EventUtil.removeEvent(this.target, _[405], function(a) {
					EventUtil.stopDefault(a), this.Aa = !1, this.b && this.te(a, this.Kc())
				}), EventUtil.removeEvent(document, _[406], this.bc), this.Sc && EventUtil.removeEvent(a, _[407], this.ae), this.Pd && EventUtil.removeEvent(a, _[408], this.api_fullScreen), EventUtil.removeEvent(a, _[409], this.wc))
			},
			fe: function() {
				this.V()
			},
			de: function(a) {
				32 == a.keyCode && (EventUtil.stopDefault(a), this.api_setVideoToggle())
			},
			ee: function(a) {
				var b = a.keyCode;
				if (this.oa != b) switch (b) {
					case 37:
						this.api_left();
						break;
					case 38:
						EventUtil.stopDefault(a), this.api_up();
						break;
					case 39:
						this.api_right();
						break;
					case 40:
						EventUtil.stopDefault(a), this.api_down()
				}
			},
			Zd: function(a) {
				this.Nd(a), this.yd()
			},
			ic: function(a) {
				2 != EventUtil.getButton(a) && (this.Nd(a), this.yd())
			},
			wc: function(a) {
				this.oe && this.oe(a)
			},
			Yd: function(a, b) {
				this.Pc && this.Aa && (EventUtil.stopDefault(b), a = EventUtil.getEventSize(a), this.Sb = a.x, this.Tb = a.y, this.Cf())
			},
			Dg: function(a, b) {
				var c = b.targetTouches.length;
				1 == c ? (this.$a = 0, this.Yd(a, b)) : 2 == c && this.Sc && (EventUtil.stopDefault(b), this.Aa = !1, a = b.targetTouches, a = this.he({
					x: a[0].clientX,
					y: a[0].clientY
				}, {
					x: a[1].clientX,
					y: a[1].clientY
				}), 0 == this.$a && (this.$a = a), b = this.$a / a, this.$a = a, this.wf(b))
			},
			$d: function(a) {
				2 != EventUtil.getButton(a) && (this.Df(a), this.Zc()), this.$a = 0
			},
			Sf: function() {
				this.Aa = !1, this.Zc()
			},
			yd: function() {
				var a = this.ba;
				this.Fg = EventUtil.addEvent(a, _[410], this.Dg, this), this.Eg = EventUtil.addEvent(a, _[411], this.$d, this), this.Uf = EventUtil.addEvent(a, _[409], this.Yd, this), _[171] == this.Hc && (this.Wf = EventUtil.addEvent(a, _[412], this.$d, this)), this.Vf = EventUtil.addEvent(a, _[413], this.Sf, this), EventUtil.removeEvent(a, _[409], this.be)
			},
			Zc: function() {
				var a = this.ba;
				EventUtil.removeEvent(a, _[410], this.Fg), EventUtil.removeEvent(a, _[411], this.Eg), EventUtil.removeEvent(a, _[409], this.Uf), EventUtil.removeEvent(a, _[412], this.Wf), EventUtil.removeEvent(a, _[413], this.Vf), this.be = EventUtil.addEvent(a, _[409], this.wc, this)
			},
			ae: function(a) {
				EventUtil.stopPropagation(a), EventUtil.stopDefault(a), this.Ta += 0 < (a.wheelDelta || -a.detail) ? .4 : -.4, this.lb = !0, this.clientX = a.clientX, this.clientY = a.clientY
			},
			wf: function(a) {
				this.Za(this.o * a)
			},
			he: function(a, b) {
				var c = a.x - b.x;
				return a = a.y - b.y, Math.sqrt(c * c + a * a)
			},
			Qh: function(a, b) {
				if (45 > this.ma && -45 < this.ma) {
					var c = a;
					a = b
				} else 45 < this.ma && 135 > this.ma ? (c = b, a = -a) : 135 < Math.abs(this.ma) ? (c = -a, a = -b) : -45 > this.ma && -135 < this.ma ? c = -b : (c = a, a = b);
				return {
					Wh: c,
					Xh: a
				}
			},
			Nd: function(a) {
				this.V(), this.Va && K.remove(this.pf);
				var b = EventUtil.getEventSize(a);
				this.Aa = !0, this.cd = this.Sb = b.x, this.dd = this.Tb = b.y, this.vg = (new Date)
					.getTime(), this.ne && this.ne(a)
			},
			Cf: function() {
				var f, a = this.Sb - this.cd,
					b = this.Tb - this.dd,
					c = this.Xb ? -1 : 1,
					d = 0,
					e = 0;
				_[70] == this.A ? (c = this.l.T, f = this.l.S, c && f && (d = -180 * (c > f ? 1 : f / c) * a / this.pa, e = -90 * (f > c ? 1 : c / f) * b / this.pa)) : (d = c * Math.atan(a / this.pa) * this.sa, e = c * Math.atan(b / this.pa) * this.sa), this.Va ? (this.Fc = d, this.Gc = e) : (this.rb(this.v + d, this.C - e), this.cd = this.Sb, this.dd = this.Tb)
			},
			Df: function(a) {
				this.Aa && (this.pe && this.pe(a), this.wg = (new Date)
					.getTime(), 150 > this.wg - this.vg ? this.Bf(a) : 1 == this.Va && this.Pe(this.Fc, this.Gc), this.Aa = !1, this.Gc = this.Fc = this.$a = 0)
			},
			Bf: function(a) {
				this.c && this.Le(a), this.me && this.me(a)
			},
			Oe: function() {
				this.rb(this.v + this.Fc * this.Ec, this.C - this.Gc * this.Ec)
			},
			Pe: function(a, b) {
				var c = this;
				this.pf = new K.ia({
						ad: this.Ec
					})
					.la({
						ad: 0
					}, 300)
					.ja(function() {
						c.rb(c.v + a * this.ad, c.C - b * this.ad)
					})
					.start()
			},
			Kf: function(a) {
				var b = this.oa;
				if (0 != b) switch (a = a ? a : .05 * this.hg, b) {
					case 37:
						b = this.v - a, this.mc(b);
						break;
					case 39:
						b = this.v + a, this.mc(b);
						break;
					case 38:
						b = this.C + a, this.Gb(b);
						break;
					case 40:
						b = this.C - a, this.Gb(b);
						break;
					case 16:
						b = this.o - a, this.Za(b);
						break;
					case 17:
						b = this.o + a, this.Za(b)
				}
			},
			Tf: function() {
				this.Ta *= .92, .05 > Math.abs(this.Ta) ? (this.Ta = 0, this.lb = !1) : (this.o -= this.Ta, this.Za())
			},
			V: function() {
				this.lb = !1, this.oa = 0
			},
			bc: function() {
				JTUtil.gId(_[414]) && DomUtil.destroy(JTUtil.gId(_[414]))
			},
			te: function(a, b) {
				function c() {
					var a = JTUtil.cDom(_[42]);
					return DomUtil.setStyles(a, {
						width: _[206],
						height: _[415],
						lineHeight: _[415],
						color: _[416],
						fontSize: _[417],
						fontFamily: _[418] == i ? _[419] : _[420],
						textShadow: _[421],
						paddingLeft: _[422],
						cursor: _[423],
						textAlign: _[424]
					}), EventUtil.addEvent(a, _[413], function() {
						DomUtil.setStyles(a, {
							backgroundColor: _[425]
						})
					}), EventUtil.addEvent(a, _[413], function() {
						DomUtil.setStyles(a, {
							backgroundColor: _[3]
						})
					}), a
				}

				function d(a) {
					return DomUtil.setStyles(JTUtil.cDom(_[42]), {
						height: _[426],
						backgroundColor: a
					})
				}

				function j(a, b) {
					return DomUtil.setStyles(JTUtil.cDom(_[42]), {
						position: _[204],
						left: b + _[22],
						height: _[206],
						width: _[426],
						backgroundColor: a
					})
				}
				var k, l, m, n, o;
				this.bc(), k = JTUtil.cDom(_[42]), DomUtil.setStyles(k, {
					position: _[204],
					zIndex: 9999,
					opacity: .9999,
					visibility: _[205],
					border: _[427],
					backgroundColor: _[428],
					width: _[429],
					boxShadow: _[430]
				}), DomUtil.setProperties(k, {
					id: _[414]
				}), DomUtil.inject(k, this.target), EventUtil.addEvent(k, _[405], function(a) {
					EventUtil.stopPropagation(a), EventUtil.stopDefault(a)
				}), l = JTUtil.cDom(_[42]), DomUtil.setStyles(l, {
					position: _[41],
					backgroundColor: _[428],
					borderRadius: _[422],
					boxShadow: _[431],
					width: _[206],
					height: _[206],
					overflow: _[205]
				}), DomUtil.inject(l, k), EventUtil.addEvent(l, _[406], this.bc, this), DomUtil.inject(j(_[432], 37), l), DomUtil.inject(j(_[433], 38), l), DomUtil.inject(j(_[434], 39), l), m = JTUtil.cDom(_[42]), DomUtil.setStyles(m, {
					position: _[41],
					left: _[435],
					height: _[206],
					width: _[206],
					textAlign: _[424]
				}), DomUtil.inject(m, l), l = c(), DomUtil.inject(l, m), 1 === this.xb ? (n = [20851, 20110, 26480, 22270, 36719, 20214], o = [104, 116, 116, 112, 58, 47, 47, 119, 119, 119, 46, 106, 105, 101, 116, 117, 115, 111, 102, 116, 46, 99, 111, 109]) : (n = [20851, 20110, 85, 116, 111, 86, 82], o = [104, 116, 116, 112, 58, 47, 47, 119, 119, 119, 46, 106, 105, 101, 116, 117, 115, 111, 102, 116, 46, 99, 111, 109, 47, 116, 114, 97, 99, 107, 47, 114, 101, 100, 105, 114, 101, 99, 116, 46, 97, 115, 112, 120, 63, 102, 114, 111, 109, 61, 115, 100, 107, 45, 99, 111, 112, 121, 114, 105, 103, 104, 116, 38, 116, 111, 61, 104, 116, 116, 112, 37, 51, 65, 37, 50, 70, 37, 50, 70, 119, 119, 119, 46, 117, 116, 111, 118, 114, 46, 99, 111, 109, 37, 50, 70, 100, 101, 118, 101, 108, 111, 112, 101, 114, 99, 101, 110, 116, 101, 114, 37, 50, 70]), l.innerHTML = this.u(n), EventUtil.addEvent(l, _[406], function() {
					window.open(this.u(o))
				}, this), DomUtil.inject(d(_[436]), m), DomUtil.inject(d(_[437]), m), l = c(), DomUtil.inject(l, m), l.innerHTML = decodeURI(e[i]), this.La ? EventUtil.addEvent(l, _[406], this.api_normalView, this) : DomUtil.setStyles(l, {
					color: _[438],
					cursor: _[439]
				}), l = c(), DomUtil.inject(l, m), l.innerHTML = decodeURI(f[i]), this.La || 180 != this.Xc - this.Yc || 360 != this.Wd - this.Xd ? DomUtil.setStyles(l, {
					color: _[438],
					cursor: _[439]
				}) : EventUtil.addEvent(l, _[406], this.api_littlePlanet, this), l = c(), DomUtil.inject(l, m), n = JTUtil.isFullScreen(), l.innerHTML = n ? decodeURI(h[i]) : decodeURI(g[i]), EventUtil.addEvent(l, _[406], this.api_fullScreen, this), DomUtil.inject(d(_[436]), m), DomUtil.inject(d(_[437]), m), l = c(), DomUtil.setStyles(l, {
					color: _[438],
					cursor: _[439]
				}), DomUtil.inject(l, m), l.innerHTML = b, a = EventUtil.getEventSize(a), b = this.target.getBoundingClientRect(), a.x = a.x - b.left, a.y = a.y - b.top, a = function(a, b, c, d, e) {
					a = a.getBoundingClientRect();
					var f = a.width;
					return a = a.height, d + f > b && (d -= f), e + a > c && (e -= a), 0 > d && (d = (b - f) / 2), 0 > e && (e = (c - a) / 2), {
						left: d,
						top: e
					}
				}(k, b.width, b.height, a.x, a.y), DomUtil.setStyles(k, {
					left: a.left + _[22],
					top: a.top + _[22],
					visibility: _[440]
				})
			},
			ug: function(a, b) {
				if (a) {
					this.m = this.m || this.Vc();
					for (var c in this.rc) EventUtil.removeEvent(this.m, c, this.rc[c]);
					!this.m.src && (this.m.src = this.jc), EventUtil.addEvent(this.m, _[441], function() {
						this.Kb && this.Kb()
					}.bind(this)), EventUtil.addEvent(this.m, _[442], function() {
						this.Lb && this.Lb()
					}.bind(this)), 0 === b && this.m.setAttribute(_[443], !0), this.m.setAttribute(_[444], !0), DomUtil.setStyles(this.m, {
						position: _[204],
						left: _[208],
						top: _[208],
						width: _[206],
						height: _[206],
						backgroundColor: _[207]
					}), DomUtil.inject(this.m, 0 === b ? this.ba : this.hb)
				}
			},
			xg: function(a) {
				var b = this;
				this.g.ca = a, a.addEventListener(_[445], this.Mg.bind(this)), this.xe && this.xe(a), a.updateRenderState({
						baseLayer: new window.XRWebGLLayer(a, this.a)
					}), a.requestReferenceSpace(_[446])
					.then(function(c) {
						b.g.je = c, window.cancelAnimationFrame(b.Sd), b.Gb(0), b.nb = 0, b.g.Qc = !0, a.requestAnimationFrame(b.we.bind(b))
					})
			},
			Mg: function() {
				if (this.g.ca) {
					this.api_exitVRModel();
					var a = (360 - this.Ld(this.g.Ja)) % 360,
						b = -this.xf(this.g.Ja);
					this.g.Bc && this.g.Ac && this.bd(this.g.Bc, this.g.Ac), this.g.zc ? this.nc(a, b, this.g.zc) : this.rb(a, b), this.nb = 0, this.tc(), this.a.bindFramebuffer(this.a.FRAMEBUFFER, null), this.g.ca = null, _[79] == this.va && this.api_setVideoPlay(), this.Ge()
				}
			},
			we: function(a, b) {
				this.g.ca.requestAnimationFrame(this.we.bind(this)), (b = b.getViewerPose(this.g.je)) && (this.Lg(b), K.update(a), !this.ob && 299 < a - this.nb && (this.nb = a, this.qd()), this.ve && this.ve(a, b, this.g))
			},
			Lg: function(a) {
				var b, c;
				for (this.g.ie = a, b = a.views[0], a = this.g.ca.renderState.baseLayer, c = b.transform.orientation, c = [c.x, c.y, c.z, c.w], quat.invert(c, c), mat4.fromQuat(this.g.s, c), mat4.multiply(this.g.Ja, this.g.s, this.s), this.g.Qc && (this.g.Bc = this.width, this.g.Ac = this.height, this.g.zc = this.o, this.mc(this.v - ((360 - this.Ld(this.g.Ja)) % 360 - this.v)), mat4.multiply(this.g.Ja, this.g.s, this.s), c = a.getViewport(b), mat4.copy(this.g.D, b.projectionMatrix), b = 2 * Math.atan(1 / this.g.D[5]) * this.sa, this.bd(2 * c.width, c.height), this.Za(b), this.tc(), this.g.Qc = !1), this.a.clear(this.a.COLOR_BUFFER_BIT | this.a.DEPTH_BUFFER_BIT), this.rd(), this.a.bindFramebuffer(this.a.FRAMEBUFFER, a.framebuffer), a = 0; a < this.ka.length; a++) b = this.ka[a], this.a.uniform1i(this.B.Oc, 0), b.Ba && b.Dd()
			},
			Mb: function(a, b, c) {
				var f, d = this.g.ie,
					e = this.g.ca.renderState.baseLayer;
				for (c || (a.s && a.L != this.L ? (mat4.multiply(this.g.Zb, this.g.s, a.s), this.X(this.g.Zb, this.g.D, a.N)) : this.X(this.g.Ja, this.g.D, a.N)), c = d.views, H(), E(), H(), c = (d = c[Symbol.iterator]) ? d.call(c) : I(c), d = c.next(); !d.done; d = c.next()) d = d.value, f = e.getViewport(d), this.a.viewport(f.x, f.y, f.width, f.height), b ? _[138] == b ? _[424] == d.eye ? this.F(.5, 0, 1, 0) : this.F(.5, .5, 1, 0) : _[139] == b ? _[424] == d.eye ? this.F(1, 0, .5, 0) : this.F(1, 0, .5, .5) : this.F(1, 0, 1, 0) : this.F(1, 0, 1, 0), this.a.drawElements(this.a.TRIANGLES, a.ga.ha, this.a.UNSIGNED_SHORT, 0)
			},
			re: function(a, b) {
				var c = this.ac(a);
				c && new K.ia({
						x: 1
					})
					.la({
						x: 0
					}, b || 800)
					.na(K.Y.ta.R)
					.ja(function() {
						c.N = this.x
					})
					.start()
			}
		}), window.JTPlay = k
	}();