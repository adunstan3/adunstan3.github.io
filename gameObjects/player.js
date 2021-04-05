// Player class for Galaga

class Player extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder) {
        super(tag, drawOrder);

        // Need player lives count
        this.lives = 3;
        this.shipSize = 40;
        this.triangle1X = 300; this.triangle1Y = 510; this.triangle2X= 290 ; this.triangle2Y = 530;
        this.triangle3X = 210; this.triangle3Y = 530;
        this.speed = 2.5;

        //How close the player can get to the edge
        this.edgeBuffer = 15;
    }

    tick() {
        //updates the object


        // allows you to move the player left (left arrow and a)
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            this.triangle1X -= this.speed;
            this.triangle2X -= this.speed;
            this.triangle3X -= this.speed;
        }

        //allows you to move the player right (right arrow and d)
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            this.triangle1X += this.speed;
            this.triangle2X += this.speed;
            this.triangle3X += this.speed;
        }

        //keep ship from moving off the left side of screen
        if (this.triangle1X < 0 + this.edgeBuffer) {
            this.triangle1X += this.speed;
            this.triangle2X += this.speed;
            this.triangle3X += this.speed;
        }

        //keep ship from moving off the right side of screen

        if (this.triangle1X + this.shipSize > width - this.edgeBuffer) {
            this.triangle1X -= this.speed;
            this.triangle2X -= this.speed;
            this.triangle3X -= this.speed;
        }

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
            if (this.fireable == true) {
                gameHandler.addObject(new Bullet('bullet', 20, gameHandler.find('player')[0].getGun()[0], gameHandler.find('player')[0].getGun()[1]));
            }
        }

    }

    draw() {

        //draw the player
        fill('green');
        noStroke();
        image(playerImage, this.triangle1X - 20, this.triangle1Y, this.shipSize, this.shipSize);
        //triangle(this.triangle1X, this.triangle1Y, this.triangle2X, this.triangle2Y, this.triangle3X, this.triangle3Y);
    }

    getGun(){
        this.coordinate = [];
        this.coordinate.push(this.triangle1X - 3);
        this.coordinate.push(this.triangle1Y);
        return this.coordinate;
    }

    getLeftVertex() {
        return this.triangle2X;
    }

    getRightVertex() {
        return this.triangle3X;
    }

    getTopY() {
        return this.triangle1Y;
    }

    getBottomY() {
        return this.triangle2Y;
    }

    reduceLife() {
        this.lives -= 1;
    }
}
