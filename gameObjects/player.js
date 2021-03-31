// Player class for Galaga

class Player extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder) {
        super(tag, drawOrder);

        // Need player lives count
        this.lives = 3;
        this.shipSize = 40;
        this.triangle1X = 200; this.triangle1Y = 340+200; this.triangle2X= 190 ; this.triangle2Y = 360+200;
        this.triangle3X = 210; this.triangle3Y = 360+200;
        this.speed = 5;

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

    }

    draw() {

        //draw the player
        fill('green');
        noStroke();
        image(playerImage, this.triangle1X, this.triangle1Y, this.shipSize, this.shipSize);
        //triangle(this.triangle1X, this.triangle1Y, this.triangle2X, this.triangle2Y, this.triangle3X, this.triangle3Y);
    }

    getGun(){
        this.coordinate = [];
        this.coordinate.push(this.triangle1X);
        this.coordinate.push(this.triangle1Y);
        return this.coordinate;
    }
}
