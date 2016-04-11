/**
 * Created by Lixin on 15/10/23.
 *
 * 按钮侦听
 *
 */

var _widthinput = document.getElementById('widthinput');
var _heightinput = document.getElementById('heightinput');
//输出框
var trace_div = document.getElementById('trace_div');
//按钮层
var button_div = document.getElementById('buttoncontainer');
//舞台容器
var container = document.getElementById('container');
//文本输出框
var sourceInput = document.getElementById('source');
//精度设置框
var precisioninput = document.getElementById('precisioninput');
//速度设置框
var speedinput = document.getElementById('speed');
//速度按钮
var arrowMoves = document.getElementById('arrowMoves');
trace_div.style.display = 'none';
function reload(e) {
    var _w = Number(_widthinput.value);
    var _h = Number(_heightinput.value);

    if (_w < 100 || _h < 100) {
        if (confirm('输入的舞台尺寸不合法（100-10000之间），是否以缓存的尺寸进行加载？')) {

        }
    } else {
        localStorage.setItem(appkey + 'width', _w);
        localStorage.setItem(appkey + 'height', _h);
        window.location.reload(true);
    }
}
//输出节点 （数组）
function trace_node(e) {
    viewIsShow(false);
    sourceInput.innerHTML = main.getNodeStr(false);
}
//输出节点 （json）
function trace_node_json(e) {
    viewIsShow(false);
    sourceInput.innerHTML = main.getNodeStr(true);
}
//输出轨迹 数组
function trace_speed() {
    viewIsShow(false);
    sourceInput.innerHTML = main.getTracks(false);
}
//输出轨迹 json
function trace_speed_json() {
    viewIsShow(false);
    sourceInput.innerHTML = main.getTracks(true);
}
//添加节点
function pushpoint(e) {
    main.pushPoint(-1, -1);
    main.pushPoint(-1, -1);
}
//设置舞台和ui是否显示
function viewIsShow(_b) {
    if (_b) {
        trace_div.style.display = 'none';
        container.style.zIndex = 1;
        button_div.style.zIndex = 2;
        //
        container.style.opacity = 1;
        button_div.style.opacity = 1;
    } else {
        trace_div.style.display = 'block';
        container.style.opacity = 0.1;
        button_div.style.opacity = 0.1;
        container.style.zIndex = -1;
        button_div.style.zIndex = -1;
        trace_div.zIndex = 1;
    }
}
function traceClose(e) {
    viewIsShow(true);
}
//设置精度
function precision(e) {
    var value = precisioninput.value;
    if (Number(value <= 0 || value > 20)) {
        precisioninput.value = main.precision;
        alert('精度数值应该满足>0&&<20');
    } else {
        main.precision = Number(value);

    }
}
//设置速度
function setspeed() {
    var value = Number(speedinput.value);
    if (value <= 0) {
        alert('速度应该  > 0');
        speedinput.value = main.speed;
    }
    else {
        main.speed = value;
    }
}
//
function movestart() {
    if (arrowMoves.innerHTML == '模拟运动') {
        main.arrowRun(true);
        arrowMoves.innerHTML = '停止模拟';
    } else {
        main.arrowRun(false);
        arrowMoves.innerHTML = '模拟运动';
    }
}
var list = [
    {name: 'reload', callback: reload},
    {name: 'trace_node', callback: trace_node},
    {name: 'pushpoint', callback: pushpoint},
    {name: 'close_btn', callback: traceClose},
    {name: 'trace_node_json', callback: trace_node_json},
    {name: "precision", callback: precision},
    {name: 'trace_speed', callback: trace_speed},
    {name: 'trace_speed_json', callback: trace_speed_json},
    {name: "setspeed", callback: setspeed},
    {name: "arrowMoves", callback: movestart}
];

function addEvents(id, callback) {
    document.getElementById(id).addEventListener('mousedown', callback);
}

for (var i in  list) {
    addEvents(list[i].name, list[i].callback);
}
upload_image.init(function (data) {
    main.changebgview(data);
}.bind(this), {width: 100, height: 100, x: 0, y: 0, alpha: 1}, {});

//
