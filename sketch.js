var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl, girlWalking, girlFall;
//var obstacle1, obstacle2, obstacle3;
var obstacle1Img, obstacle2Img, obstacle3Img;
var foodImg, campfireImg;
var wolf, wolfImg;
var bgMorning,bgNight;
var bg;
var count;
var restart, gameOver;
var restartImg, gameOverImg;
var obstaclesGroup;
var score = 0;

function preload() {
  obstacle1Img=loadImage("../images/obstacle1.png");
  obstacle2Img=loadImage("../images/obstacle2.png");
  obstacle3Img=loadImage("../images/obstacle3.png");

  bgMorning=loadImage("../images/bg 1 forest.jpg");

  girlWalking=loadAnimation("../images/pic1.png","../images/pic2.png","../images/pic3.png","../images/pic4.png","../images/pic5.png","../images/pic6.png");
  girlFall=loadImage("../images/girl fall.png");

  restartImg=loadImage("../images/restart.png");
  gameOverImg=loadImage("../images/game over.png");

  jumpSound = loadSound("../Sounds/jump.wav"); 
  dieSound = loadSound("../Sounds/die.mp3"); 
  checkpointSound = loadSound("../Sounds/checkPoint.ogg");

}

function setup() {
  createCanvas(displayWidth,displayHeight);
   bg = createSprite(0,height/2,width,height);
  bg.addImage("morning",bgMorning);
  bg.scale = 8;
  bg.x=bg.width/2;
  
  girl = createSprite(width/7, height/2+250, 50, 50);
  girl.addAnimation("girlWalking",girlWalking);
  girl.addAnimation("fall",girlFall);
  girl.setCollider("circle",0,0,65);
  //girl.debug=true;

  invisibleGround = createSprite(width/2, height/2+250,width,10);
  invisibleGround.visible = false;

  restart=createSprite(width/2,height/2);
  restart.addImage("restart",restartImg);
  restart.scale = 0.5;
  
  gameOver=createSprite(width/2,height/2-100);
  gameOver.addImage("gameOver",gameOverImg);
  gameOver.scale = 0.5;
  
  count = 0;
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  
  if(gameState === PLAY){

    bg.velocityX=-(6+3*score/100);
    restart.visible = false;
    gameOver.visible = false;

    score = score + Math.round(getFrameRate()/60);

    if(keyDown("space") && girl.y >= 540) { 
      jumpSound.play(); 
      girl.velocityY = -14; 
    }

    //console.log(girl.y);
    
    girl.velocityY = girl.velocityY + 0.5;

     if (bg.x < 0){
     bg.x = bg.width/2;
    }

    girl.collide(invisibleGround);
    spawnObstacles();
     
    if (score>0 && score%100 === 0){ 
      checkpointSound.play(); 
    }

    if(obstaclesGroup.isTouching(girl)){
      gameState = END;
      dieSound.play();
    }
  }
  else if(gameState === END){
   
    restart.visible = true;
    gameOver.visible = true;
   
    bg.velocityX = 0;
    girl.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);

    girl.changeAnimation("fall",girlFall);
    
    obstaclesGroup.setLifetimeEach(-1);
  }

  if(mousePressedOver(restart) && gameState===END){
    reset();
  }
  
  camera.position.x = displayWidth/2;
  camera.position.y = 350;
  
  drawSprites();
  
  fill("red");
  textSize(35);
  text("Score: "+ score, 500,150);

}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(width/1,height/2+230,50,10);
    obstacle.velocityX = -(6+3*score/100);
    
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1Img);
              break;
      case 2: obstacle.addImage(obstacle2Img);
              break;
      case 3: obstacle.addImage(obstacle3Img);
              break;
      default: break;
    }
             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;

  obstaclesGroup.destroyEach();

  girl.changeAnimation("girlWalking",girlWalking);

  score = 0;
  
}

