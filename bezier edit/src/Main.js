/**
 * Created by Lixin on 15/9/11.
 */

var appkey = '78t67r5cftyinuojmkp,l;oKMJ(*&^%DRGVYBHY&*^T____'
function Main() {
    //...constructor
    //实例化一个Game
    //Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias, physicsConfig);
    /**
     * @param {number|string}      [width=1000，“99"]       舞台的宽度。该值为number类型时，定义舞台的宽度=width px . 当值为字符串时，则按 屏幕实际尺寸的百分比计算
     * @param {number|string }     [height=800,"20"]        舞台的高度.（描述如上）
     * @param {object}             [renderer=Phaser.AUTO]   渲染器类型，包括 'Phaser.WEBGL' 'Phaser.CANVAS' 'Phaser.AUTO'(自动检测) 'Phaser.HEADLESS' （不进行渲染/没有支持的类型）
     * @param {string|HTMLElement} [parent='']              Canvas的父级，可以是Element 的id值，也可以直接传入Element，游戏所需的Canvas会被插入在父级元素内创建
     * @param {object} [state=null]                         默认初始化对象 , 包括 (preload, create, update/更新, render/渲染)，也可以为空
     * @param {boolean} [transparent=false]                 定义Cavans 背景的类型 （是否透明）
     * @param {boolean} [antialias=true]                    图像平滑功能。如果游戏为像素风，此值应该为false
     * @param {object} [physicsConfig=null]                 物理引擎配置文件（如果使用了的话）
     * **/


}
//
Main.prototype.background = null;
Main.prototype.down = false;
Main.prototype.lock = null;
Main.prototype.isLock = true;
Main.prototype.currentOffset = null;
//精度
Main.prototype.precision = 10;
//轨迹数组
Main.prototype.tracks = [];
//轨迹速度
Main.prototype.speed = 1;
//箭头
Main.prototype.arrow = null;
//箭头当前运动的frame
Main.prototype.arrowFrame = 0;
/*
 * 角速度
 * 匀速非常规运动
 * */
function rotateSpeed(endPoint, startPoint, speed) {
    var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    return {vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed};
}

//求出两点距离
function getdists(point1, point2) {
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}


//设置背景图像
Main.prototype.changebgview = function (basedata) {
    if (this.background != null) {
        game.world.removeChild(this.background);
    } else {
        this.isLock = false;
        this.locktouch();

    }
    var key = 'bg';
    var data = new Image();
    data.src = basedata;
    data.onload = function () {
        game.cache.addImage(key, basedata, data);
        this.background = game.add.sprite(0, 0, key, 0);
        game.world.setChildIndex(this.background, 0);
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(function (e) {
            this.currentOffset = {
                x: game.input.activePointer.x - this.background.x,
                y: game.input.activePointer.y - this.background.y
            };
            console.log(this.currentOffset, this.background.x, this.background.y);
            this.down = true;

        }, this);
        this.background.events.onInputUp.add(function (e) {
            this.down = false;
        }, this)

    }.bind(this)

};
//锁 点击
Main.prototype.locktouch = function () {
    console.log('lock');
    this.isLock = !this.isLock;
    game.world.removeChild(this.lock);
    if (this.isLock) {
        this.lock = game.add.sprite(0, 0, 'lock', 0);
    } else {
        this.lock = game.add.sprite(0, 0, 'unlock', 0);
    }
    this.lock.x = 20;
    this.lock.y = 20;
    this.lock.scale.set(0.5);
    this.lock.inputEnabled = true;
    this.lock.events.onInputDown.add(this.locktouch, this);
}
Main.prototype.preload = function () {
    /**
     * @param {string} [name]                加载对象key的名称，用来调用图像纹理时使用
     * @param {string} [url='/xxx.png']      加载对象的地址
     * @param {boolean} [overwrite=false]    如果缓存对象内存在一个key名相同的元素，是否进行覆盖
     */
    this.game.load.image('button', 'button.png', true);
    this.game.load.image('button_2', 'button_2.png', true);
    this.game.load.image('lock', 'lock.png', true);
    this.game.load.image('unlock', 'unlock.png', true);
    this.game.load.image('arrow', 'arrow.png', true);
};
//添加一个点到舞台
Main.prototype.pushPoint = function (_x, _y) {
    if (_x == -1) {
        _x = Math.min(this.circlelist[this.circlelist.length - 1].x + 20, game.world.width - 40);
        _y = this.circlelist[this.circlelist.length - 1].y;
    }
    // if (this.circlelist.length > 0)console.log(this.circlelist[this.circlelist.length - 1].x);
    var _name = (this.circlelist.length != 0 && this.circlelist.length % 2 != 0 ? 'button_2' : 'button');
    this.button = game.add.sprite(_x, _y, _name, 0);
    this.button.anchor.set(0.5);
    this.button.scale.set(0.5);
    this.button.inputEnabled = true;
    this.button.input.enableDrag(true);


    this.circlelist.push(this.button);
}
/**
 *
 * 根据速度计算轨迹
 *
 * **/
Main.prototype.getTracks = function (isJson) {
    //当前坐标点
    var currentPoint = this.maplist[0];
    var currentIndex = 1;
    this.tracks = [];
    this.tracks.push(currentPoint);
    //
    var _str = isJson ? "{\"data\":{\"x\":" + getRoundNumber(this.maplist[0].x) + ",\"y\":" + getRoundNumber(this.maplist[0].y) + "}," : "[[" + getRoundNumber(this.maplist[0].x) + "," + getRoundNumber(this.maplist[0].y) + "],";
    var _sem = "";
    //
    for (var i = 0; i < 20000; i++) {
        //用距离判断是否已经绘制完成
        var dist = Math.floor(getdists(currentPoint, this.maplist[currentIndex]));
        //console.log(dist);
        if (dist <= this.speed) {
            if (currentIndex < this.maplist.length - 1) {
                currentIndex++;
            }
            else {
                _str += isJson ? "}" : "]";
                return _str;
            }
        }
        //求出点位置
        var speed = rotateSpeed(this.maplist[currentIndex], currentPoint, this.speed);
        currentPoint.x += speed.vx;
        currentPoint.y += speed.vy;
        //添加到数组
        this.tracks.push({x: currentPoint.x, y: currentPoint.y});
        //   currentPoint.x = Math.floor(currentPoint.x);
        // currentPoint.y = Math.floor(currentPoint.y);
        _str += isJson ? _sem + "{\"x\":" + getRoundNumber(currentPoint.x) + "," + "\"y\":" + getRoundNumber(currentPoint.y) + "}" : _sem + "[" + getRoundNumber(currentPoint.x) + "," + getRoundNumber(currentPoint.y) + "]";
        _sem = ",";
    }
    //  console.log(_str);
    return _str;


}
function getRoundNumber(_number) {

    return Math.round(_number * 100) / 100;
}
/**
 * 读取节点
 * isJson :是否返回json格式字符串
 * */
Main.prototype.getNodeStr = function (isJson) {
    var _str = isJson ? "{\"data\":[" : "[";
    var _sem = '';
    for (var i in this.circlelist) {
        _str += isJson ? _sem + "{\"x\":" + Math.floor(this.circlelist[i].x) + ",\"y\":" + Math.floor(this.circlelist[i].y) + "}" :
        _sem + '[' + Math.floor(this.circlelist[i].x) + ',' + Math.floor(this.circlelist[i].y) + ']';
        _sem = ',';
    }
    _str += isJson ? "]}" : ']';
    //输出实现方式
    _str += '\n\n—JS Function Code-\n\n';
    _str += "\n//This array holds values are plotted points\n";
    _str += '\nvar drawPointlist=[];';
    _str += "\n\n//NodeList is to get an array of nodes";
    _str += "\n\nfor (var i = 0; i < nodelist.length - 2; i += 2) {" +
    "\n\n&nbsp;&nbsp;var p1 = {x: nodelist[i].x, y: nodelist[i].y};" +

    "\n\n&nbsp;&nbsp;var p2 = {x: nodelist[i + 1].x, y: nodelist[i + 1].y};" +

    "\n\n&nbsp;&nbsp;var p3 = {x: nodelist[i + 2].x, y: nodelist[i + 2].y};" +

    "\n\n&nbsp;&nbsp;var pos_x, pos_y;" +

    "\n\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (var t = 0; t <= 1; t += 1 / " + this.precision + ") {" +

    "\n\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pos_x = Math.pow((1 - t), 2) * p1.x + 2 * t * (1 - t) * p2.x + Math.pow(t, 2) * p3.x;" +

    "\n\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pos_y = Math.pow((1 - t), 2) * p1.y + 2 * t * (1 - t) * p2.y + Math.pow(t, 2) * p3.y;" +

    "\n\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;drawPointlist.push({x:pos_x, y:pos_y});" +

    "\n\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp}" +

    "\n\n&nbsp;&nbsp;};";

    //
    _str += '\n//..\n//Please use drawPointlist to draw'

    return _str;
}

Main.prototype.create = function () {
    //
    this.circlelist = [];
    this.pushPoint(100, 100);
    this.pushPoint(150, 100);
    this.pushPoint(200, 100);
    this.arrow = game.add.sprite(0, 0, 'arrow', 0);
    this.arrow.anchor.set(0.5);
    this.arrow.visible = false;
};
Main.prototype.maplist = [];
//箭头运动
Main.prototype.arrowRun = function (_b) {
    this.arrow.visible = _b;
    this.arrowFrame = 0;
    this.getTracks();
    this.arrow.x = this.tracks[this.arrowFrame].x;
    this.arrow.y = this.tracks[this.arrowFrame].y;
}
Main.prototype.render = function () {
    if (this.background != null && this.down && !this.isLock) {
        this.background.x = game.input.activePointer.x - this.currentOffset.x;
        this.background.y = game.input.activePointer.y - this.currentOffset.y;
    }
    if (this.arrow.visible) {
        if (this.arrowFrame < this.tracks.length - 1) {
            this.arrowFrame += 1;
        } else {
            this.arrowFrame = 0;
        }
        this.arrow.x = this.tracks[this.arrowFrame].x;
        this.arrow.y = this.tracks[this.arrowFrame].y;
    }

    this.maplist = [];
    if (!this.circlelist) return;
    game.context.strokeStyle = 'rgb(0,255,255)';
    game.context.beginPath();
    //
    for (var i = 0; i < this.circlelist.length - 2; i += 2) {
        var p1 = {x: this.circlelist[i].x, y: this.circlelist[i].y};
        var p2 = {x: this.circlelist[i + 1].x, y: this.circlelist[i + 1].y};
        var p3 = {x: this.circlelist[i + 2].x, y: this.circlelist[i + 2].y};
        var pos_x, pos_y;
        //t+=xxx  标示绘制间隔
        for (var t = 0; t <= 1; t += 1 / this.precision) {
            pos_x = Math.pow((1 - t), 2) * p1.x + 2 * t * (1 - t) * p2.x + Math.pow(t, 2) * p3.x;
            pos_y = Math.pow((1 - t), 2) * p1.y + 2 * t * (1 - t) * p2.y + Math.pow(t, 2) * p3.y;
            /**
             * 拿到位置点，用来计算坐标
             * **/
            this.maplist.push(new Phaser.Point(pos_x, pos_y));
            if (this.maplist.length == 1) {
                game.context.moveTo(this.maplist[0].x, this.maplist[0].y);
            } else {
                game.context.lineTo(this.maplist[this.maplist.length - 1].x, this.maplist[this.maplist.length - 1].y);
            }

            //
            //this.drawGuide(Data.PointList[i + 1], Data.PointList[i] + 2);
        }
    }
    game.context.stroke();
    game.context.closePath();


}
Main.prototype.update = function () {


};

var game;
var main;
//
window.onload = function () {
    main = new Main();
    var toolsWidth = document.getElementById('buttoncontainer').style.width.substr(0, document.getElementById('buttoncontainer').style.width.length - 2);
    toolsWidth = Number(toolsWidth) + 30;
    var _top = 40;
    var width = localStorage.getItem(appkey + 'width') ? Number(localStorage.getItem(appkey + 'width')) : document.body.clientWidth - 220;
    var height = localStorage.getItem(appkey + 'height') ? Number(localStorage.getItem(appkey + 'height')) : window.innerHeight - _top;
    //
    var left = document.body.clientWidth > width ? (document.body.clientWidth - width) / 2 : 0;
    document.getElementById('container').style.marginLeft = Math.max(toolsWidth, left) + 'px';
    _widthinput.value = width;
    _heightinput.value = height;

    game = new Phaser.Game(width, height, Phaser.CANVAS, 'container', {
        preload: main.preload,
        create: main.create.bind(main),
        update: main.update.bind(main),
        render: main.render.bind(main)
    }, false);

}

