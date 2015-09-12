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
            [7,115,31,37],
            [47,117,28,38],
            [88,116,24,36],
            [125,117,26,35],
            [161,117,28,35],
            [202,115,29,37],
            [244,114,27,38],
            [289,116,25,36],
            [329,117,25,35],
            [368,115,27,37],
            [125,275,36,36],
            [166,287,38,36]

        ],
        animations: {
            standing:{
                frames:[0,1,2,3,4,5,6,7,8],
                next:true,
                speed:0.2
            },
            running:{
                frames:[9,10,11,12,13,14,15,16,17,18],
                next:true,
                speed:0.2
            },
            flying:{
                frames:[19,20],
                next:true,
                speed:0.5
            }
        }
    };
    this.spritesheet = new createjs.SpriteSheet(data);
    this.image = new createjs.Sprite(this.spritesheet,"standing");
    this.image.x = x;
    this.image.y = y;
    this.image.regX = 15;
    this.speed = [0,0];
    this.acc = [0,0];
    this.platform = null;
    this.lastPlatform = null;
    this.moving = false;
    this.face = "r";
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
 	this.health = 100;
};

Platform.size = [60,10];