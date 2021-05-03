// Enemy class for Galaga

class Enemy extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder, _type, _homeX, _homeY, _startX, _startY) {

        super(tag, drawOrder);
        this.shipX = _startX
        this.shipY = _startY
        this.size = 40;
        this.speed = 5;
        this.type = _type;
        this.alive = true;
        this.resting = false;
        this.flying = true;
        this.choosen = false;
        this.homeX = _homeX;
        this.homeY = _homeY;
        this.startX = _startX;
        this.startY = _startY;
        this.zig = 1;
        this.zag = 1;
        this.lives = 1;
        this.exploding = false;
        this.explosionDuration = 150;
        this.explosionFrameRate = 15;
        this.framesSinceExplosion = 0;
        this.explosionFrame = 0;

        if (_type === "boss") {
            this.lives = 2;
        }

        //Create a sprite type which tracks which animations to use for this enemy
        this.spriteType;
        if(this.type === "blueOne" || this.type === "blueTwo"){
          this.spriteType = "blue";
        }else if(this.type === "redOne" || this.type === "redTwo"){
          this.spriteType = "red";
        }else if(this.type === "boss"){
          this.spriteType = "bossHealthy";
        }

        this.spriteFrame = 0;
        this.spriteFrameDuration = 50;

        this.shipRotation = 180;
    }

    tick() {
      if(!this.exploding){

        if (this.lives === 0) {
            this.exploding = true;
        }

        //If the boss gets hit use the hurt sprite animation
        if(this.lives == 1 && this.type == "boss"){
          this.spriteType = "bossHurt";
        }

        if (this.lives == 2 && this.type == "boss") {
            this.spriteType = "bossHealthy";
        }

        let enemyLocation = [];

        //how we get the enemies to leave home
        if (this.shipX === this.homeX && this.shipY === this.homeY) {
            this.flying = false;
            this.resting = true;
        }

        if (this.choosen){
            this.resting = false;
        }

        //enemies return home
        if (this.flying === true && this.resting === false) {

            enemyLocation = returnHome(this.shipX, this.shipY, this.homeX, this.homeY);

            // set the new X for enemy location
            this.shipX = enemyLocation[0];

            // set the new Y for enemy location
            this.shipY = enemyLocation[1];

            // set the rotation
            this.shipRotation = enemyLocation[2];
        }

        //Zig zag flight pattern

        if (this.flying === false && this.choosen === true && this.shipY < 400) {
            let player = gameHandler.find("player");
            let playerX = player[0].getX();
            let playerY = player[0].getY();

            // get distance so attack can slowly focus in on player
            let playerDistance = playerY - this.homeY;
            playerDistance = playerDistance/3;

            enemyLocation = zigZagFlight(this.zig, this.zag, playerX, playerY, playerDistance,
                this.shipX, this.shipY);

            // set the new X for enemy location
            this.shipX = enemyLocation[0];

            // set the new Y for enemy location
            this.shipY = enemyLocation[1];


            // set the new zig and zag
            this.zig = enemyLocation[2];
            this.zag = enemyLocation[3];

            // set the new rotation
            this.shipRotation = enemyLocation[4];

            if(this.shipY >= playerY && this.alive === true){
                this.flying = true;
                this.resting = false;
            }
        }

        //set them to resting rotation once in resting position
        if (this.resting && !this.flying){
            this.shipRotation = 180;
        }

        // Enemies shoot if they are between pixels 250 (bottom of enemy line) and
        // 400 (when they go into dive bomb)
        if (this.shipY >= 250 && this.shipY <= 390 && this.choosen === true) {
            // Generate a random number between 1 and 100
            var number = Math.floor(Math.random() * 100);
            if (number === 50) {
                // If the number is 50, fire a bullet
                gameHandler.addObject(new Bullet('bullet', "enemy", 20, (this.shipX + 20), (this.shipY + 20)));
            }

        }

        // Once the enemy gets to 400 pixels down the screen, go into dive bomb
        if (this.flying === false && this.choosen === true && this.shipY >= 400) {
            enemyLocation = diveBomb(this.shipY, level.getShipSpeed());
            // set the new Y's for enemy location
            this.shipY = enemyLocation[0];
            this.shipRotation = enemyLocation[1];
        }

        // Once the enemy has left the screen, reposition them at the top
        if (this.choosen === true && this.flying === false && this.shipY >= 630) {
            enemyLocation = moveToTop(this.shipX,
                this.shipY);

            // set the new X's for enemy location
            this.shipX = enemyLocation[0];

            // set the new Y's for enemy location
            this.shipY = enemyLocation[1];
        }

      }else{
          //The ship is exploding
          this.framesSinceExplosion ++;
          if(this.framesSinceExplosion > this.explosionDuration){
            //The ship has finished exploding delete the ship and make a new one
            this.exploding = false;
            this.choosen = false;
            this.alive = false;


            // If the enemy is hit, move the enemy to the starting point
            this.shipX = this.startX;
            this.shipY = this.startY;
            this.resting = true;
            this.flying = false;
          }
      }
    }



    draw() {
        // Handling collisions with bullets
        if(!this.exploding && this.alive){
          //Find current sprite frames alternate image every spriteFrameDuration
          //amount of frames
          this.spriteFrame = Math.floor(frameCount/this.spriteFrameDuration) % 2

          if(this.shipRotation != 0){
            //The ship isn't straight up and down rotation needed
            this.rotate_and_draw_image(enemyImages[this.spriteType][this.spriteFrame],
                this.shipX, this.shipY, this.size, this.size, this.shipRotation);

          }else{
            //draw the enemy straight up and down
            image(enemyImages[this.spriteType][this.spriteFrame], this.shipX,
                this.shipY, this.size, this.size);
          }
        }else if(this.exploding){
          //draw the right sprite frame based on time since explosion
          if(!(this.framesSinceExplosion > this.explosionFrameRate * 4)){
            this.explosionFrame = Math.floor(this.framesSinceExplosion/this.explosionFrameRate);
            image(enemyExplosionImages[this.explosionFrame], this.shipX-(this.size*.5), this.shipY-(this.size*.5),
              this.size*2, this.size*2);
          }
          //draw nothing if it is long enough after explosion
        }

    }

    //Yanked right off the internet from here (with some minor edits to fit our needs)
    //https://stackoverflow.com/questions/45388765/how-to-rotate-image-in-p5-js
    rotate_and_draw_image(img, img_x, img_y, img_width, img_height, img_angle){
        imageMode(CENTER);
        translate(img_x+img_width/2, img_y+img_width/2);
        rotate(PI/180*img_angle);
        image(img, 0, 0, img_width, img_height);
        rotate(-PI / 180 * img_angle);
        translate(-(img_x+img_width/2), -(img_y+img_width/2));
        imageMode(CORNER);
    }

    //returns the home position of enemy
    getHome() {
        return [this.homeX, this.homeY];
    }


    setResting(rest) {
        this.resting = rest;
    }

    setAlive(status) {
        this.alive = status;
    }

    setChoosen(choice) {
        this.choosen = choice;
    }

    setStartX(x) {
        this.startX = x;
    }

    setStartY(y) {
        this.startY = y;
    }

    setSpeed(s) {
        this.speed += s;
    }

    setLives(live) {
        this.lives = live;
    }

    setSprite(sprite) {
        this.spriteType = sprite;
    }

    lostLife() {
        this.lives -= 1;
    }

    getChoosen(){
        return this.choosen;
    }

    getAlive() {
        return this.alive;
    }

    getType() {
        return this.type;
    }

    getResting() {
        return this.resting;
    }

    getSize() {
        return this.size;
    }

    getY() {
        return this.shipY;
    }

    getX() {
        return this.shipX;
    }
    getExploding() {
        return this.exploding;
    }

}
