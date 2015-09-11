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
    this.lastPlatform = null;
    this.moving = false;
};
Ball.size = [20,20];

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
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.range = 0;

};

Platform.size = [60,10];