// Level Class for Galaga

class Levels {
    // Constructor
    constructor() {
        let level;
        let bulletSpeed;
        let shipSpeed;
        this.level = 1;
        this.bulletSpeed = 1;
        this.shipSpeed = 1;
    }

    // Getters for the class
    getLevel() {
        return this.level;
    }

    getBulletSpeed() {
        return this.bulletSpeed;
    }

    getShipSpeed() {
        return this.shipSpeed;
    }

    // Create functions to update the speed based on the number of enemy ships
    updateLevel(shipNumber) {
        if (shipNumber < 1) {
            this.level += 1;
            let redEnemys = 10;
            let yellowEnemys = 10;
            let greenEnemys = 6;
            let speeds = this.increaseSpeed();
            let bullets = speeds[0];
            let ships = speeds[1];
            return [redEnemys, yellowEnemys, greenEnemys, bullets, ships];
        }
        return false;
    }

    increaseSpeed() {
        this.bulletSpeed += 2;
        this.shipSpeed += 2;
        return [this.bulletSpeed, this.shipSpeed];

    }

}