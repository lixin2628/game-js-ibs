/**
 * Created by Lixin on 16/4/12.
 *
 * game init
 *
 */

var GameMain = function () {
    this.init();
};
var gm = GameMain.prototype;

gm.init = function () {
    Game.phaser = new Phaser.Game(1280, 768, Phaser.CANVAS, 'gameCanvas', {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
        render: this.render.bind(this)
    }, true);
};
gm.preload = function () {
    this.game = Game.phaser;
    phaserframe.game = Game.phaser;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.windowConstraints.bottom = "visual";
    phaserframe.setCanvasAlign('gameCanvas');
    Game.w = this.game.world.width;
    Game.h = this.game.world.height;
};
gm.create = function () {
    /**
     * =====================  Loading viewer =====================
     * */
    var self = this;
    var txt = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2, 'L O A D I N G', {
        font: '26px Arial',
        fill: '#ffffff'
    });
    txt.anchor.set(0.5, 0.5);
    phaserframe.loadResourceConfig(function () {
        phaserframe.resload(phaserframe.getAssetsGroup('preload'),
            function () {
                self.start();
                txt.kill();
            }, function (_p) {
                console.log('progress ,', _p);
                txt.setText('L O A D I N G ' + _p.toString() + '%')
            })
    })
    /**
     * =====================Loading viewer end====================
     * */
};
gm.start = function () {

    console.log('Game init Ended!');
};
gm.update = function () {
    for (var i in Game.update) {
        Game.update[i]();
    }
};
gm.render = function () {
    for (var i in Game.render) {
        Game.render[i]();
    }
};


/**
 * start
 * */
window.addEventListener('load', function () {
    window.games = new GameMain();
});