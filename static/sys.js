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
var PLATFORMS = ["normal","bouncing","rolling","normal","bouncing"];


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
    var initial_pos = [480 * Math.random()+50,300];

    var ball = new Ball(initial_pos[0],initial_pos[1]);
    var platforms = [];

    platforms.push(new Platform(initial_pos[0]-20,320,"normal",platforms.length));
    platforms.push(new Platform(Math.random()* 580,400,"normal",platforms.length));
    ball.platform = platforms[0];

    var score = 0;
    var score_text = new createjs.Text(score.toString(),"40px Arial","yellow");
    score_text.x = 10;

    var difficulty = 1;
    var difficulty_text = new createjs.Text("Level:"+difficulty.toString(),"40px Arial","blue");
    var difficulty_text_width = difficulty_text.getMeasuredWidth();
    difficulty_text.x = 640 - difficulty_text_width;


    //background
    var background_data = {
        images: ["static/background.jpg"],
        frames: {width:640, height:640}
    };

    var background_spsheet = new createjs.SpriteSheet(background_data);
    var background1 = new createjs.Sprite(background_spsheet);
    var background2 = new createjs.Sprite(background_spsheet);
    //stage.addChild(background1);
    //stage.addChild(background2);
    stage.addChild(score_text);
    stage.addChild(difficulty_text);
    function handleTick(event) {
        // this function is called every tick(every frame loop)
        // main loop
        this.onkeydown = move;
        this.onkeypress = jump;
        if (!GAMEOVER) {
            stage.addChild(ball.image);
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
                if (ball.image.x < ball.platform.image.x - 18 ||
                    ball.image.x > ball.platform.image.x + 58
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
            if (tick % 18 == 1) {
                platforms.push(new Platform(Math.random() * 580, 470, PLATFORMS[Math.floor(Math.random()*PLATFORMS.length)]));
            }
            for (var p in platforms) {
                var platform = platforms[p];
                if (platform.y < -10) {
                    platforms.splice(p, 1);
                    continue;
                }
                platform.image.y -= SCROLLSPEED;
                stage.addChild(platform.image);
                if (ball.platform == null && ball.image.x + 18 > platform.image.x && ball.image.x + 2 < platform.image.x + 60
                    && ball.image.y + 20 >= platform.image.y && ball.image.y <= platform.image.y + 5
                ) {
                    ball.platform = platform;
                    score += 1;
                    if (score % 5 == 3){
                        GRAVITY += 0.02;
                        if (SCROLLSPEED < MAXSCROLLSPEED) {
                            SCROLLSPEED += 0.1;
                        }
                        difficulty += 1;
                        difficulty_text.text = "Level:" + difficulty.toString();
                        difficulty_text_width = difficulty_text.getMeasuredWidth();
                        difficulty_text.x = 640 - difficulty_text_width;
                    }
                    score_text.text = score.toString();

                    switch (platform.kind){
                        case "normal":
                            //ball.speed[0] = 0;
                            break;
                        case "bouncing":
                            ball.image.y = ball.platform.image.y - 20;
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



            if (ball.platform != null) {
                ball.image.y = ball.platform.image.y - 20;
            }

            //background move
            if (background2.y + background1.spriteSheet.getFrameBounds(0).height <= 480){
                background1.y = 480 - background1.spriteSheet.getFrameBounds(0).height;
            }

            background1.y -= SCROLLSPEED;
            background2.y = background1.y +background1.spriteSheet.getFrameBounds(0).height;
            stage.update();
        }
        if (!GAMEOVER){
            if (ball.image.y < -20 || ball.image.y > 480){
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
                }
                break;
            case (KEYRIGHT):
                if (!ball.moving) {
                    ball.speed[0] += 5;
                   // ball.acc[0] = 1;
                    ball.moving = "r";
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
                    this.onkeydown = move;
                    this.onkeyup = null;
                }
                break;
            case (KEYRIGHT):
                if (ball.moving == "r") {
                    ball.speed[0] -= 5;
                    //ball.acc[0] += 5;
                    ball.moving = false;
                    this.onkeydown = move;
                    this.onkeyup = null;
                }
                break;
        }

    }
}

function reset(e){
    return init();
}

