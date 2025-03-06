"object" !== typeof JSON && (JSON = {});
(function() {
    function m(a) {
        return 10 > a ? "0" + a : a
    }
    function r() {
        return this.valueOf()
    }
    function t(a) {
        u.lastIndex = 0;
        return u.test(a) ? '"' + a.replace(u, function(a) {
            var c = w[a];
            return "string" === typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }
    function p(a, l) {
        var c, d, h, q, g = e, f, b = l[a];
        b && "object" === typeof b && "function" === typeof b.toJSON && (b = b.toJSON(a));
        "function" === typeof k && (b = k.call(l, a, b));
        switch (typeof b) {
        case "string":
            return t(b);
        case "number":
            return isFinite(b) ? String(b) : "null";
        case "boolean":
        case "null":
            return String(b);
        case "object":
            if (!b)
                return "null";
            e += n;
            f = [];
            if ("[object Array]" === Object.prototype.toString.apply(b)) {
                q = b.length;
                for (c = 0; c < q; c += 1)
                    f[c] = p(c, b) || "null";
                h = 0 === f.length ? "[]" : e ? "[\n" + e + f.join(",\n" + e) + "\n" + g + "]" : "[" + f.join(",") + "]";
                e = g;
                return h
            }
            if (k && "object" === typeof k)
                for (q = k.length,
                c = 0; c < q; c += 1)
                    "string" === typeof k[c] && (d = k[c],
                    (h = p(d, b)) && f.push(t(d) + (e ? ": " : ":") + h));
            else
                for (d in b)
                    Object.prototype.hasOwnProperty.call(b, d) && (h = p(d, b)) && f.push(t(d) + (e ? ": " : ":") + h);
            h = 0 === f.length ? "{}" : e ? "{\n" + e + f.join(",\n" + e) + "\n" + g + "}" : "{" + f.join(",") + "}";
            e = g;
            return h
        }
    }
    var x = /^[\],:{}\s]*$/
      , y = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
      , z = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
      , A = /(?:^|:|,)(?:\s*\[)+/g
      , u = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
      , v = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + m(this.getUTCMonth() + 1) + "-" + m(this.getUTCDate()) + "T" + m(this.getUTCHours()) + ":" + m(this.getUTCMinutes()) + ":" + m(this.getUTCSeconds()) + "Z" : null
    }
    ,
    Boolean.prototype.toJSON = r,
    Number.prototype.toJSON = r,
    String.prototype.toJSON = r);
    var e, n, w, k;
    "function" !== typeof JSON.stringify && (w = {
        "\b": "\\b",
        " ": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    JSON.stringify = function(a, l, c) {
        var d;
        n = e = "";
        if ("number" === typeof c)
            for (d = 0; d < c; d += 1)
                n += " ";
        else
            "string" === typeof c && (n = c);
        if ((k = l) && "function" !== typeof l && ("object" !== typeof l || "number" !== typeof l.length))
            throw Error("JSON.stringify");
        return p("", {
            "": a
        })
    }
    );
    "function" !== typeof JSON.parse && (JSON.parse = function(a, e) {
        function c(a, d) {
            var g, f, b = a[d];
            if (b && "object" === typeof b)
                for (g in b)
                    Object.prototype.hasOwnProperty.call(b, g) && (f = c(b, g),
                    void 0 !== f ? b[g] = f : delete b[g]);
            return e.call(a, d, b)
        }
        var d;
        a = String(a);
        v.lastIndex = 0;
        v.test(a) && (a = a.replace(v, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (x.test(a.replace(y, "@").replace(z, "]").replace(A, "")))
            return d = eval("(" + a + ")"),
            "function" === typeof e ? c({
                "": d
            }, "") : d;
        throw new SyntaxError("JSON.parse")
    }
    )
}
)();
(function() {
    var getBasePath = function() {
        var stack;
        try {
            a.b.c()
        } catch (e) {
            stack =e.stack;
            if (!stack && window.opera) {
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop();
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "");
            stack = stack.replace(/(:\d+)?:\d+$/i, "")
        }
        if (!stack) {
            var scripts = document.getElementsByTagName("script");
            var reg = /UtoVRPlayerGuide.js/i, src;
            for (var i = 0, el; el = scripts[i++]; ) {
                src = !!document.querySelector ? el.src : el.getAttribute("src", 4);
                if (src && reg.test(src)) {
                    stack = src;
                    break
                }
            }
        }
        return stack.substr(0, stack.lastIndexOf("/"))
    };
    var getFileExt = function(str) {
        var str = str;
        var num = str.indexOf("?");
        if (num > 0) {
            str = str.substring(0, num)
        }
        var d = /\.[^\.]+$/.exec(str);
        return d ? d[0] : ""
    };
    var getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2];
        return null
    };
    var jsRootPath = getBasePath();
    var UtoVR_Player_Lib = jsRootPath + "/UtoVRPlayer.js"
      , UtoVR_Player_SWF = jsRootPath + "/UtoVRPlayer.swf"
      , videoBarCss = jsRootPath + "/plugin/videoToolBar/style/videobar.css"
      , videoBarLib = jsRootPath + "/plugin/videoToolBar/js/video_toolbar.js"
      , iPhoneInlineVideoLib = jsRootPath + "/plugin/inlineVideo/inlineVideo.js"
      , gyroLib = jsRootPath + "/plugin/gyro/gyro.js"
      , hlsLib ="https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js"|| jsRootPath + "/plugin/hls/hls.js";
    var PTArr = [-35, 25, 35, 25, 35, -10, -35, -10];
    var initFov = 100;
    var initPan = 0;
    var createDom = function(tagName) {
        return document.createElement(tagName)
    };
    var support_Flash = function() {
        var pluginFlashSupported = false;
        var flashVer = [];
        var pluginList = {
            flash: {
                activex: "ShockwaveFlash.ShockwaveFlash",
                plugin: /flash/gim
            }
        };
        if (window.ActiveXObject) {
            try {
                var AXObj = new ActiveXObject(pluginList.flash.activex);
                pluginFlashSupported = true;
                flashVer = AXObj.GetVariable("$version").split(" ")[1].split(",")
            } catch (e) {
                pluginFlashSupported = false
            }
        } else {
            for (var i = 0; i < navigator.plugins.length; i++) {
                var pluginsObj = navigator.plugins[i];
                if (pluginsObj.name.match(pluginList.flash.plugin)) {
                    pluginFlashSupported = true;
                    flashVer = pluginsObj.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
                    break
                }
            }
        }
        var flashInfo = {
            support: pluginFlashSupported,
            maxVersion: flashVer[0] * 1,
            minVersion: flashVer[1] * 1,
            allVersion: flashVer.toString()
        };
        if (flashInfo.support && flashInfo.maxVersion >= 11) {
            return true
        } else {
            return false
        }
    };
    var support_WebGL = function() {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas")
              , names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"]
              , gl = false;
            for (var i in names) {
                try {
                    gl = canvas.getContext(names[i]);
                    if (gl && typeof gl.getParameter == "function") {
                        return true
                    }
                } catch (e) {}
            }
            return false
        }
        return false
    };
    var isInCludeCss = function(path) {
        "use strict";
        var cssArr = document.getElementsByTagName("link");
        var isInClude = false;
        for (var i = 0; i < cssArr.length; i++) {
            var curCssSrc = cssArr[i].href;
            if (curCssSrc === path) {
                isInClude = true
            }
        }
        return isInClude
    };
    var isInCludeJS = function(path) {
        "use strict";
        var scriptArr = document.getElementsByTagName("script");
        var isInClude = false;
        for (var i = 0; i < scriptArr.length; i++) {
            var curScriptSrc = scriptArr[i].src;
            if (curScriptSrc === path) {
                isInClude = true
            }
        }
        return isInClude
    };
    var includeJS = function(arr, callback) {
        var length = arr.length;
        var loadNum = 0;
        for (var i = 0; i < length; i++) {
            if (isInCludeJS(arr[i] + "?t=20230927")) {
                ++loadNum;
                if (loadNum === length) {
                    callback && callback()
                }
                continue
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = arr[i] + "?t=20230927";
            script.charset = "utf-8";
            script.onload = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    ++loadNum;
                    if (loadNum === length) {
                        callback && callback()
                    }
                }
            }
            ;
            script.onerror = function() {
                ++loadNum;
                if (loadNum === length) {
                    callback && callback()
                }
            }
            ;
            document.getElementsByTagName("head")[0].appendChild(script)
        }
    };
    var includeCss = function(arr, callback) {
        var length = arr.length;
        var loadNum = 0;
        for (var i = 0; i < length; i++) {
            if (isInCludeCss(arr[i] + "?t=20230927")) {
                ++loadNum;
                if (loadNum === length) {
                    callback && callback()
                }
                continue
            }
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.charset = "utf-8";
            link.href = arr[i] + "?t=20230927";
            link.onload = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    ++loadNum;
                    if (loadNum === length) {
                        callback && callback()
                    }
                }
            }
            ;
            document.getElementsByTagName("head")[0].appendChild(link)
        }
    };
    var flash_Play = support_Flash()
      , webGL_Play = support_WebGL();
    var getTopDomain = function() {
        var domain = "";
        try {
            if (window.top == window) {
                domain = ""
            } else {
                domain = window.top.location.href
            }
        } catch (e) {
            domain = ""
        }
        return domain
    };
    var initFlashPlayer = function(PConfig, TConfig, vcode, isShare) {
        var container = PConfig["container"];
        if (!flash_Play) {
            container.innerHTML = PConfig["flashTip"] || '<div style="position: absolute;width: 100%;height: 100%;background-color:white;text-align: center; padding-top: 50px;">请下载最新的 <a href="//www.adobe.com/go/getflashplayer" target="_blank" style="text-decoration:underline; ">Flash Player</a>  播放器. </div>';
            return
        }
        delete PConfig["container"];
        var sceneArr = PConfig["scenesArr"];
        delete PConfig["scenesArr"];
        var bgPano = [{
            bgId: "bgpano1",
            bgName: "剧场环境",
            path: sceneArr[0]["sceneImagePath"]
        }];
        var addVars = "";
        var vPath = sceneArr[0]["sceneVideoPath"];
        var ipan = (sceneArr[0]["initPan"] || initPan) + 180;
        var ifov = sceneArr[0]["initFov"] || initFov;
        var videoType = sceneArr[0]["videoType"] || sceneArr[0]["sceneFormat"];
        var sceneModel = PConfig["playModel"];
        if (sceneModel == "Cinema") {
            sceneArr[0]["sceneMode"] = "2DVideo";
            sceneArr[0]["sceneFilePath"] = vPath
        }
        sceneArr[0]["initPan"] = ipan;
        sceneArr[0]["initFov"] = ifov;
        sceneArr[0]["videoPT"] = sceneArr[0]["sceneModelPT"] || PTArr;
        sceneArr[0]["bgPano"] = bgPano;
        sceneArr[0]["videoType"] = videoType;
        PConfig["base"] = location.href;
        var topDomain = getTopDomain();
        if (topDomain)
            PConfig["topBase"] = topDomain;
        PConfig["scenesArr"] = sceneArr;
        addVars = JSON.stringify(PConfig);
        addVars = addVars.replace(/\"/g, "'");
        addVars = encodeURIComponent(addVars);
        addVars = "params=" + addVars;
        var swfObject = createDom("embed");
        var wmodeSTR = getQueryString("wmode") || "opaque";
        var swfPath = UtoVR_Player_SWF + "?t=1";
        if (vcode)
            swfPath += "&vcode=" + vcode;
        if (isShare)
            swfPath += "&isShare=true";
        var addParams = {
            type: "application/x-shockwave-flash",
            src: swfPath,
            width: "100%",
            height: "100%",
            id: "sotester",
            name: "sotester",
            bgcolor: "#000000",
            quality: "high",
            allownetworking: "all",
            allowscriptaccess: "always",
            allowfullscreen: "true",
            scale: "noscale",
            wmode: wmodeSTR
        };
        for (var key in addParams) {
            swfObject.setAttribute(key, addParams[key])
        }
        var addStyles = {
            position: "absolute",
            width: "100%",
            height: "100%",
            left: "0px",
            top: "0px"
        };
        for (var key in addStyles) {
            swfObject.style[key] = addStyles[key]
        }
        swfObject.setAttribute("flashvars", addVars);
        container = container ? container : document.body;
        container.appendChild(swfObject)
    };
    var UTPlayerObj, UTToolBarObj;
    var isHLSSupported = function() {
        var mediaSource = window.MediaSource = window.MediaSource || window.WebKitMediaSource;
        var sourceBuffer = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
        var isTypeSupported = mediaSource && typeof mediaSource.isTypeSupported === "function" && mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
        var sourceBufferValidAPI = !sourceBuffer || sourceBuffer.prototype && typeof sourceBuffer.prototype.appendBuffer === "function" && typeof sourceBuffer.prototype.remove === "function";
        return isTypeSupported && sourceBufferValidAPI
    };
    var initHTML5Player = function(PConfig, TConfig, vcode, isShare, isjt, CRImage) {
        if (!webGL_Play && flash_Play) {
            initFlashPlayer(PConfig, TConfig, vcode, isShare);
            return
        }
        includeCss([videoBarCss]);
        var sceneArr = PConfig["scenesArr"];
        delete PConfig["scenesArr"];
        var loadArr = [UtoVR_Player_Lib, videoBarLib];
        "ontouchstart"in window && loadArr.push(gyroLib);
        var isWhitelisted = /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia("(-webkit-video-playable-inline)").matches;
        isWhitelisted && loadArr.push(iPhoneInlineVideoLib);
        var fsCallBack = PConfig["fsCallBack"];
        loadArr.push(hlsLib);
        includeJS(loadArr, function() {
            PConfig["scenesArr"] = sceneArr;
            initUTPlayer(PConfig, TConfig, vcode, isShare, isjt, CRImage, fsCallBack)
        })
    };
    var initUTPlayer = function(PConfig, TConfig, vcode, isShare, isjt, CRImage, fsCallBack) {
        "use strict";
        var useDefaultVideoBar = PConfig["useDefaultVideoBar"] == undefined ? true : false;
        var UTConfig = {
            container: PConfig["container"] || document.body,
            name: PConfig["name"] || "UToVRDesk",
            dragDirectionMode: PConfig["dragDirectionMode"],
            dragMode: PConfig["dragMode"] || false,
            webGLDeepBuffer: PConfig["webGLDeepBuffer"] || false,
            dragStarMode: PConfig["dragStarMode"],
            DBViewIPD: PConfig["DBViewIPD"],
            loadingImg: PConfig["loadingImg"],
            CRType: isjt,
            CRImage: CRImage,
            initSceneId: PConfig["initSceneId"] || "",
            isAutoRotate: PConfig["isAutoRotate"] || false,
            isMouseWheel: PConfig["isMouseWheel"],
            isDBClick: PConfig["isDBClick"],
            isDBViewPort: PConfig["isDBViewPort"] || false,
            isGyro: PConfig["isGyro"] || false,
            isDragAble: PConfig["isDragAble"],
            fullScreenDom: PConfig["fullScreenDom"],
            scenesArr: PConfig["scenesArr"],
            loadedStartCallBack: function() {
                var type = this.api_getCurSceneType();
                var useVideoBar = false;
                if (PConfig["useDefaultVideoBar"] == undefined) {
                    useVideoBar = type === "Video" ? true : false
                } else {
                    useVideoBar = !!PConfig["useDefaultVideoBar"]
                }
                if (useVideoBar) {
                    if (!false) {
                        UTToolBarObj = new TWToolbarClass({
                            container: this.target
                        },this,fsCallBack,TConfig);
                        UTToolBarObj && UTToolBarObj.setDefault()
                    }
                }
                typeof PConfig.loadedStartCallBack === "function" && PConfig.loadedStartCallBack.call(this, UTToolBarObj)
            },
            sceneResizeCallBack: function() {
                UTToolBarObj && UTToolBarObj.resize();
                typeof PConfig.sceneResizeCallBack === "function" && PConfig.sceneResizeCallBack.call(this, UTToolBarObj)
            },
            fullScreenChangeCallBack: function() {
                if (UTToolBarObj) {
                    UTToolBarObj.resize();
                    UTToolBarObj.setFullScreenStatus()
                }
                typeof PConfig.fullScreenChangeCallBack === "function" && PConfig.fullScreenChangeCallBack.call(this, UTToolBarObj)
            },
            videoLoadProgressCallBack: function() {
                UTToolBarObj && UTToolBarObj.getUpdateBuffered();
                typeof PConfig.videoLoadProgressCallBack === "function" && PConfig.videoLoadProgressCallBack.call(this, UTToolBarObj)
            },
            videoTogglePlayCallBack: function() {
                UTToolBarObj && UTToolBarObj.setPlayStatus();
                typeof PConfig.videoTogglePlayCallBack === "function" && PConfig.videoTogglePlayCallBack.call(this, UTToolBarObj)
            },
            videoUpdateCallBack: function() {
                UTToolBarObj && UTToolBarObj.updateProperties();
                typeof PConfig.videoUpdateCallBack === "function" && PConfig.videoUpdateCallBack.call(this, UTToolBarObj)
            },
            videoLoadMetaDataCallBack: function() {
                UTToolBarObj && UTToolBarObj.updateProperties();
                typeof PConfig.videoLoadMetaDataCallBack === "function" && PConfig.videoLoadMetaDataCallBack.call(this, UTToolBarObj)
            },
            errorCallBack: function(e) {
                UTToolBarObj && UTToolBarObj.deleteBeginLayer();
                typeof PConfig.errorCallBack === "function" && PConfig.errorCallBack(e)
            }
        };
        typeof PConfig.videoCanPlayerCallBack === "function" && (UTConfig.videoCanPlayerCallBack = PConfig.videoCanPlayerCallBack);
        typeof PConfig.initOverCallBack === "function" && (UTConfig.initOverCallBack = PConfig.initOverCallBack);
        typeof PConfig.loadedCallBack === "function" && (UTConfig.loadedCallBack = PConfig.loadedCallBack);
        typeof PConfig.drawWebGLCallBack === "function" && (UTConfig.drawWebGLCallBack = PConfig.drawWebGLCallBack);
        typeof PConfig.videoPlayerCallBack === "function" && (UTConfig.videoPlayerCallBack = PConfig.videoPlayerCallBack);
        typeof PConfig.scenePanTiltFovChangerCallBack === "function" && (UTConfig.scenePanTiltFovChangerCallBack = PConfig.scenePanTiltFovChangerCallBack);
        typeof PConfig.sceneEventMoveCallBack === "function" && (UTConfig.sceneEventMoveCallBack = PConfig.sceneEventMoveCallBack);
        typeof PConfig.sceneEventUpCallBack === "function" && (UTConfig.sceneEventUpCallBack = PConfig.sceneEventUpCallBack);
        typeof PConfig.sceneEventClickCallBack === "function" && (UTConfig.sceneEventClickCallBack = PConfig.sceneEventClickCallBack);
        typeof PConfig.sceneEventDownCallBack === "function" && (UTConfig.sceneEventDownCallBack = PConfig.sceneEventDownCallBack);
        typeof PConfig.videoLoadStartCallBack === "function" && (UTConfig.videoLoadStartCallBack = PConfig.videoLoadStartCallBack);
        typeof PConfig.videoPlayEndCallBack === "function" && (UTConfig.videoPlayEndCallBack = PConfig.videoPlayEndCallBack);
        typeof PConfig.X5VideoExitFullscreen === "function" && (UTConfig.X5VideoExitFullscreen = PConfig.X5VideoExitFullscreen);
        typeof PConfig.X5VideoEnterFullscreen === "function" && (UTConfig.X5VideoEnterFullscreen = PConfig.X5VideoEnterFullscreen);
        typeof PConfig.setVideoCurTimeCallBack === "function" && (UTConfig.setVideoCurTimeCallBack = PConfig.setVideoCurTimeCallBack);
        typeof PConfig.changeSucessCallBack === "function" && (UTConfig.changeSucessCallBack = PConfig.changeSucessCallBack);
        typeof PConfig.changeErrorCallBack === "function" && (UTConfig.changeErrorCallBack = PConfig.changeErrorCallBack);
        new JTPlay(UTConfig)
    };
    var initAutoPlayer = function(PConfig, TConfig, vcode, isShare) {
        var mode = "html5";
        if (webGL_Play) {
            initHTML5Player(PConfig, TConfig, vcode, isShare)
        } else if (flash_Play) {
            initFlashPlayer(PConfig, TConfig, vcode, isShare);
            mode = "flash"
        } else {
            initHTML5Player(PConfig, TConfig, vcode, isShare)
        }
        return mode
    };
    var checkPlayMode = function() {
        var search = window.location.search;
        if (search.indexOf("playMode=html5") > 0) {
            return "html5"
        } else if (search.indexOf("playMode=flash") > 0) {
            return "flash"
        } else {
            return "auto"
        }
    };
    var isWXRTMP = function() {
        var ua = navigator.userAgent;
        var tbs = /TBS\/(\d+)/i.test(ua) ? RegExp["$1"] * 1 : null;
        if (tbs && tbs >= 36824) {
            return true
        } else {
            return false
        }
    };
    window.initLoad = function(PConfig, callback, TConfig, vcode, isShare) {
        if (!PConfig)
            return;
        var playMode = checkPlayMode();
        var ua = navigator.userAgent.toLowerCase();
        if (PConfig.scenesArr[0]["sceneFilePath"].indexOf("rtmp://") == 0) {
            if (!isWXRTMP()) {
                playMode = "flash"
            }
        }
        !ua.match(/firefox/) && window.location.protocol == "file:" && (playMode = "flash");
        ua.match(/msie|trident/) && (playMode = "flash");
        !!ua.match(/chrome\/(\d+\.\d)/) && ua.match(/chrome\/(\d+\.\d)/)[1] * 1 < 30 && (playMode = "flash");
        var stype = PConfig.scenesArr[0]["sceneFileType"] || PConfig.scenesArr[0]["sceneType"];
        stype == "Image" && (playMode = "auto");
        if (playMode === "html5" && webGL_Play) {
            initHTML5Player(PConfig, TConfig, vcode, isShare)
        } else if (playMode === "flash") {
            initFlashPlayer(PConfig, TConfig, vcode, isShare)
        } else {
            playMode = initAutoPlayer(PConfig, TConfig, vcode, isShare)
        }
        typeof callback === "function" && callback(playMode)
    }
    ;
    window.initJTLoad = function(PConfig) {
        var icode = "iVBORw0KGgoAAAANSUhEUgAAAKAAAAAwCAMAAAChd4FcAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURUxpcf///////////////////////////////////////////////////////////////////6Sl3sMAAAARdFJOUwBxEVAf8cDQL4BgsJE+oOEHuYIOlQAABNpJREFUWMPtmOmS4yoMRhGb2Jf3f9krAU5Ix512bs2PnqmoKpvB5ljLJxwhPvaxj33sY3+jhfbLAV28Suh672H7Df7ZxniLscwpKka/nVFizOOLjjHKq4TF/jA1q2lAgAWWaSFMfzZL86Pt3RBB1CL2jpOcvaB6r+12r/oqoO74mtCegPT8PeDth9um8BLYOwipdXsPUKSO+n8CBq3Bg14GXwBV6DsgObA3dmp+A5A9rmt9GWVemyKcM13V65yzllK2AaiENDOcZD5MQFnJeTRFFjrBOLIB6NmdQtBgGNkSOG1+DG++Xh9e85uktzgP0oKAdQvvAqR5dWY3HUxi+lSy6whQPsTB/OQ/24QcaW2tezWR7zgPQA64aTdAXsUDeF5MLUD6KBFxekcBuAnokQHVW4ClCB3W+uaVM/nu2wTkueoADMrbBCGTH6sTC5AmBzwUqXLKhcBqy+fzq1DGjBsme80HXbXhuVZ/IDS89AR0R9xmDoowK5WzeAHSAX0AypFsbcnFBFRXZSZTrBLOdjKr7mUKLkD2Sb15kBQxjXMTwBHivdLz0psDUAKEqzqoa0+uT6FvM9fDeTMc2ZMPQAYqXt9z8GuR7ID7netRxZeFutGq2a+bO3IXzmbiSOd2AN6cwh4sbCkDf8ACpIqzNIacPWm77JuAhSOF9YHinNAaU20WB6AIFhEnoIq1xlsfXoDrcmGJfD1y9j3AMJVttfLmygqLP3M2aa2ml+QvUrJUH0WST0K8A9KccgjnyMGp6dycLH95USAcJqBISYoPbsuk88n+kOokj0kMSO0By7IVYn0LsR5MdBQfqni3FwVCp2lfYn3qsuVpNsM5w46ovBiuFc3stsYuW4Bu2yzkyWTugDhsLM/2bQcZed/P7esGUY7mgdxXORFcWsIxdHDbSZQFaMj48saxqmNbe5mrOdgopN+hHcn0SDi3UaMeh2rAvYpTCPfNKsQvOaiCZbezHOW3iiTctm6XbCokx7hLfsvmBvjs/R0Qpy7garqXAd28ctCm4ne2tz3yzXAAtY3xJmkPyEJdzZPVoxmR/KhBVvXwh5nbukPVuJC+BZSrLiR09yufkuwRjGJ/JV9a2YI+uN/4xPm4Yay0m8v6N/G5s9IzWLx64U5qviqX6rUiNQYbhY2pehvpGMiWamouQSpUIKpA4v0EDUOpuaaCHkf3BBopVGs+AU2UgCO/EOG8QE4N6bEnnz49JVKPbNYXaQU216VEoUZV0jFWzhhEQPpMhWWErlNCpCNEy3yR9095DDakNp1Ixum53p5s3X+ws6jvgCCCSIMgLUBak/b7wilRYWic5mEZclAMSPNEM6w/SmneIwqg0zw9bogE9rmpXrPHqN8BEcx4WGXAdgf0vXLgxs5Usqp3iMDPtAzYGJrBWlOj6Sm6Be9Mk/4roHvXmFDq3YMax7O0mysdgM15y4+kd0ANI7sCrv2QWyV6AxQYgoMnpQv4jkWvtCD530OsBP8vswDNBJScZhkfQ6w2wIUe9AAdIRaAScCfkGLaTMe0FUnjv3Im4Egpl4TkjHdFqFEk6RhegI3gPJPQnfHgKBK6KwN/BlD5FCXVIoJWMQJEosgkHnqsH0uSVNjUr5PcZAb96OaqWJDOSJYZ79mLS2ZogkiShz//0H7sY/+O/QfydW8spbNp3AAAAABJRU5ErkJggg==";
        initHTML5Player(PConfig, null, null, null, 1, icode)
    }
    ;
    window.initHTML5Load = initHTML5Player;
    window.initFlashLoad = initFlashPlayer;
    window.UTLoadOver = function(callback) {
        var UtoVR_Player_Lib = jsRootPath + "/UtoVRPlayer.js"
          , UtoVR_Player_SWF = jsRootPath + "/UtoVRPlayer.swf"
          , videoBarCss = jsRootPath + "/plugin/videoToolBar/style/videobar.css"
          , videoBarLib = jsRootPath + "/plugin/videoToolBar/js/video_toolbar.js"
          , iPhoneInlineVideoLib = jsRootPath + "/plugin/inlineVideo/inlineVideo.js"
          , gyroLib = jsRootPath + "/plugin/gyro/gyro.js"
          , hlsLib = jsRootPath + "/plugin/hls/hls.js";
        var loadArr = [UtoVR_Player_Lib, videoBarLib];
        "ontouchstart"in window && loadArr.push(gyroLib);
        var isWhitelisted = /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia("(-webkit-video-playable-inline)").matches;
        isWhitelisted && loadArr.push(iPhoneInlineVideoLib);
        loadArr.push(hlsLib);
        includeCss([videoBarCss]);
        includeJS(loadArr, function() {
            typeof callback === "function" && callback()
        })
    }
    ;
    window.createUTPlayer = function(PConfig, TConfig, vcode, isShare, isjt, CRImage) {
        initUTPlayer(PConfig, TConfig, vcode, isShare, isjt, CRImage)
    }
}
)();
