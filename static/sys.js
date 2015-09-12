/**
 * Created by fangkai on 2015/9/9.
 */
var KEYLEFT  = 37;
var KEYUP    = 38;
var KEYRIGHT = 39;
var KEYDOWN  = 40;
var KEYSPACE = 32;
var MAXSPEED= -4;
var MAXHORIZONTALSPEED = 10;
var MAXSCROLLSPEED = 7;
var MAXGRAVITY = 2;
var BELTSPEED = 3;
var PLATFORMS = ["normal","bouncing","rolling","normal","bouncing","rovering","transient","invisible","spike"];
var ITEMS= ["burger"];
var CANVASSIZE = [640,600];


function init() {
    // create stage object. It will be the closure where we set our other objects.
    var GAMEOVER = false;
    var SCROLLSPEED = 4;
    var GRAVITY = 1;
    var stage = new createjs.Stage("Canvas");

    var move;
    // set ticker function
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.framerate = 60;
    var initial_pos = [(CANVASSIZE[0]-50) * Math.random(),300];
    var ball = new Ball(initial_pos[0],initial_pos[1]);
    var platforms = [];
    var items = [];
    Ball.size = [29,35];
    platforms.push(new Platform(initial_pos[0]+Ball.size[0]/2-Platform.size[0]/2,320,"normal",platforms.length));
    platforms.push(new Platform(Math.random()* 580,420,"normal",platforms.length));

    ball.platform = platforms[0];
    ball.lastPlatform = platforms[0];

    var score = 0;
    var score_text = new createjs.Text(score.toString(),"30px Comic Sans MS","black");
    score_text.x = 10;

    var difficulty = 1;
	var myHealth = Math.floor(ball.health);
    var difficulty_text = new createjs.Text("Level:"+difficulty.toString(),"30px Comic Sans MS","black");
    var difficulty_text_width = difficulty_text.getMeasuredWidth();
    difficulty_text.x = CANVASSIZE[0] - difficulty_text_width;
	var health_text = new createjs.Text("Health:" + myHealth.toString(), "25px Comic Sans MS", "red");

    //background
    var background_data = {
        images: ["static/background13.jpg"],
        frames: {width:640, height:960}
    };

    var background_spsheet = new createjs.SpriteSheet(background_data);
    var background1 = new createjs.Sprite(background_spsheet);
    var background2 = new createjs.Sprite(background_spsheet);
    stage.addChild(background1);
    stage.addChild(background2);
    stage.addChild(score_text);
    stage.addChild(difficulty_text);
	health_text.x = (CANVASSIZE[0] / 2) - 70;
	stage.addChild(health_text);
    for (var p in platforms){
        stage.addChild(platforms[p].image);
    }
    function handleTick(event) {
        // this function is called every tick(every frame loop)
        // main loop
        stage.addChild(ball.image);
        if (ball.counter != 0){
            ball.counter--;
            console.log(ball.counter);
            if (ball.counter == 0){
                ball.cancelStatus();
            }
        }
        this.onkeydown = move;
        this.onkeypress = jump;
        if (!GAMEOVER) {
            if (ball.platform == null) {
                if (ball.speed[1] > MAXSPEED) {
                    ball.speed[1] -= GRAVITY;
                }
                else{
                    ball.speed[1] = MAXSPEED;
                }
                ball.image.y -= ball.speed[1];
            }
            else {
                if (ball.speed[1] < 0) {
                    ball.speed[1] = 0;
                }
                if (ball.image.x < ball.platform.image.x - Ball.size[0]/2 + 7 ||
                    ball.image.x > ball.platform.image.x + Platform.size[0] -7 + Ball.size[0]/2
                ) {
                    if (ball.platform.kind == "rolling"){
                        //ball.acc[0] -= 1;
                        ball.speed[0] -= BELTSPEED;
                    }
                    ball.platform = null;
                    ball.speed[1] = 0;
                }
            }
            //if (ball.speed[0] > -MAXHORIZONTALSPEED && ball.speed[0] < MAXHORIZONTALSPEED) {
            //    ball.speed[0] += ball.acc[0];
           // }
            ball.image.x += ball.speed[0];
            if (ball.image.x < -10) {
                ball.image.x = 630;
            }
            if (ball.image.x > 630) {
                ball.image.x = -10;
            }


            var tick = createjs.Ticker.getTicks();
            if (tick % 24 == 1) {
                platforms.push(new Platform(Math.random() * (CANVASSIZE[0]-Platform.size[0]), CANVASSIZE[1],
                    PLATFORMS[Math.floor(Math.random()*PLATFORMS.length)]));
                stage.addChild(platforms.slice(-1)[0].image);
                if (Math.random() < 0.5){
                    items.push(new Item(platforms.slice(-1)[0],"burger"));
                    stage.addChild(items.slice(-1)[0].image);
                }
                if (platforms.slice(-1)[0].kind == "rovering"){
                    platforms.slice(-1)[0].speed = 3 + Math.floor(Math.random() * 3);
                    platforms.slice(-1)[0].range = 70 + Math.floor(Math.random() * 60);
                }
            }
            for (var p in platforms) {
                var platform = platforms[p];
                if (platform.y < -15) {
                    platforms.splice(p, 1);
                    continue;
                }
                platform.image.y -= SCROLLSPEED;
                if (platform.kind == "rovering"){
                    if (platform.image.x<0 || platform.image.x> CANVASSIZE[0] ||
                        platform.image.x < platform.x - platform.range/2 || platform.image.x > platform.x + platform.range/2){
                        platform.speed *= -1;
                    }
                    platform.image.x += platform.speed;

                }

                if (ball.platform == null && ball.image.x + Ball.size[0]/2 - 12 > platform.image.x && ball.image.x + 12 < platform.image.x + Platform.size[0] + Ball.size[0]/2
                    && ball.image.y + Ball.size[1] >= platform.image.y && ball.image.y <= platform.image.y + 5
                ) {
                    ball.platform = platform;
                    if (platform != ball.lastPlatform){
                        switch (platform.kind){
                            case "invisible":
                                score += 2;
                                break;
                            default :
                                score += 1;
                                break;
                        }
                    }
                    if (score % 5 == 3 && platform != ball.lastPlatform){
                        GRAVITY += 0.02;
                        if (SCROLLSPEED < MAXSCROLLSPEED) {
                            SCROLLSPEED += 0.1;
                        }
                        difficulty += 1;
                        difficulty_text.text = "Level:" + difficulty.toString();
                        difficulty_text_width = difficulty_text.getMeasuredWidth();
                        difficulty_text.x = CANVASSIZE[0] - difficulty_text_width;
                    }

                    ball.lastPlatform = platform;
                    score_text.text = score.toString();

                    switch (platform.kind){
                        case "normal":
                            //ball.speed[0] = 0;
                            break;
                        case "bouncing":
                            ball.image.y = ball.platform.image.y - Ball.size[1];
                            ball.speed[1] = 13.5;
                            ball.platform = null;
                            break;
                        case "rolling":
                            //ball.acc[0] = 1;
                            ball.speed[0] += BELTSPEED;
                            break;
                    }
                }
            }

            for (var i = items.length; i > 0;i--){
                var item = items[i-1];
                if ( ball.image.x + Ball.size[0] > item.image.x && ball.image.x < item.image.x + Item.size[0]
                    && ball.image.y + Ball.size[1] >= item.image.y && ball.image.y <= item.image.y + 5
                ) {
                    items.splice(i - 1,1);
                    stage.removeChild(item.image);
                    switch (item.kind){
                        case "burger":
                            if (ball.image.scaleX == 1 || ball.image.scaleX == -1) {
                                ball.image.scaleX *= 1.35;
                                ball.image.scaleY *= 1.35;
                                Ball.size[0] = 29 * 1.35;
                                Ball.size[1] = 35 * 1.35;
                            }
                            ball.status = "big";
                            ball.counter = 200;
                            break;
                    }
                    continue;
                }

                item.image.x = item.platform.image.x + Platform.size[0]/2;
                item.image.y = item.platform.image.y - Item.size[1];
            }

            if (ball.platform != null) {
                ball.image.y = ball.platform.image.y - Ball.size[1];
                ball.image.x += ball.platform.speed;
                
                if (ball.platform.kind == "invisible"){
                    ball.platform.counter += 1;
                    ball.platform.image.alpha += 1.0/20;
                }
				if (ball.platform.kind == "spike") {
					ball.health -= 1;
					myHealth = Math.floor(ball.health);
                    health_text.text = "Health:" + myHealth.toString();
                    
				}
				else{
					if (ball.health > 0 && ball.health < 100){
						ball.health += 0.25;
						myHealth = Math.floor(ball.health);
						health_text.text = "Health:" + myHealth.toString();
					}
				}
				if (ball.platform.kind == "transient"){
                    ball.platform.counter += 1;
                    ball.platform.image.alpha -= 1.0/20;
                    if (ball.platform.counter == 20){
                        ball.platform.image.alpha = 0;
                        var pos = platforms.indexOf(ball.platform);
                        platforms.splice(pos,1);
                        ball.platform = null;
                    }
                }
            }

            //background move
            if (background2.y + background1.spriteSheet.getFrameBounds(0).height <= CANVASSIZE[1]){
                background1.y = CANVASSIZE[1] - background1.spriteSheet.getFrameBounds(0).height;
            }

            background1.y -= SCROLLSPEED;
            background2.y = background1.y +background1.spriteSheet.getFrameBounds(0).height;
            stage.setChildIndex(score_text,stage.getNumChildren()-1);
            stage.setChildIndex(difficulty_text,stage.getNumChildren()-1);
			stage.setChildIndex(health_text,stage.getNumChildren()-1)
            stage.update();
        }
		
        if (!GAMEOVER){
            if (ball.health <= 0 || ball.image.y < -Ball.size[1] || ball.image.y > CANVASSIZE[1]){
                GAMEOVER = true;
                var deathnote = new createjs.Text("Game Over","30px Arial","#ff0000");
                deathnote.x = 320 - 75;
                deathnote.y = 240 - 15;
                stage.addChild(deathnote);
                var retry = new createjs.Text("Retry","20px Arial","purple");
                retry.x = 320 - 25;
                retry.y = 240 + 45;
                retry.addEventListener("click",reset);
                stage.addChild(retry);
                stage.update();
            }
        }
    }

    move = function (e){
        this.onkeydown = null;
        this.onkeyup = moveend;
        switch (e.keyCode){
            // decide the direction of movement
            case (KEYLEFT):
                if (!ball.moving) {
                    ball.speed[0] -= 5;
                    //ball.acc[0] = -1;
                    ball.moving = "l";
                    if (ball.image.scaleX > 0){
                        ball.image.scaleX*= -1;
                    }
                    if (ball.platform) {
                        ball.image.gotoAndPlay("running");
                    }
                    ball.face = "l";
                }
                break;
            case (KEYRIGHT):
                if (!ball.moving) {
                    ball.speed[0] += 5;
                   // ball.acc[0] = 1;
                    ball.moving = "r";
                    if (ball.image.scaleX < 0){
                        ball.image.scaleX*= -1;
                    }

                    if (ball.platform) {
                        ball.image.gotoAndPlay("running");
                    }
                    ball.face = "r";
                }
                break;
        }

    }

    function jump(e){
        switch (e.keyCode){
            // decide the direction of movement
            case (KEYSPACE):
                if (ball.platform != null) {
                    ball.speed[1] = 14;
                    if (ball.platform.kind == "rolling"){
                        ball.speed[0] -= BELTSPEED;
                    }
                    ball.platform = null;
                }
                break;
        }
    }

    function moveend(e){
        switch (e.keyCode){
            // decide the direction of movement
            case (KEYLEFT):
                if (ball.moving == "l") {
                    ball.speed[0] += 5;
                    //ball.acc[0] -= 5;
                    ball.moving = false;
                    ball.image.gotoAndPlay("standing");
                    this.onkeydown = move;
                    this.onkeyup = null;
                }
                break;
            case (KEYRIGHT):
                if (ball.moving == "r") {
                    ball.speed[0] -= 5;
                    //ball.acc[0] += 5;
                    ball.moving = false;
                    ball.image.gotoAndPlay("standing");
                    this.onkeydown = move;
                    this.onkeyup = null;
                }
                break;
        }

    }
}


function reset(e){
    e.currentTarget.removeEventListener("click",reset);
    return init();
}

