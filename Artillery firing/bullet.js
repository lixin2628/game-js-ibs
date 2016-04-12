/**
 * Created by Lixin on 16/4/8.
 * 炮弹
 */

var bullet = function (rota, play, game) {

    this.create(rota, play, game);
};
var b = bullet.prototype;

b.create = function (rota, play, game) {
    /*
     炮弹的显示对象
     */
    var ball = game.add.graphics(play.x, play.y);
    ball.beginFill(0xffffff, 1);
    ball.drawCircle(0, 0, 10);
    ball.endFill();
    /*
     初始速度
     */
    var vspeed = 5;
    /*
     重力加速度
     */
    var g = 0.2;
    /*
     * 运动起点
     * */
    var startpos = play;
    /*
     初始角度
     */
    var angel = rota;
    /*
     运行时间
     * */
    var t = 0;
    /*
     计算x和y轴速度初始值
     */
    var vx = Math.cos(angel * Math.PI / 180) * vspeed;
    var vy = Math.sin(angel * Math.PI / 180) * vspeed;
    var func_id = 'ball' + Math.floor(Math.random()*10000000).toString();
    Main.renderFunc[func_id] = function () {
        t++;
        ball.x = startpos.x + vx * t;
        ball.y = startpos.y + vy * t + 0.5 * g * t * t;
    }.bind(this)
};

function rotateSpeed(endPoint, startPoint, speed) {
    var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    return {vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed};
}