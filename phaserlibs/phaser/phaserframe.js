/**
 * Created by Lixin on 16/3/1.
 *
 * phaser tools class
 */
var phaserframe = {


    //Math

    math: {
        //求距
        dist: function (point1, point2) {
            var dx = point1.x - point2.x;
            var dy = point1.y - point2.y;
            return Math.sqrt(dx * dx + dy * dy);
        },

        /*
         * 计算两个点：B相对于A的角度
         * */
        relativeRadians: function (pointA, pointB) {
            var dx = pointA.x - pointB.x;
            var dy = pointA.y - pointB.y;
            var radians = Math.atan2(dy, dx);//弧度
            return this.radiansToRotate(radians);

        },

        //弧度转换角度
        radiansToRotate: function (ra) {
            return ra * 180 / Math.PI;
        },

        /*
         * 角速度
         * 匀速非常规运动
         * */
        rotateSpeed: function (endPoint,
                               startPoint,
                               speed) {
            //
            var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
            return {vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed};
        }
    },
    /**
     * set canvas center
     * */
    game: null,

    setCanvasAlign: function (divId) {
        var div = document.getElementById(divId);
        var canvas = document.getElementsByTagName('canvas')[0] || document.getElementsByTagNameNS('canvas')[0];
        var scale = getCanvasScale(canvas);
        var stageScale = this.getWindowScale();
        var self = this;
        setInterval(function () {
            var _s1 = getCanvasScale(canvas);
            var _s2 = self.getWindowScale();
            div.style.marginLeft = '0';
            div.style.marginTop = '0';
            if ((_s1.w == _s2.w || _s1.h == _s2.h)) {
                var left = ( _s2.w - _s1.w) / 2 + 'px';
                if (div.style.marginLeft && div.style.marginLeft != left) div.style.marginLeft = left;
                var tops = ( _s2.h - _s1.h) / 2 + 'px';
                if (div.style.marginTop && div.style.marginTop != tops)div.style.marginTop = tops;
                scale = _s1;
                stageScale = _s2;
            }
        }, 1000 / 5);

        function getCanvasScale(_canvas) {
            return {
                w: Number(_canvas.style.width.substr(0, _canvas.style.width.length - 2)) || 0,
                h: Number(_canvas.style.height.substr(0, _canvas.style.height.length - 2)) || 0
            }
        }
    },

    /**
     * window scale
     * */

    getWindowScale: function () {
        return {w: document.body.clientWidth, h: window.innerHeight}
    },

    /**
     *Display rotated to tips(level or vertical)
     * */
    showTips: function (islevel) {
        if (!document.getElementById('game_rotated_tips')) {
            var _w = document.body.clientWidth;
            var _h = window.innerHeight;
            var img = document.createElement('img');
            img.src = islevel ? phaserTools.base_img.rotate_level_tips : phaserTools.base_img.rotate_vertical_tips;
            img.id = 'game_rotated_tips';
            img.style.position = 'absolute';
            img.style.zIndex = '999998';
            img.style.left = (_w - img.width) / 2 + 'px';
            img.style.top = (_h - img.height) / 2 + 'px';
            var _background = document.createElement('div');
            _background.style.backgroundColor = '#ffffff';
            _background.style.position = 'absolute';
            _background.style.width = _w + 'px';
            _background.style.height = _h + 'px';
            _background.style.zIndex = '999990';
            _background.style.left = '0px';
            _background.style.top = '0px';
            document.body.appendChild(_background);
            document.body.appendChild(img);
            var t = setInterval(function () {
                if (document.body.clientWidth > window.innerHeight && islevel) {
                    document.body.removeChild(img);
                    document.body.removeChild(_background);
                    clearInterval(t)
                }
                else if (document.body.clientWidth < window.innerHeight && !islevel) {
                    document.body.removeChild(img);
                    document.body.removeChild(_background);
                    clearInterval(t)
                }

            }, 1000 / 10)
        }
    },

    /***
     *  load resource config file
     * */
    loadResourceConfig: function (cb, game) {
        var _game = game ? game : this.game;

        _game.load.onFileComplete.addOnce(function () {
            //_game.load.onFileComplete.removeAll();
            var res = _game.cache.getJSON('res');
            //重写资源格式
            var group = res['groups'];
            var resource = res['resources'];
            var res_object = {};
            //格式化资源对象
            for (var r = 0; r < resource.length; r++) {
                res_object[resource[r]['name']] = resource[r];
            }
            //创建组索引
            for (var i = 0; i < group.length; i++) {
                var current_grouplist = group[i]['keys'].split(',');
                var current_object = phaserframe.res[group[i]['name']] = [];
                for (var j = 0; j < current_grouplist.length; j++) {
                    current_object.push(res_object[current_grouplist[j]]);
                }
            }
            if (cb)cb(phaserframe.res)

        }, this);
        _game.load.json('res', this.resource_href, false);
        _game.load.start();
    },
    /***
     *  加载资源文件
     *  { 文件列表 | 加载过程中回调 | 加载完成回调 }
     *
     *  {
     *      文件列表:
     *      [
     *          {name:'xxx',type:'json/image,url:'tttttt'}
     *          ]
     *      }
     * */
    resload: function (list, complete_cb, progress_cb, game) {
        var _game = game ? game : this.game;
        var self = this;
        if (progress_cb)this.game.load.onFileComplete.add(progress_cb, this);
        this.game.load.onLoadComplete.addOnce(function () {
            if (complete_cb)complete_cb();
        }, this);

        for (var i = 0; i < list.length; i++) {
            var _type = list[i]['type'];
            if (_type == 'sound')_type = 'audio';
            if (_type != 'bin') {
                _game.load[_type](list[i]['name'], 'resource/' + list[i].url, false);
            } else {
                //动画资源表
                var data = list[i].name.split('-')[1].split('x');
                _game.load.spritesheet(list[i]['name'], 'resource/' + list[i].url, Number(data[0]), Number(data[1]), Number(data[2]));

            }
        }
        //_game.load.start();

    },
    /**
     * 读取配置文件列表
     * */
    getAssetsGroup: function (_groupName) {

        if (!phaserframe.res || !phaserframe.res.hasOwnProperty(_groupName)) {
            return [];
        }
        return phaserframe.res[_groupName];

    }
};

phaserframe.resource_href = 'resource/resource.json';

phaserframe.res = {};

phaserframe.base_img = {
    rotate_level_tips: "data:image/png;base64,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",
    rotate_vertical_tips: "data:image/png;base64,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"
};