// Bullet Class for Galaga

class Bullet extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder, _x, _y) {
        super(tag, drawOrder);
        this.squareX = _x, this.squareY = _y;
        this.squareSize = 5;
        this.speed = 2.5;
    }

    tick() {
        //updates the object
        this.squareY -= this.speed;
    }

    draw() {
        //draw the square
        fill('white');
        noStroke();
        square(this.squareX, this.squareY, this.squareSize);
    }
    outOfScreen() {
        if (this.squareY < 0 || this.squareY > 600){
            return true;
        }
    }
    getLocation() {
        return this.squareY;
    }

    getLeftX() {
        return this.squareX;
    }

    getRightX() {
        return this.squareX + this.squareSize;
    }

    getTopY() {
        return this.squareY;
    }

    getBottomY() {
        return this.squareY + this.squareSize;
    }

}
