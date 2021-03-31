//Global p5 variables
let game;
let level;
let speed;

let playerImage;
let skullImage;

//Global database variables
var myDatabase;
var scoreThreshold = 10;

function preload() {
  playerImage = loadImage('assets/playerShip.png');
  skullImage = loadImage('assets/skull.png');
}

function setup() {
  canvasSize = 600;
  var myCanvas = createCanvas(canvasSize, canvasSize);
  myCanvas.parent('sketch');

  game = new Game();

  level = new Levels();

  myDatabase = new databaseHandler();


  //When bullet is out of screen it can be deleted
  for (this.tempObject of gameHandler.find('bullet')) {
    if (this.tempObject.outOfScreen()) {
      this.fireable = false;
      this.tempObject.Delete();
    }
    if (gameHandler.find('bullet')[0].outOfScreen()) {
      gameHandler.find('bullet')[0].Delete();
    }
  }
}

//P5 function for the canvas
function draw() {
  speed = level.getLevel();

  game.tick();
  game.draw();

  //allows you to fire weapon while space bar is down
  if (keyIsDown(32)) {
    //make sure we are able to fire
    this.fireable = true;
    for (const tempObject of gameHandler.find('bullet')) {
      if (tempObject.getLocation() > 320) {
        this.fireable = false;
      }
    }

    //once we know we can fire WE FIRE
    if (this.fireable == true){
      gameHandler.addObject(new Bullet('bullet', 20, gameHandler.find('player')[0].getGun()[0], gameHandler.find('player')[0].getGun()[1]));
    }

  }
}
