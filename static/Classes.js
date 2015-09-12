/**
 * Created by fangkai on 2015/9/9.
 */
var Ball;
Ball = function (x,y) {
    this.type = "Ball";
    var data = {
        images: ["static/Spongebob.png"],
        frames: [
            [6,11,29,35],
            [40,11,29,35],
            [75,11,29,35],
            [109,11,29,35],
            [145,11,29,35],
            [181,11,29,35],
            [217,11,29,35],
            [253,11,29,35],
            [292,11,29,35],


        ],
        animations: {
            standing:{
                frames:[0,1,2,3,4,5,6,7,8],
                next:true,
                speed:0.2
            }
        }
    };
    this.spritesheet = new createjs.SpriteSheet(data);
    this.image = new createjs.Sprite(this.spritesheet,"standing");
    this.image.x = x;
    this.image.y = y;
    this.speed = [0,0];
    this.acc = [0,0];
    this.platform = null;
    this.lastPlatform = null;
    this.moving = false;
};
Ball.size = [29,35];

var Platform;
Platform = function(x,y,type){
    this.type = "Platform";
    this.kind = type;
    var data = {
        images: ["static/platform-" + this.kind + ".png"],
        frames: {width:60, height:15}
    };

    this.spritesheet = new createjs.SpriteSheet(data);
    this.image = new createjs.Sprite(this.spritesheet);
    if (this.kind == "invisible"){
        this.image.alpha = 0.02;
    }
    this.image.x = x;
    this.image.y = y;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.range = 0;
    this.counter = 0;
};

Platform.size = [60,10];