// Enemy class for Galaga

class Enemy extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder, _type, _number) {
        // Need player lives count
        super(tag, drawOrder);
        this.triangle1X = 0;
        this.triangle1Y = random(20, height);
        this.triangle2X = this.triangle1X - 10;
        this.triangle2Y = this.triangle1Y - 20;
        this.triangle3X = this.triangle1X + 10;
        this.triangle3Y = this.triangle1Y - 20;
        this.speed = 5;
        this.type = _type;


    }

    tick() {
        //updates the object
    }


    draw() {

        if (this.type == 'blue') {
            fill('blue');
        }
        if (this.type == 'red') {
            fill('red');
        }
        if (this.type == 'boss') {
            fill('gold')
        }
        //draw the player
        noStroke();
        triangle(this.triangle1X, this.triangle1Y, this.triangle2X, this.triangle2Y, this.triangle3X, this.triangle3Y,);
    }

    getGun() {
        this.coordinate = [];
        this.coordinate.push(this.triangle1X);
        this.coordinate.push(this.triangle1Y);
        return this.coordinate;
    }
}
