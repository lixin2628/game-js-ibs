/**
 * Created by Lixin on 16/1/5.
 */

/**
 * 加载 js 文件
 * **/
/**
 window.loadJSFile(['xxxx.js','xxxxx.js','ccccc.js'],function () {})
 **/
/**
 * 文件列表*/

window.jsFileList = [];
window.jsFileLoadCallBack = null;
window.currentLoadId = 0;
window.loadJSFile = function (_jshreflist, _cb) {
    if (!_jshreflist)return;
    if (_cb)window.jsFileLoadCallBack = _cb;
    window.jsFileList = window.jsFileList.length > 0 ? window.jsFileList.concat(_jshreflist) : _jshreflist;
    window.currentLoadId = 0;
    window.JsFileQueueLoad();
};
/**
 * 队列加载
 * **/
window.JsFileQueueLoad = function () {
    window.JsFilePreLoad(window.jsFileList[window.currentLoadId], function () {
        window.currentLoadId += 1;
        if (window.currentLoadId < window.jsFileList.length) {
            window.JsFileQueueLoad();
        } else {
            if (window.jsFileLoadCallBack) {
                window.jsFileLoadCallBack();
                window.jsFileLoadCallBack = null;
                window.jsFileList = [];
            }
        }
    })
};
window.JsFilePreLoad = function (_url, _cb) {
    var head = document.getElementsByTagName('HEAD').item(0);
    var script = document.createElement("script");
    script.type = "text/javascript";
    var _id = "js_" + new Date().getTime();
    script.id = _id;
    script.src = _url;
    head.appendChild(script);
    script.onload = _cb;
    script.onerror = _cb;
};