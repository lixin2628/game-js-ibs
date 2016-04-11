/**
 * Created by Lixin on 16/4/8.
 */



var game = function () {
    this.init();
};
var g = game.prototype;

g.init = function () {
    this.pGame = new Phaser.Game('100%', '100%', Phaser.CANVAS, "game", {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
        render: this.render.bind(this)
    }, false, false);
};
g.preload = function () {

};
g.renderFunc = {};
g.create = function () {
    //绘制炮筒
    this.p = this.pGame.add.graphics(0, 0);
    this.p.beginFill(0x990000, 1);
    this.p.drawRect(0, 0, 100, 10);
    this.p.endFill();
    this.p.y = this.pGame.world.height / 2;
    this.p.x = 200;
    //draw end
    //炮弹起跳位置
    var start = {x: this.p.x, y: this.p.y};
    //炮弹弹道长度
    var dist = this.p.width;
    var self = this;
    //炮筒角度
    var angle = 0;
    ///
    this.p2 = this.pGame.add.graphics(0, 0);
    this.p2.beginFill(0x009900, 1);
    this.p2.drawCircle(0, 0, 10);
    this.p2.endFill();

    this.pGame.input.addMoveCallback(function (data) {
        //炮筒旋转角度
        angle = this.p.angle = relativeRadians({x: data.x, y: data.y}, {x: self.p.x, y: self.p.y});
        console.log(this.p.angle)
    }.bind(this), this);
    this.pGame.input.onUp.add(function (data) {
        //算出炮筒发射口位置
        /**
         * 受炮弹形状的影响，需要对角度进行补偿
         * */
        var out = getRotationPosition(start, dist, -(angle - 90));
        this.p2.x = out.x;
        this.p2.y = out.y;

        for (var i = 0; i < 20; i++) {
            var r = i * 18;
            new bullet(r, {x:data.x, y: data.y}, this.pGame);
        }

    }, this)
};
g.play = function () {

};
g.update = function () {

};
g.render = function () {
    for (var i in this.renderFunc) {
        this.renderFunc[i]();
    }
};


function relativeRadians(point1, point2) {
    var dx = point1.x - point2.y;
    var dy = point1.y - point2.y;
    var radians = Math.atan2(dy, dx);
    return radians * (180 / Math.PI);
}
function getRotationPosition(startpoint, dist, rotanums) {
    var rota;
    if (rotanums >= 360) {
        rota = rotanums % 360;
    } else if (rotanums < 0) {
        rota = 360 - (Math.abs(rotanums % 360));
    } else {
        rota = rotanums;
    }
    console.log(rota);
    //角度转弧度
    var ra = rota * (Math.PI / 180);
    return {x: startpoint.x + Math.sin(ra) * dist, y: startpoint.y + Math.cos(ra) * dist}

}
var Main = new game();