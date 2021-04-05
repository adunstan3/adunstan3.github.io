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

}

//P5 function for the canvas
function draw() {
  speed = level.getLevel();

  game.tick();
  game.draw();

}
