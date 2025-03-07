"object" != typeof JSON && (JSON = {}),
function() {
  function m(a) {
    return 10 > a ? "0" + a : a
  }

  function r() {
    return this.valueOf()
  }

  function t(a) {
    return u.lastIndex = 0, u.test(a) ? '"' + a.replace(u, function(a) {
      var b = w[a];
      return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0)
          .toString(16))
        .slice(-4)
    }) + '"' : '"' + a + '"'
  }

  function p(a, b) {
    var c, d, f, g, i, h = e,
      j = b[a];
    switch (j && "object" == typeof j && "function" == typeof j.toJSON && (j = j.toJSON(a)), "function" == typeof k && (j = k.call(b, a, j)), typeof j) {
      case "string":
        return t(j);
      case "number":
        return isFinite(j) ? String(j) : "null";
      case "boolean":
      case "null":
        return String(j);
      case "object":
        if (!j) return "null";
        if (e += n, i = [], "[object Array]" === Object.prototype.toString.apply(j)) {
          for (g = j.length, c = 0; g > c; c += 1) i[c] = p(c, j) || "null";
          return f = 0 === i.length ? "[]" : e ? "[\n" + e + i.join(",\n" + e) + "\n" + h + "]" : "[" + i.join(",") + "]", e = h, f
        }
        if (k && "object" == typeof k)
          for (g = k.length, c = 0; g > c; c += 1) "string" == typeof k[c] && (d = k[c], (f = p(d, j)) && i.push(t(d) + (e ? ": " : ":") + f));
        else
          for (d in j) Object.prototype.hasOwnProperty.call(j, d) && (f = p(d, j)) && i.push(t(d) + (e ? ": " : ":") + f);
        return f = 0 === i.length ? "{}" : e ? "{\n" + e + i.join(",\n" + e) + "\n" + h + "}" : "{" + i.join(",") + "}", e = h, f
    }
  }
  var e, n, w, k, x = /^[\],:{}\s]*$/,
    y = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
    z = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    A = /(?:^|:|,)(?:\s*\[)+/g,
    u = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    v = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + m(this.getUTCMonth() + 1) + "-" + m(this.getUTCDate()) + "T" + m(this.getUTCHours()) + ":" + m(this.getUTCMinutes()) + ":" + m(this.getUTCSeconds()) + "Z" : null
  }, Boolean.prototype.toJSON = r, Number.prototype.toJSON = r, String.prototype.toJSON = r), "function" != typeof JSON.stringify && (w = {
    "\b": "\\b",
    "	": "\\t",
    "\n": "\\n",
    "\f": "\\f",
    "\r": "\\r",
    '"': '\\"',
    "\\": "\\\\"
  }, JSON.stringify = function(a, b, c) {
    var d;
    if (n = e = "", "number" == typeof c)
      for (d = 0; c > d; d += 1) n += " ";
    else "string" == typeof c && (n = c);
    if ((k = b) && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw Error("JSON.stringify");
    return p("", {
      "": a
    })
  }), "function" != typeof JSON.parse && (JSON.parse = function(a, e) {
    function c(a, b) {
      var d, f, g = a[b];
      if (g && "object" == typeof g)
        for (d in g) Object.prototype.hasOwnProperty.call(g, d) && (f = c(g, d), void 0 !== f ? g[d] = f : delete g[d]);
      return e.call(a, b, g)
    }
    var d;
    if (a = String(a), v.lastIndex = 0, v.test(a) && (a = a.replace(v, function(a) {
      return "\\u" + ("0000" + a.charCodeAt(0)
          .toString(16))
        .slice(-4)
    })), x.test(a.replace(y, "@")
      .replace(z, "]")
      .replace(A, ""))) return d = eval("(" + a + ")"), "function" == typeof e ? c({
      "": d
    }, "") : d;
    throw new SyntaxError("JSON.parse")
  })
}(),
function() {
  var B, b = function() {
      var b, d, f, e, h, g;
      try {
        a.b.c()
      } catch (c) {
        b = c.stack, !b && window.opera && (b = (String(c)
            .match(/of linked script \S+/g) || [])
          .join(" "))
      }
      if (b && (b = b.split(/[@ ]/g)
        .pop(), b = "(" === b[0] ? b.slice(1, -1) : b.replace(/\s/, ""), b = b.replace(/(:\d+)?:\d+$/i, "")), !b)
        for (d = document.getElementsByTagName("script"), e = /UtoVRPlayerGuide.js/i, g = 0; h = d[g++];)
          if (f = document.querySelector ? h.src : h.getAttribute("src", 4), f && e.test(f)) {
            b = f;
            break
          } return b.substr(0, b.lastIndexOf("/"))
    },
    d = function(a) {
      var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"),
        c = window.location.search.substr(1)
        .match(b);
      return null != c ? c[2] : null
    },
    e = b(),
    f = e + "/UtoVRPlayer.js",
    g = e + "/UtoVRPlayer.swf",
    h = e + "/plugin/videoToolBar/style/videobar.css",
    i = e + "/plugin/videoToolBar/js/video_toolbar.js",
    j = e + "/plugin/inlineVideo/inlineVideo.js",
    k = e + "/plugin/gyro/gyro.js",
    l = e + "/plugin/hls/hls.js",
    m = [-35, 25, 35, 25, 35, -10, -35, -10],
    n = 100,
    o = 0,
    p = function(a) {
      return document.createElement(a)
    },
    q = function() {
      var d, f, g, h, a = !1,
        b = [],
        c = {
          flash: {
            activex: "ShockwaveFlash.ShockwaveFlash",
            plugin: /flash/gim
          }
        };
      if (window.ActiveXObject) try {
        d = new ActiveXObject(c.flash.activex), a = !0, b = d.GetVariable("$version")
          .split(" ")[1].split(",")
      } catch (e) {
        a = !1
      } else
        for (f = 0; f < navigator.plugins.length; f++)
          if (g = navigator.plugins[f], g.name.match(c.flash.plugin)) {
            a = !0, b = g.description.replace(/([a-zA-Z]|\s)+/, "")
              .replace(/(\s+r|\s+b[0-9]+)/, ".")
              .split(".");
            break
          } return h = {
        support: a,
        maxVersion: 1 * b[0],
        minVersion: 1 * b[1],
        allVersion: b.toString()
      }, h.support && h.maxVersion >= 11 ? !0 : !1
    },
    r = function() {
      var a, b, c, d;
      if (window.WebGLRenderingContext) {
        a = document.createElement("canvas"), b = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"], c = !1;
        for (d in b) try {
          if (c = a.getContext(b[d]), c && "function" == typeof c.getParameter) return !0
        } catch (e) {}
        return !1
      }
      return !1
    },
    s = function(a) {
      "use strict";
      var d, e, b = document.getElementsByTagName("link"),
        c = !1;
      for (d = 0; d < b.length; d++) e = b[d].href, e === a && (c = !0);
      return c
    },
    t = function(a) {
      "use strict";
      var d, e, b = document.getElementsByTagName("script"),
        c = !1;
      for (d = 0; d < b.length; d++) e = b[d].src, e === a && (c = !0);
      return c
    },
    u = function(a, b) {
      var e, f, c = a.length,
        d = 0;
      for (e = 0; c > e; e++) t(a[e] + "?t=20220113") ? (++d, d === c && b && b()) : (f = document.createElement("script"), f.type = "text/javascript", f.src = a[e] + "?t=20220113", f.charset = "utf-8", f.onload = function() {
        this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (++d, d === c && b && b())
      }, f.onerror = function() {
        ++d, d === c && b && b()
      }, document.getElementsByTagName("head")[0].appendChild(f))
    },
    v = function(a, b) {
      var e, f, c = a.length,
        d = 0;
      for (e = 0; c > e; e++) s(a[e] + "?t=20220113") ? (++d, d === c && b && b()) : (f = document.createElement("link"), f.type = "text/css", f.rel = "stylesheet", f.charset = "utf-8", f.href = a[e] + "?t=20220113", f.onload = function() {
        this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (++d, d === c && b && b())
      }, document.getElementsByTagName("head")[0].appendChild(f))
    },
    w = q(),
    x = r(),
    y = function() {
      var a = "";
      try {
        a = window.top == window ? "" : window.top.location.href
      } catch (b) {
        a = ""
      }
      return a
    },
    z = function(a, b, c, e) {
      var h, i, j, k, l, q, r, s, t, u, v, x, z, A, B, f = a["container"];
      if (!w) return f.innerHTML = a["flashTip"] || '<div style="position: absolute;width: 100%;height: 100%;background-color:white;text-align: center; padding-top: 50px;">请下载最新的 <a href="//www.adobe.com/go/getflashplayer" target="_blank" style="text-decoration:underline; ">Flash Player</a>  播放器. </div>', void 0;
      delete a["container"], h = a["scenesArr"], delete a["scenesArr"], i = [{
        bgId: "bgpano1",
        bgName: "剧场环境",
        path: h[0]["sceneImagePath"]
      }], j = "", k = h[0]["sceneVideoPath"], l = (h[0]["initPan"] || o) + 180, q = h[0]["initFov"] || n, r = h[0]["videoType"] || h[0]["sceneFormat"], s = a["playModel"], "Cinema" == s && (h[0]["sceneMode"] = "2DVideo", h[0]["sceneFilePath"] = k), h[0]["initPan"] = l, h[0]["initFov"] = q, h[0]["videoPT"] = h[0]["sceneModelPT"] || m, h[0]["bgPano"] = i, h[0]["videoType"] = r, a["base"] = location.href, t = y(), t && (a["topBase"] = t), a["scenesArr"] = h, j = JSON.stringify(a), j = j.replace(/\"/g, "'"), j = encodeURIComponent(j), j = "params=" + j, u = p("embed"), v = d("wmode") || "opaque", x = g + "?t=1", c && (x += "&vcode=" + c), e && (x += "&isShare=true"), z = {
        type: "application/x-shockwave-flash",
        src: x,
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
        wmode: v
      };
      for (A in z) u.setAttribute(A, z[A]);
      B = {
        position: "absolute",
        width: "100%",
        height: "100%",
        left: "0px",
        top: "0px"
      };
      for (A in B) u.style[A] = B[A];
      u.setAttribute("flashvars", j), f = f ? f : document.body, f.appendChild(u)
    },
    D = function(a, b, c, d, e, g) {
      var m, n, o, p;
      return !x && w ? (z(a, b, c, d), void 0) : (v([h]), m = a["scenesArr"], delete a["scenesArr"], n = [f, i], "ontouchstart" in window && n.push(k), o = /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia("(-webkit-video-playable-inline)")
        .matches, o && n.push(j), p = a["fsCallBack"], n.push(l), u(n, function() {
          a["scenesArr"] = m, E(a, b, c, d, e, g, p)
        }), void 0)
    },
    E = function(a, b, c, d, e, f, g) {
      "use strict";
      void 0 == a["useDefaultVideoBar"] ? !0 : !1;
      var i = {
        container: a["container"] || document.body,
        name: a["name"] || "UToVRDesk",
        dragDirectionMode: a["dragDirectionMode"],
        dragMode: a["dragMode"] || !1,
        webGLDeepBuffer: a["webGLDeepBuffer"] || !1,
        dragStarMode: a["dragStarMode"],
        DBViewIPD: a["DBViewIPD"],
        loadingImg: a["loadingImg"],
        CRType: e,
        CRImage: f,
        closeTransition: a["closeTransition"] || !1,
        initSceneId: a["initSceneId"] || "",
        isAutoRotate: a["isAutoRotate"] || !1,
        isMouseWheel: a["isMouseWheel"],
        isDBClick: a["isDBClick"],
        isDBViewPort: a["isDBViewPort"] || !1,
        isGyro: a["isGyro"] || !1,
        isDragAble: a["isDragAble"],
        fullScreenDom: a["fullScreenDom"],
        scenesArr: a["scenesArr"],
        loadedStartCallBack: function() {
          var c = this.api_getCurSceneType(),
            d = !1;
          d = void 0 == a["useDefaultVideoBar"] ? "Video" === c ? !0 : !1 : !!a["useDefaultVideoBar"], d && (B = new TWToolbarClass({
            container: this.target
          }, this, g, b), B && B.setDefault()), "function" == typeof a.loadedStartCallBack && a.loadedStartCallBack.call(this, B)
        },
        sceneResizeCallBack: function() {
          B && B.resize(), "function" == typeof a.sceneResizeCallBack && a.sceneResizeCallBack.call(this, B)
        },
        fullScreenChangeCallBack: function() {
          B && (B.resize(), B.setFullScreenStatus()), "function" == typeof a.fullScreenChangeCallBack && a.fullScreenChangeCallBack.call(this, B)
        },
        videoLoadProgressCallBack: function() {
          B && B.getUpdateBuffered(), "function" == typeof a.videoLoadProgressCallBack && a.videoLoadProgressCallBack.call(this, B)
        },
        videoTogglePlayCallBack: function() {
          B && B.setPlayStatus(), "function" == typeof a.videoTogglePlayCallBack && a.videoTogglePlayCallBack.call(this, B)
        },
        videoUpdateCallBack: function() {
          B && B.updateProperties(), "function" == typeof a.videoUpdateCallBack && a.videoUpdateCallBack.call(this, B)
        },
        videoLoadMetaDataCallBack: function() {
          B && B.updateProperties(), "function" == typeof a.videoLoadMetaDataCallBack && a.videoLoadMetaDataCallBack.call(this, B)
        },
        errorCallBack: function(b) {
          B && B.deleteBeginLayer(), "function" == typeof a.errorCallBack && a.errorCallBack(b)
        }
      };
      "function" == typeof a.videoCanPlayerCallBack && (i.videoCanPlayerCallBack = a.videoCanPlayerCallBack), "function" == typeof a.initOverCallBack && (i.initOverCallBack = a.initOverCallBack), "function" == typeof a.loadedCallBack && (i.loadedCallBack = a.loadedCallBack), "function" == typeof a.drawWebGLCallBack && (i.drawWebGLCallBack = a.drawWebGLCallBack), "function" == typeof a.videoPlayerCallBack && (i.videoPlayerCallBack = a.videoPlayerCallBack), "function" == typeof a.scenePanTiltFovChangerCallBack && (i.scenePanTiltFovChangerCallBack = a.scenePanTiltFovChangerCallBack), "function" == typeof a.sceneEventMoveCallBack && (i.sceneEventMoveCallBack = a.sceneEventMoveCallBack), "function" == typeof a.sceneEventUpCallBack && (i.sceneEventUpCallBack = a.sceneEventUpCallBack), "function" == typeof a.sceneEventClickCallBack && (i.sceneEventClickCallBack = a.sceneEventClickCallBack), "function" == typeof a.sceneEventDownCallBack && (i.sceneEventDownCallBack = a.sceneEventDownCallBack), "function" == typeof a.videoLoadStartCallBack && (i.videoLoadStartCallBack = a.videoLoadStartCallBack), "function" == typeof a.videoPlayEndCallBack && (i.videoPlayEndCallBack = a.videoPlayEndCallBack), "function" == typeof a.X5VideoExitFullscreen && (i.X5VideoExitFullscreen = a.X5VideoExitFullscreen), "function" == typeof a.X5VideoEnterFullscreen && (i.X5VideoEnterFullscreen = a.X5VideoEnterFullscreen), "function" == typeof a.setVideoCurTimeCallBack && (i.setVideoCurTimeCallBack = a.setVideoCurTimeCallBack), "function" == typeof a.changeSucessCallBack && (i.changeSucessCallBack = a.changeSucessCallBack), "function" == typeof a.changeErrorCallBack && (i.changeErrorCallBack = a.changeErrorCallBack), "function" == typeof a.vrStartCallBack && (i.vrStartCallBack = a.vrStartCallBack), "function" == typeof a.vrDrawCallBack && (i.vrDrawCallBack = a.vrDrawCallBack), new JTPlay(i)
    },
    F = function(a, b, c, d) {
      var e = "html5";
      return x ? D(a, b, c, d) : w ? (z(a, b, c, d), e = "flash") : D(a, b, c, d), e
    },
    G = function() {
      var a = window.location.search;
      return a.indexOf("playMode=html5") > 0 ? "html5" : a.indexOf("playMode=flash") > 0 ? "flash" : "auto"
    },
    H = function() {
      var a = navigator.userAgent,
        b = /TBS\/(\d+)/i.test(a) ? 1 * RegExp["$1"] : null;
      return b && b >= 36824 ? !0 : !1
    };
  window.initLoad = function(a, b, c, d, e) {
    var f, g, h;
    a && (f = G(), g = navigator.userAgent.toLowerCase(), 0 == a.scenesArr[0]["sceneFilePath"].indexOf("rtmp://") && (H() || (f = "flash")), !g.match(/firefox/) && "file:" == window.location.protocol && (f = "flash"), g.match(/msie|trident/) && (f = "flash"), !!g.match(/chrome\/(\d+\.\d)/) && 1 * g.match(/chrome\/(\d+\.\d)/)[1] < 30 && (f = "flash"), h = a.scenesArr[0]["sceneFileType"] || a.scenesArr[0]["sceneType"], "Image" == h && (f = "auto"), "html5" === f && x ? D(a, c, d, e) : "flash" === f ? z(a, c, d, e) : f = F(a, c, d, e), "function" == typeof b && b(f))
  }, window.initJTLoad = function(a) {
    var b = "iVBORw0KGgoAAAANSUhEUgAAAKAAAAAwCAMAAAChd4FcAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURUxpcf///////////////////////////////////////////////////////////////////6Sl3sMAAAARdFJOUwBxEVAf8cDQL4BgsJE+oOEHuYIOlQAABNpJREFUWMPtmOmS4yoMRhGb2Jf3f9krAU5Ix512bs2PnqmoKpvB5ljLJxwhPvaxj33sY3+jhfbLAV28Suh672H7Df7ZxniLscwpKka/nVFizOOLjjHKq4TF/jA1q2lAgAWWaSFMfzZL86Pt3RBB1CL2jpOcvaB6r+12r/oqoO74mtCegPT8PeDth9um8BLYOwipdXsPUKSO+n8CBq3Bg14GXwBV6DsgObA3dmp+A5A9rmt9GWVemyKcM13V65yzllK2AaiENDOcZD5MQFnJeTRFFjrBOLIB6NmdQtBgGNkSOG1+DG++Xh9e85uktzgP0oKAdQvvAqR5dWY3HUxi+lSy6whQPsTB/OQ/24QcaW2tezWR7zgPQA64aTdAXsUDeF5MLUD6KBFxekcBuAnokQHVW4ClCB3W+uaVM/nu2wTkueoADMrbBCGTH6sTC5AmBzwUqXLKhcBqy+fzq1DGjBsme80HXbXhuVZ/IDS89AR0R9xmDoowK5WzeAHSAX0AypFsbcnFBFRXZSZTrBLOdjKr7mUKLkD2Sb15kBQxjXMTwBHivdLz0psDUAKEqzqoa0+uT6FvM9fDeTMc2ZMPQAYqXt9z8GuR7ID7netRxZeFutGq2a+bO3IXzmbiSOd2AN6cwh4sbCkDf8ACpIqzNIacPWm77JuAhSOF9YHinNAaU20WB6AIFhEnoIq1xlsfXoDrcmGJfD1y9j3AMJVttfLmygqLP3M2aa2ml+QvUrJUH0WST0K8A9KccgjnyMGp6dycLH95USAcJqBISYoPbsuk88n+kOokj0kMSO0By7IVYn0LsR5MdBQfqni3FwVCp2lfYn3qsuVpNsM5w46ovBiuFc3stsYuW4Bu2yzkyWTugDhsLM/2bQcZed/P7esGUY7mgdxXORFcWsIxdHDbSZQFaMj48saxqmNbe5mrOdgopN+hHcn0SDi3UaMeh2rAvYpTCPfNKsQvOaiCZbezHOW3iiTctm6XbCokx7hLfsvmBvjs/R0Qpy7garqXAd28ctCm4ne2tz3yzXAAtY3xJmkPyEJdzZPVoxmR/KhBVvXwh5nbukPVuJC+BZSrLiR09yufkuwRjGJ/JV9a2YI+uN/4xPm4Yay0m8v6N/G5s9IzWLx64U5qviqX6rUiNQYbhY2pehvpGMiWamouQSpUIKpA4v0EDUOpuaaCHkf3BBopVGs+AU2UgCO/EOG8QE4N6bEnnz49JVKPbNYXaQU216VEoUZV0jFWzhhEQPpMhWWErlNCpCNEy3yR9095DDakNp1Ixum53p5s3X+ws6jvgCCCSIMgLUBak/b7wilRYWic5mEZclAMSPNEM6w/SmneIwqg0zw9bogE9rmpXrPHqN8BEcx4WGXAdgf0vXLgxs5Usqp3iMDPtAzYGJrBWlOj6Sm6Be9Mk/4roHvXmFDq3YMax7O0mysdgM15y4+kd0ANI7sCrv2QWyV6AxQYgoMnpQv4jkWvtCD530OsBP8vswDNBJScZhkfQ6w2wIUe9AAdIRaAScCfkGLaTMe0FUnjv3Im4Egpl4TkjHdFqFEk6RhegI3gPJPQnfHgKBK6KwN/BlD5FCXVIoJWMQJEosgkHnqsH0uSVNjUr5PcZAb96OaqWJDOSJYZ79mLS2ZogkiShz//0H7sY/+O/QfydW8spbNp3AAAAABJRU5ErkJggg==";
    D(a, null, null, null, 1, b)
  }, window.initHTML5Load = D, window.initFlashLoad = z, window.UTLoadOver = function(a) {
    var k, b = e + "/UtoVRPlayer.js",
      d = e + "/plugin/videoToolBar/style/videobar.css",
      f = e + "/plugin/videoToolBar/js/video_toolbar.js",
      g = e + "/plugin/inlineVideo/inlineVideo.js",
      h = e + "/plugin/gyro/gyro.js",
      i = e + "/plugin/hls/hls.js",
      j = [b, f];
    "ontouchstart" in window && j.push(h), k = /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia("(-webkit-video-playable-inline)")
      .matches, k && j.push(g), j.push(i), v([d]), u(j, function() {
        "function" == typeof a && a()
      })
  }, window.createUTPlayer = function(a, b, c, d, e, f) {
    E(a, b, c, d, e, f)
  }
}();