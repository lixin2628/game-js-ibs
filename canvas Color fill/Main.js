/**
 * Created by Lixin on 16/4/11.
 */


var canvas = document.getElementsByTagName('canvas')[0];

var context = canvas.getContext('2d');
var img = new Image();
img.onload = function () {
    context.drawImage(img, 0, 0);
    var cf = new ColorFill(canvas);
};
img.src = 'testimg/test.png';