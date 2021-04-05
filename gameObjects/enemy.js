// Enemy class for Galaga

class Enemy extends GameObject {

    // Need function for getting shot (overlap with bullets)

    constructor(tag, drawOrder, _type, _homeX, _homeY, _startX, _startY) {
        // Need player lives count
        super(tag, drawOrder);
        this.triangle1X = _startX;
        this.triangle1Y = _startY;
        this.triangle2X = this.triangle1X - 10;
        this.triangle2Y = this.triangle1Y - 20;
        this.triangle3X = this.triangle1X + 10 ;
        this.triangle3Y = this.triangle1Y - 20;
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



    }

    tick() {

        //how we get the enemies to leave home
        if (this.triangle1X == this.homeX && this.triangle1Y == this.homeY) {
            this.flying = false;
            this.resting = true;
        }

        //enemies return home
        if (this.flying === true && this.resting === false) {
            if (this.triangle1X != this.homeX && this.triangle1X > this.homeX) {

                this.triangle1X -= 1;
                this.triangle2X -= 1;
                this.triangle3X -= 1;

            }
            if (this.triangle1Y != this.homeY && this.triangle1Y > this.homeY) {
                this.triangle1Y -= 1;
                this.triangle2Y -= 1;
                this.triangle3Y -= 1;
            }


            if (this.triangle1X != this.homeX && this.triangle1X < this.homeX) {

                this.triangle1X += 1;
                this.triangle2X += 1;
                this.triangle3X += 1;

            }
            if (this.triangle1Y != this.homeY && this.triangle1Y < this.homeY) {
                this.triangle1Y += 1;
                this.triangle2Y += 1;
                this.triangle3Y += 1;
            }

            this.choosen = false;

        }

        //Zig zag flight pattern

        if (this.flying === false && this.resting === true && this.choosen === true) {
            var player = gameHandler.find("player");
            let playerX = player[0].getLeftVertex();
            let playerY = player[0].getBottomY();

            // get distance so attack can slowly focus in on player
            let playerDistance = playerY - this.homeY;
            playerDistance = playerDistance/3;

            //if the player is to the right of the ship and far away get the player inside the bounds
            if (this.triangle1X > playerX + 60 && this.triangle1Y <= playerY - (2 * playerDistance)){

                this.triangle1X -= 1;
                this.triangle2X -= 1;
                this.triangle3X -= 1;

            }

            //if the player is left of the ship and far away get the player within the bounds
            if (this.triangle1X < playerX - 60 && this.triangle1Y <= playerY - (2 * playerDistance)){

                this.triangle1X += 1;
                this.triangle2X += 1;
                this.triangle3X += 1;

            }

            //if the player is to the right of the ship and medium away get the player inside the bounds
            if (this.triangle1X > playerX + 40 && this.triangle1Y <= playerY - playerDistance && this.triangle1Y > playerY - (2 * playerDistance)){

                this.triangle1X -= 1;
                this.triangle2X -= 1;
                this.triangle3X -= 1;

            }

            //if the player is left of the ship and medium away get the player within the bounds
            if (this.triangle1X < playerX - 40 && this.triangle1Y <= playerY - playerDistance && this.triangle1Y > playerY - (2 * playerDistance)) {

                this.triangle1X += 1;
                this.triangle2X += 1;
                this.triangle3X += 1;

            }

            //if the player is right of the ship and close get the player within the bounds
            if (this.triangle1X > playerX + 20 && this.triangle1Y <= playerY && this.triangle1Y > playerY - playerDistance){

                this.triangle1X -= 1;
                this.triangle2X -= 1;
                this.triangle3X -= 1;

            }

            //if the player is left of the ship and close get the player within the bounds
            if (this.triangle1X < playerX - 20 && this.triangle1Y <= playerY && this.triangle1Y > playerY - playerDistance) {

                this.triangle1X += 1;
                this.triangle2X += 1;
                this.triangle3X += 1;

            }

            //once inside the bounds we want the player to bounce back and forth
            if(this.triangle1Y <= playerY - (2 * playerDistance) && this.triangle1X <= playerX + 60
                && this.triangle1X >= playerX - 60){


                if(this.triangle1X === playerX + 60){
                    this.zig = -this.zig;
                }
                if(this.triangle1X === playerX - 60){
                    this.zig = -this.zig;
                }

                this.triangle1X += this.zig;
                this.triangle2X += this.zig;
                this.triangle3X += this.zig;

                this.triangle1Y += this.zag;
                this.triangle2Y += this.zag;
                this.triangle3Y += this.zag;
            }

            if(this.triangle1Y <= playerY - playerDistance && this.triangle1Y > playerY - (2 * playerDistance)
                && this.triangle1X <= playerX + 40 && this.triangle1X >= playerX - 40){


                if(this.triangle1X === playerX + 40){
                    this.zig = -this.zig;
                }
                if(this.triangle1X === playerX - 40){
                    this.zig = -this.zig;
                }

                this.triangle1X += this.zig;
                this.triangle2X += this.zig;
                this.triangle3X += this.zig;

                this.triangle1Y += this.zag;
                this.triangle2Y += this.zag;
                this.triangle3Y += this.zag;
            }

            if(this.triangle1Y < playerY && this.triangle1Y > playerY - playerDistance
                && this.triangle1X <= playerX + 20 && this.triangle1X >= playerX - 20){


                if(this.triangle1X == playerX + 20){
                    this.zig = -this.zig;
                }
                if(this.triangle1X === playerX - 20){
                    this.zig = -this.zig;
                }

                this.triangle1X += this.zig;
                this.triangle2X += this.zig;
                this.triangle3X += this.zig;

                this.triangle1Y += this.zag;
                this.triangle2Y += this.zag;
                this.triangle3Y += this.zag;
            }

            if(this.triangle1Y >= playerY && this.alive === true){
                this.resting = false;
                this.flying = true;
            }

        }

        if (this.triangle1X === this.homeX && this.triangle1Y === this.homeY) {
            this.resting = true;
        }


        // If the enemy is hit, move the enemy to the starting point
        if (this.alive === false) {
            this.triangle1X = this.startX;
            this.triangle1Y = this.startY;
            this.triangle2X = this.triangle1X - 10;
            this.triangle2Y = this.triangle1Y - 20;
            this.triangle3X = this.triangle1X + 10 ;
            this.triangle3Y = this.triangle1Y - 20;
            this.resting = true;
            this.flying = false;
        }
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

        // Handling collisions with bullets
        if (this.alive === true) {
            //draw the enemy
            noStroke();
            triangle(this.triangle1X, this.triangle1Y, this.triangle2X, this.triangle2Y, this.triangle3X, this.triangle3Y,);
        }
    }

    //returns the gun location of enemy
    getGun() {
        this.coordinate = [];
        this.coordinate.push(this.triangle1X);
        this.coordinate.push(this.triangle1Y);
        return this.coordinate;
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

    getAlive() {
        return this.alive;
    }

    getType() {
        return this.type;
    }

    getResting() {
        return this.resting;
    }


    getLeftVertex() {
        return this.triangle2X;
    }

    getRightVertex() {
        return this.triangle3X;
    }

    getTopY() {
        return this.triangle2Y;
    }

    getBottomY() {
        return this.triangle1Y;
    }

    getMiddleX() {
        return this.triangle1X;
    }

}
