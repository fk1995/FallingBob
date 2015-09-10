/**
 * Created by fangkai on 2015/9/9.
 */
var Ball;
Ball = function (x,y) {
    this.type = "Ball";
    var data = {
        images: ["static/ball.png"],
        frames: {width:20, height:20}
    };
    this.spritesheet = new createjs.SpriteSheet(data);
    this.image = new createjs.Sprite(this.spritesheet);
    this.image.x = x;
    this.image.y = y;
    this.speed = [0,0];
    this.acc = [0,0];
    this.platform = null;
    this.moving = false;
};


var Platform;
Platform = function(x,y,type){
    this.type = "Platform";
    this.kind = type;
    var data = {
        images: ["static/platform-" + this.kind + ".png"],
        frames: {width:60, height:10}
    };

    this.spritesheet = new createjs.SpriteSheet(data);
    this.image = new createjs.Sprite(this.spritesheet);
    this.image.x = x;
    this.image.y = y;

};