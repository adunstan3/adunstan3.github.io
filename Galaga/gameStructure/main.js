//Global p5 variables
let game;
let level;
let speed;

let playerImage;
let skullImage;
let explosionImages = [];
let enemyExplosionImages = [];
let enemyImages = {};

//Global database variables
var myDatabase;
var scoreThreshold = 10;

function preload() {
  playerImage = loadImage('assets/playerShip.png');
  skullImage = loadImage('assets/skull.png');

  explosionImages.push(loadImage('assets/Explosion1.png'));
  explosionImages.push(loadImage('assets/Explosion2.png'));
  explosionImages.push(loadImage('assets/Explosion3.png'));
  explosionImages.push(loadImage('assets/Explosion4.png'));

  enemyExplosionImages.push(loadImage('assets/enemyExplosion1.png'));
  enemyExplosionImages.push(loadImage('assets/enemyExplosion2.png'));
  enemyExplosionImages.push(loadImage('assets/enemyExplosion3.png'));
  enemyExplosionImages.push(loadImage('assets/enemyExplosion4.png'));
  enemyExplosionImages.push(loadImage('assets/enemyExplosion5.png'));

  enemyImages["bossHealthy"] = [loadImage('assets/EnemyBossHealthy1.png'),
                                  loadImage('assets/EnemyBossHealthy2.png')];
  enemyImages["bossHurt"] = [loadImage('assets/EnemyBossHurt1.png'),
                                  loadImage('assets/EnemyBossHurt2.png')];
  enemyImages["blue"] = [loadImage('assets/EnemyBlue1.png'),
                                  loadImage('assets/EnemyBlue2.png')];
  enemyImages["red"] = [loadImage('assets/EnemyRed1.png'),
                                  loadImage('assets/EnemyRed2.png')];
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
