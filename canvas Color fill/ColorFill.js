/**
 * Created by Lixin on 16/4/11.
 */

/**
 * canvas 颜色填充
 * */
var ColorFill = function (canvas) {
    /**
     * 使用的画布元素或者 id名称
     * */
    if (typeof canvas == 'String') {
        canvas = document.getElementById(canvas);
    }
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('iphone') < 0 && ua.indexOf('ipad') < 0 && ua.indexOf('android') < 0) {
        this._listenerEventName = 'mousedown'
    }
    this.updatePixelData();
    this._addListener();
};

var _c = ColorFill.prototype;

/**
 * 要排除的颜色
 * */
ColorFill.Excluded = [];

/**
 * 是否使用缓存
 * */
ColorFill.cache = false;
/**
 * 缓存的块元素数组
 * */
_c.cacheList = [];
/**
 * 当前填充的颜色
 * */
_c._fillColor = {r: 255, g: 0, b: 0, a: 255};

/**
 * canvas数据环境
 * */
_c.context = null;
/**
 * canvas
 * */
_c.canvas = null;
/**
 *
 * */
_c.canvasData = null;
/**
 * 侦听事件
 * */
_c._listenerEventName = 'touchstart';
/**
 * 当前状态 0 暂停 1运行
 * */
_c._status = 1;
/**,event['touches']
 * 暂停
 * */
_c.pause = function () {
    this._status = 0;
};
/**
 * 继续
 * */
_c.continue = function () {
    this._status = 1;
};
/**
 * 刷新获取canvas数据
 * */
_c.updatePixelData = function () {
    this.canvasData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
};
/**
 * 设置填充颜色
 * */
_c.setFillColor = function (_c) {
    this.fillColor = Number(_c);
};

_c._addListener = function () {
    this.canvas.addEventListener(this._listenerEventName, this.onToucher.bind(this));
};
_c.onToucher = function (event) {
    if (this._status == 0)return;
    console.log(event);
    var position = event['touches'] ? {
        x: event['touches'][0].clientX,
        y: event['touches'][0].clientY
    } : {x: event.offsetX, y: event.offsetY};
    /**
     * canvas 尺寸
     * */
    var cscale = {w: event.target.clientWidth, h: event.target.clientHeight};

    //
    var scale = event.target.width / event.target.clientWidth;
    //console.log(position, cscale, event.target.width, event.target.height);
    position = {x: Math.round(position.x * scale), y: Math.round(position.y * scale)};
    console.log(position);
    this.fillSelectPixels(position);
};
/**
 * 更新像素填充
 * */
_c.fillSelectPixels = function (pos) {

    var canvasData = this.canvasData;
    var pixelsData = canvasData.data;
    var touchIndex = (pos.x + pos.y * this.canvas.width) * 4;
    var color = {
        red: pixelsData[touchIndex],
        green: pixelsData[touchIndex + 1],
        blue: pixelsData[touchIndex + 2],
        alpha: pixelsData[touchIndex + 3]
    };
    //保存同色数组开始的索引
    var indexlist = [];
    var self = this;
    console.log('11');

    var _list = PixelsCalculate(touchIndex);
    console.log('1111', _list.length);

    indexlist = indexlist.concat(_list);
    updateIndex(_list);
    console.log('1');
    /**
     * 向上 & 向下搜索
     * */
    function updateIndex(list) {
        var nextlist = [];
        for (var t = 0; t < list.length; t++) {
            var last = list[t] - self.canvas.width * 4;
            var next = list[t] + self.canvas.width * 4;
            if (last >= 0) {
                if (pixelsData[last] == color.red && pixelsData[last + 1] == color.green && pixelsData[last + 2] == color.blue && pixelsData[last + 3] == color.alpha) {
                    pixelsData[last] = self._fillColor.r;
                    pixelsData[last + 1] = self._fillColor.g;
                    pixelsData[last + 2] = self._fillColor.b;
                    pixelsData[last + 3] = self._fillColor.a
                }
                nextlist = nextlist.concat(PixelsCalculate(last));
            }
            if (next <= pixelsData.length - 4) {
                if (pixelsData[next] == color.red && pixelsData[next + 1] == color.green && pixelsData[next + 2] == color.blue && pixelsData[next + 3] == color.alpha) {
                    pixelsData[next] = self._fillColor.r;
                    pixelsData[next + 1] = self._fillColor.g;
                    pixelsData[next + 2] = self._fillColor.b;
                    pixelsData[next + 3] = self._fillColor.a
                }
                nextlist = nextlist.concat(PixelsCalculate(next));
            }
        }
        // console.log(nextlist)
        if (nextlist.length > 0) {
            indexlist = indexlist.concat(nextlist);
            updateIndex(nextlist);
        }
    }

    /**
     * 横向搜索检测
     * */
    function PixelsCalculate(index) {
        //
        var list = [];
        /**
         * 向前搜索
         * */
        var i = 0;
        for (i = index - 4; i >= 4; i -= 4) {
            //同色，替换
            if (pixelsData[i] == color.red && pixelsData[i + 1] == color.green && pixelsData[i + 2] == color.blue && pixelsData[i + 3] == color.alpha) {
                pixelsData[i] = self._fillColor.r;
                pixelsData[i + 1] = self._fillColor.g;
                pixelsData[i + 2] = self._fillColor.b;
                pixelsData[i + 3] = self._fillColor.a;
                list.push(i);
            }
            else {
                break;
            }
        }
        /**
         * 向后搜索
         * */
        for (i = index + 4; i < pixelsData.length; i += 4) {
            //同色，替换
            if (pixelsData[i] == color.red && pixelsData[i + 1] == color.green && pixelsData[i + 2] == color.blue && pixelsData[i + 3] == color.alpha) {
                pixelsData[i] = self._fillColor.r;
                pixelsData[i + 1] = self._fillColor.g;
                pixelsData[i + 2] = self._fillColor.b;
                pixelsData[i + 3] = self._fillColor.a;
                list.push(i);
            }
            else {
                break;
            }
        }
        return list;
    }

    console.log('111111');

    pixelsData[touchIndex] = this._fillColor.r;
    pixelsData[touchIndex + 1] = this._fillColor.g;
    pixelsData[touchIndex + 2] = this._fillColor.b;
    pixelsData[touchIndex + 3] = this._fillColor.a;
    canvasData.data = pixelsData;
    indexlist = indexlist.push(touchIndex);
    this.context.putImageData(canvasData, 0, 0);
    this.canvasData = canvasData;


};

