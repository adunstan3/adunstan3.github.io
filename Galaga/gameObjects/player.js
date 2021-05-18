// Player class for Galaga

class Player extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder) {
        super(tag, drawOrder);

        this.shipSize = 40;
        this.shipX = 280
        this.shipY = 510
        this.gunX = 300
        this.speed = 2;
        this.fireable = true;
        this.firingDuration = 50;
        this.framesSinceFiring = 0
        this.exploding = false;
        this.explosionDuration = 150;
        this.explosionFrameRate = 20;
        this.framesSinceExplosion = 0;
        this.explosionFrame = 0;

        //How close the player can get to the edge
        this.edgeBuffer = 15;

        this.space = false;
        this.spaceCount = true;
    }

    tick() {
        //updates the object

        if (!this.exploding) {
            //You can only move and fire an operational ship

            // allows you to move the player left (left arrow and a)
            if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
                this.shipX -= this.speed;
                this.gunX -= this.speed;
            }

            //allows you to move the player right (right arrow and d)
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
                this.shipX += this.speed;
                this.gunX += this.speed;
            }

            //keep ship from moving off the left side of screen
            if (this.shipX < 0 + this.edgeBuffer) {
                this.shipX += this.speed;
                this.gunX += this.speed;
            }

            //keep ship from moving off the right side of screen

            if (this.shipX + this.shipSize > width - this.edgeBuffer) {
                this.shipX -= this.speed;
                this.gunX -= this.speed;
            }

            //allows you to fire weapon while space bar is down
            if (keyIsDown(32) || this.space === true) {
                //once we know we can fire WE FIRE
                if (this.fireable == true) {
                    gameHandler.addObject(new Bullet('bullet', 'player', bulletDrawOrder, this.gunX, this.shipY));
                    this.fireable = false;
                }

            }
            if (this.fireable === false) {
                this.framesSinceFiring++;
                if (this.framesSinceFiring > this.firingDuration) {
                    this.fireable = true;
                    this.framesSinceFiring = 0;
                }
            }
        }else{
            //The ship is exploding
            this.framesSinceExplosion ++;
            if(this.framesSinceExplosion > this.explosionDuration){
              //The ship has finished exploding delete the ship and make a new one
              this.delete();
              gameHandler.addObject(new Player("player", playerDrawOrder));
              game.playerLives -= 1;
            }
        }
    }

    draw() {
        if(!this.exploding){
          //draw the player
          image(playerImage, this.shipX, this.shipY, this.shipSize, this.shipSize);
        }else{
          //draw the right sprite frame based on time since explosion
          if(!(this.framesSinceExplosion > this.explosionFrameRate * 3)){
            this.explosionFrame = Math.floor(this.framesSinceExplosion/this.explosionFrameRate);
            image(explosionImages[this.explosionFrame], this.shipX-(this.shipSize*.5), this.shipY-(this.shipSize*.5),
              this.shipSize*2, this.shipSize*2);
          }
          //draw nothing if it is long enough after explosion
        }
    }

    kill() {
      //Player ship has been killed
      //Trigger explosion animation, disable movement, spawn new ship
      this.exploding = true;
    }

    getX() {
        return this.shipX;
    }

    getY() {
        return this.shipY;
    }

    getSize() {
        return this.shipSize;
    }
    getExploding(){
        return this.exploding;
    }
}

