/**
 * Created by Lixin on 16/3/1.
 *
 * UIReader 配置文件解析器
 *
 */

var UIReaderCreater = function (config, game) {
    var group = game.make.spriteBatch();
    group['assets'] = {};
    var assetslist = config.assets;
    for (var i = 0; i < assetslist.length; i++) {
        var elements = assetslist[i];
        var display = new UIReaderCreater_createDisplay(elements, game);
        group['assets'][display.name] = display;
        group.addChild(display);
    }
    return group;
};

/**
 *
 * create display
 *
 * */
var UIReaderCreater_createDisplay = function (elements, game) {
    var display;
    if (elements.type == 'image') {
        display = game.make.sprite(elements.x, elements.y, elements.resname);
    }
    else if (elements.type == 'text') {
        var color = "#" + ( elements.color.toString(16).length == 4 ? '00' + elements.color.toString(16) : elements.color.toString(16));
        display = game.make.text(0, 0, elements.text, {
            font: elements.size.toString() + "px Arial",
            fill: color,
            align: elements.align,
            boundsAlignH: elements.align
        });
    }
    else if (elements.type == 'node') {
        display = new UIReaderCreater_createNoder(elements, game);
    }
    display.name = elements.name;
    display.inputEnabled = elements.touch;
    display.scale.set(elements.scaleX, elements.scaleY);
    if (display.anchor) {
        display.anchor.set(elements.anchorX, elements.anchorY);
    }
    display.visible = elements.visible;
    display.rotation = elements.rotation;
    if (elements.type != 'text') {
        display.width = elements.width;
        display.height = elements.height;
    }
    else {
        display.setTextBounds(elements.x, elements.y, elements.width, elements.height);
    }
    display.alpha = elements.alpha;


    return display;

};
/**
 *
 * create sprite batch
 *
 * */
var UIReaderCreater_createNoder = function (config, game) {

    var group = game.make.spriteBatch();
    group['assets'] = {};
    var list = config.list;
    for (var i = 0; i < list.length; i++) {
        var elements = config.list[i];
        var display = new UIReaderCreater_createDisplay(elements, game);
        group['assets'][display.name] = display;
        group.addChild(display);
    }
    return group;
};