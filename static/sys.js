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
var ITEMS= ["shoes"];
var CANVASSIZE = [640,675];


function init() {
    // create stage object. It will be the closure where we set our other objects.
    var GAMEOVER = false;
    var SCROLLSPEED = 4;
    var GRAVITY = 1;
    var stage = new createjs.Stage("Canvas");
    var move;
    // set ticker function
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.framerate = 30;
    var initial_pos = [(CANVASSIZE[0]-50) * Math.random(),300];
    var ball = new Ball(initial_pos[0],initial_pos[1]);
    var platforms = [];
    var items = [];
    Ball.size = [29,35];
    Ball.speed = 5;
    platforms.push(new Platform(initial_pos[0]+Ball.size[0]/2-Platform.size[0]/2,320,"normal",platforms.length));
    platforms.push(new Platform(Math.random()* 580,420,"normal",platforms.length));

    ball.platform = platforms[0];
    ball.lastPlatform = platforms[0];

    var score = 0;
    var score_text = new createjs.Text(score.toString(),"30px Courier New","#FE9A2E");
   

    score_text.x = 10;

    var difficulty = 1;
    var difficulty_text = new createjs.Text("Level:"+difficulty.toString(),"30px Courier New","#FE9A2E");

    var difficulty_text_width = difficulty_text.getMeasuredWidth();
    difficulty_text.x = CANVASSIZE[0] - difficulty_text_width;

    var myHealth = Math.floor(ball.health);
    var health_text = new createjs.Text("Health:" + myHealth.toString(), "25px Comic Sans MS", "red");
    
    //background
    var background_data = {
        images: ["static/"+Theme+"/background.jpg"],
        frames: {width:640, height:960}
    };

    var background1_spsheet = new createjs.SpriteSheet(background_data);
    var background2_spsheet = new createjs.SpriteSheet(background_data);
    var background1 = new createjs.Sprite(background1_spsheet);
    var background2 = new createjs.Sprite(background2_spsheet);
    stage.addChild(background1);
    stage.addChild(background2);
    stage.addChild(score_text);
    stage.addChild(difficulty_text);
    var itemback_data = {
        images: ["static/item_back.png"],
        frames: {width:40, height:40}
    };
    var itemback_spsheet = new createjs.SpriteSheet(itemback_data);
    var itemback = new createjs.Sprite(itemback_spsheet);
    itemback.regY = 40;
    itemback.y = CANVASSIZE[1];
    stage.addChild(itemback);
	health_text.x = (CANVASSIZE[0] / 2) - 70;
	stage.addChild(health_text);
    for (var p in platforms){
        stage.addChild(platforms[p].image);
    }

    var pause_button_data = {
        images: ["static/button_pause.png","static/button_play.png"],
        frames: {width:34, height:31}
    };
    var pause_button_spsheet = new createjs.SpriteSheet(pause_button_data);
    var pause_button = new createjs.Sprite(pause_button_spsheet);
    pause_button.addEventListener("click",pause);
    pause_button.x = CANVASSIZE[0] - 34;
    pause_button.y = CANVASSIZE[1] - 31;

    stage.addChild(pause_button);



    if (localStorage.records == undefined){
        var records = {
            first: {
                name: "Bob",
                score: 80
            },
            second:{
                name:"Patrick",
                score:50
            },
            third:{
                name:"Mr. Crabs",
                score:30
            }
        };
        localStorage.records = JSON.stringify(records);
    }















    function handleTick(event) {

        stage.update();
        // this function is called every tick(every frame loop)
        // main loop
        if (!event.paused) {
            stage.addChild(ball.image);
            if (ball.counter != 0) {
                ball.counter--;
                if (ball.counter == 0) {
                    stage.removeChild(ball.status.image);
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
                    else {
                        ball.speed[1] = MAXSPEED;
                    }
                    ball.image.y -= ball.speed[1];
                }
                else {
                    if (ball.speed[1] < 0) {
                        ball.speed[1] = 0;
                    }
                    if (ball.image.x < ball.platform.image.x - Ball.size[0] / 2 + 7 ||
                        ball.image.x > ball.platform.image.x + Platform.size[0] - 7 + Ball.size[0] / 2
                    ) {
                        if (ball.platform.kind == "rolling") {
                            //ball.acc[0] -= 1;
                            ball.speed[0] -= BELTSPEED;
                        }
                        ball.platform = null;
                        ball.image.gotoAndPlay("flying");
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
                    platforms.push(new Platform(Math.random() * (CANVASSIZE[0] - Platform.size[0]), CANVASSIZE[1],
                        PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]));
                    stage.addChild(platforms.slice(-1)[0].image);
                    if (platforms.slice(-1)[0].kind != "invisible" && Math.random() < 0.5) {
                        items.push(new Item(platforms.slice(-1)[0], ITEMS[Math.floor(Math.random() * ITEMS.length)]));
                        stage.addChild(items.slice(-1)[0].image);
                    }
                    if (platforms.slice(-1)[0].kind == "rovering") {
                        platforms.slice(-1)[0].speed = 2 + Math.floor(Math.random() * 2);
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
                    if (platform.kind == "rovering") {
                        if (platform.image.x < 0 || platform.image.x > CANVASSIZE[0] ||
                            platform.image.x < platform.x - platform.range / 2 || platform.image.x > platform.x + platform.range / 2) {
                            platform.speed *= -1;
                        }
                        platform.image.x += platform.speed;

                    }

                    if (ball.platform == null && ball.image.x + Ball.size[0] / 2 - 12 > platform.image.x && ball.image.x + 12 < platform.image.x + Platform.size[0] + Ball.size[0] / 2
                        && ball.image.y + Ball.size[1] >= platform.image.y && ball.image.y <= platform.image.y + 5
                    ) {
                        ball.platform = platform;
                        if (platform != ball.lastPlatform) {
                            switch (platform.kind) {
                                case "invisible":
                                    score += 3;
                                    break;
                                default :
                                    score += 1;
                                    break;
                            }
                        }
                        if (score % 5 == 3 && platform != ball.lastPlatform) {
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
                        if (ball.moving) {
                            ball.image.gotoAndPlay("running");
                        }
                        else {
                            ball.image.gotoAndPlay("standing");
                        }
                        switch (platform.kind) {
                            case "normal":
                                //ball.speed[0] = 0;

                                break;
                            case "bouncing":
                                ball.image.y = ball.platform.image.y - Ball.size[1];
                                ball.speed[1] = 13.5;
                                ball.platform = null;
                                ball.image.gotoAndPlay("flying");
                                break;
                            case "rolling":
                                //ball.acc[0] = 1;
                                ball.speed[0] += BELTSPEED;
                                break;
                        }
                    }
                }

                for (var i = items.length; i > 0; i--) {
                    var item = items[i - 1];
                    if (ball.image.x + Ball.size[0] > item.image.x && ball.image.x < item.image.x + Item.size[0]
                        && ball.image.y + Ball.size[1] >= item.image.y && ball.image.y <= item.image.y + 5
                    ) {
                        items.splice(i - 1, 1);
                        stage.removeChild(item.image);
                        if (ball.status != null && item.kind != ball.status.kind) {
                            ball.cancelStatus();
                        }
                        ball.status = item;
                        ball.status.image.x = 20;
                        ball.status.image.y = CANVASSIZE[1] - 33;
                        stage.addChild(ball.status.image);
                        switch (item.kind) {
                            case "burger":
                                if (ball.image.scaleX == 1 || ball.image.scaleX == -1) {
                                    createjs.Tween.get(ball.image).to({
                                        scaleX: ball.image.scaleX * 1.35,
                                        scaleY: ball.image.scaleY * 1.35
                                    }, 300);
                                    //ball.image.scaleX *= 1.35;
                                    //ball.image.scaleY *= 1.35;
                                    Ball.size[0] = 29 * 1.35;
                                    Ball.size[1] = 35 * 1.35;
                                }

                                ball.counter = 200;
                                break;
                            case "shoes":
                                Ball.speed = 8;
                                if (ball.moving) {
                                    if (ball.platform== null || ball.platform.kind != "rolling") {
                                        ball.speed[0] = Math.abs(ball.speed[0]) / ball.speed[0] * Ball.speed;
                                    }
                                    else {
                                        ball.speed[0] = Math.abs(ball.speed[0]) / ball.speed[0] * Ball.speed + BELTSPEED;
                                    }
                                }
                                ball.counter = 200;
                                break;
                        }
                        continue;
                    }

                    item.image.x = item.platform.image.x + Platform.size[0] / 2;
                    item.image.y = item.platform.image.y - Item.size[1];
                }

                if (ball.platform != null) {
                    ball.image.y = ball.platform.image.y - Ball.size[1];
                    ball.image.x += ball.platform.speed;
                    if (ball.platform.kind == "invisible") {
                        ball.platform.counter += 1;
                        ball.platform.image.alpha += 1.0 / 20;
                    }
                    if (ball.platform.kind == "spike") {
                        if (ball.health > 0) {
                            ball.health -= 1;
                        }
                        myHealth = Math.floor(ball.health);
                        health_text.text = "Health:" + myHealth.toString();

                    }
                    else {
                        if (ball.health > 0 && ball.health < 100) {
                            ball.health += 0.25;
                            myHealth = Math.floor(ball.health);
                            health_text.text = "Health:" + myHealth.toString();
                        }
                    }
                    if (ball.platform.kind == "transient") {
                        ball.platform.counter += 1;
                        ball.platform.image.alpha -= 1.0 / 20;
                        if (ball.platform.counter == 20) {
                            ball.platform.image.alpha = 0;

                            var pos = platforms.indexOf(ball.platform);
                            platforms.splice(pos, 1);
                            ball.platform = null;
                            ball.image.gotoAndPlay("flying");
                        }
                    }
                }

                //background move
                if (background2.y + 960 <= CANVASSIZE[1]) {
                    background1.y = CANVASSIZE[1] - 960;
                }

                if (ball.face == "l" && ball.image.scaleX > 0) {
                    ball.image.scaleX *= -1;
                }
                if (ball.face == "r" && ball.image.scaleX < 0) {
                    ball.image.scaleX *= -1;
                }

                background1.y -= SCROLLSPEED;
                background2.y = background1.y + 960;
                stage.setChildIndex(score_text, stage.getNumChildren() - 1);
                stage.setChildIndex(difficulty_text, stage.getNumChildren() - 1);
                stage.setChildIndex(health_text, stage.getNumChildren() - 1);
                stage.setChildIndex(itemback, stage.getNumChildren() - 1);
                stage.setChildIndex(pause_button, stage.getNumChildren() - 1);
                if (ball.status != null) {
                    stage.setChildIndex(ball.status.image, stage.getNumChildren() - 1);
                    ball.status.image.alpha = Math.sin(ball.counter / 200.0 * Math.PI / 2);
                }
            }
            if (!GAMEOVER) {
                if (ball.health <= 0 || ball.image.y < -Ball.size[1] || ball.image.y > CANVASSIZE[1]) {
                    if (ball.health <= 0){
                        ball.image.gotoAndStop(21);
                        createjs.Tween.get(ball.image).to({y:ball.image.y - 20,alpha:0},800)
                    }
                    GAMEOVER = true;
                    var gameover_logo = new createjs.Bitmap("static/game-over.png");
                    var retry =  new createjs.Bitmap("static/retry.png");
                    var highscore_bg = new createjs.Bitmap("static/highscore_bg.png");
                    gameover_logo.x = 320 - 175;
                    createjs.Tween.get(gameover_logo).to({y:240 - 38},300,createjs.Ease.bounceOut);

                    //gameover_logo.y = 240 - 38;
                    stage.addChild(gameover_logo);
                    //retry.x = 320 - 46;
                    retry.y = 240 + 45;
                    retry.addEventListener("click", reset);
                    createjs.Tween.get(retry).to({x:320-46},300,createjs.Ease.bounceInOut)
                    stage.addChild(retry);
                    highscore_bg.x =320 - 200;
                    highscore_bg.y = 350;
                    stage.addChild(highscore_bg);
                    var records = JSON.parse(localStorage.records);
                    if (score > records.third.score){
                        alert("New Highscore!");
                        var name = prompt("What's your name?");
                        if (score <  records.second.score){
                            records.third.name = name;
                            records.third.score = score;
                        }
                        else if (score < records.first.score){
                            records.third.name = records.second.name;
                            records.third.score = records.second.score;
                            records.second.name = name;
                            records.second.score = score;
                        }
                        else{
                            records.third.name = records.second.name;
                            records.third.score = records.second.score;
                            records.second.name = records.first.name;
                            records.second.score = records.first.score;
                            records.first.name = name;
                            records.first.score = score;
                        }
                        localStorage.records = JSON.stringify(records);
                    }
                    var highscore_text = new createjs.Text("Highscore","bold 40px Comic Sans MS","white");
                    highscore_text.x = 320-100;
                    highscore_text.y = 360;
                    stage.addChild(highscore_text);
                    var highscore1_text = new createjs.Text("1. " + records.first.name + ":" + records.first.score.toString(),"30px Comic Sans MS","white");
                    highscore1_text.x = 320-highscore1_text.getMeasuredWidth()/2;
                    highscore1_text.y = 430;
                    stage.addChild(highscore1_text);
                    var highscore2_text = new createjs.Text("2. " + records.second.name + ":" + records.second.score.toString(),"30px Comic Sans MS","white");
                    highscore2_text.x = 320-highscore2_text.getMeasuredWidth()/2;
                    highscore2_text.y = 470;
                    stage.addChild(highscore2_text);
                    var highscore3_text = new createjs.Text("3. " + records.third.name + ":" + records.third.score.toString(),"30px Comic Sans MS","white");
                    highscore3_text.x = 320-highscore3_text.getMeasuredWidth()/2;
                    highscore3_text.y = 510;
                    stage.addChild(highscore3_text);

                    stage.update();
                }
            }
        }
    }

    move = function (e){
        this.onkeydown = null;
        this.onkeyup = moveend;
        switch (e.keyCode){
            // decide the direction of movement
            case (KEYLEFT):
                if (!ball.moving && !createjs.Ticker.paused) {
                    ball.speed[0] -= Ball.speed;
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
                if (!ball.moving && !createjs.Ticker.paused) {
                    ball.speed[0] += Ball.speed;
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

    };

    function jump(e){
        switch (e.keyCode){
            // decide the direction of movement
            case (KEYSPACE):
                if (ball.platform != null && !createjs.Ticker.paused) {
                    ball.speed[1] = 14;
                    if (ball.platform.kind == "rolling"){
                        ball.speed[0] -= BELTSPEED;
                    }
                    ball.platform = null;
                    ball.image.gotoAndPlay("flying");
                }
                break;
        }
    }

    function moveend(e){
        switch (e.keyCode){
            // decide the direction of movement
            case (KEYLEFT):
                if (ball.moving == "l" && !createjs.Ticker.paused) {
                    ball.speed[0] += Ball.speed;
                    //ball.acc[0] -= 5;
                    ball.moving = false;
                    if (ball.platform) {
                        ball.image.gotoAndPlay("standing");
                    }
                    else{
                        ball.image.gotoAndPlay("flying");
                    }
                    this.onkeydown = move;
                    this.onkeyup = null;
                }
                break;
            case (KEYRIGHT):
                if (ball.moving == "r" && !createjs.Ticker.paused) {
                    ball.speed[0] -= Ball.speed;
                    //ball.acc[0] += 5;
                    ball.moving = false;
                    if (ball.platform) {
                        ball.image.gotoAndPlay("standing");
                    }
                    else{
                        ball.image.gotoAndPlay("flying");
                    }
                    this.onkeydown = move;
                    this.onkeyup = null;
                }
                break;
        }

    }

    function pause(e){
        console.log(1);
        if (!createjs.Ticker.paused){
            pause_button.gotoAndStop(1);
            stage.update();
            createjs.Ticker.paused = true;
        }
        else{
            pause_button.gotoAndStop(0);
            stage.update();
            createjs.Ticker.paused = false;
        }
    }
}


function reset(e){
    e.currentTarget.removeEventListener("click",reset);
    e.currentTarget.parent.removeAllChildren();
    return init();
}

