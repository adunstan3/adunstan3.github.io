// Level Class for Galaga

class Levels {
    // Constructor
    constructor() {
        this.level = 1;
        this.shipSpeed = 1;
    }

    // Getters for the class
    getLevel() {
        return this.level;
    }

    getShipSpeed() {
        return this.shipSpeed;
    }

    // setters for the class
    setLevel(_l) {
        this.level = _l;
    }

    setShipSpeed(_s) {
        this.shipSpeed = _s;
    }

    // Create functions to update the speed based on the number of enemy ships
    updateLevel() {
            this.level += 1;
            this.shipSpeed += 1;
    }

}