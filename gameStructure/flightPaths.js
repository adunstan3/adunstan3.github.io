// This file hold all the flight paths for the enemies


function returnHome(_1X, _1Y,_hX,_hY){

    //variables to decide ship rotation
    this.flyingDown = false;
    this.flyingUp = false;
    this.flyingRight = false;
    this.flyingLeft = false;
    this.rotation = 180;

    let rHome = [];

    if (_1X > _hX) {

        _1X -= 1;
        this.flyingLeft = true;
    }
    if (_1Y > _hY) {
        _1Y -= 1;
        this.flyingUp = true;

    }


    if (_1X < _hX) {
        _1X += 1;
        this.flyingRight = true;
    }
    if (_1Y < _hY) {
        _1Y += 1;
        this.flyingDown = true;
    }

    if (this.flyingRight && this.flyingDown){
        this.rotation = 135;
    }
    if (this.flyingRight && this.flyingUp){
        this.rotation = 45;
    }
    if (this.flyingLeft && this.flyingDown){
        this.rotation = 225;
    }
    if (this.flyingLeft && this.flyingUp){
        this.rotation = 315;
    }
    if (this.flyingRight && !this.flyingDown && !this.flyingUp){
        this.rotation = 90;
    }
    if (this.flyingLeft && !this.flyingDown && !this.flyingUp){
        this.rotation = -90;
    }
    if (this.flyingDown && !this.flyingLeft && !this.flyingRight){
        this.rotation = 180;
    }
    if (this.flyingUp && !this.flyingLeft && !this.flyingRight){
        this.rotation = 0;
    }


    rHome.push(_1X,_1Y, this.rotation);
    return rHome;
}

//zig zag flight function
function zigZagFlight(_zig, _zag, _pX, _pY, _pD, _1X,_1Y){

    let zigZag = [];

    //variables to decide ship rotation
    this.flyingDown = false;
    this.flyingUp = false;
    this.flyingRight = false;
    this.flyingLeft = false;
    this.rotation = 180;


    //if the player is to the right of the ship and far away get the player inside the bounds
    if (_1X > _pX + 60 && _1Y <= _pY - (2 * _pD)){

        _1X -= 1;
        _1Y += 1;

        this.flyingLeft = true;
        this.flyingDown = true;

    }

    //if the player is left of the ship and far away get the player within the bounds
    if (_1X < _pX - 60 && _1Y <= _pY - (2 * _pD)){

        _1X += 1;
        _1Y += 1;

        this.flyingDown = true;
        this.flyingRight = true;
    }

    //if the player is to the right of the ship and medium away get the player inside the bounds
    if (_1X > _pX + 40 && _1Y <= _pY - _pD && _1Y > _pY - (2 * _pD)){

        _1X -= 1;
        _1Y += 1;

        this.flyingDown = true;
        this.flyingLeft = true;
    }

    //if the player is left of the ship and medium away get the player within the bounds
    if (_1X < _pX - 40 && _1Y <= _pY - _pD && _1Y > _pY - (2 * _pD)) {

        _1X += 1;
        _1Y += 1;

        this.flyingDown = true;
        this.flyingRight = true;

    }

    //if the player is right of the ship and close get the player within the bounds
    if (_1X > _pX + 20 && _1Y <= _pY && _1Y > _pY - _pD){

        _1X -= 1;
        _1Y += 1;

        this.flyingDown = true;
        this.flyingLeft = true;
    }

    //if the player is left of the ship and close get the player within the bounds
    if (_1X < _pX - 20 && _1Y <= _pY && _1Y > _pY - _pD) {

        _1X += 1;
        _1Y += 1;

        this.flyingDown = true;
        this.flyingRight = true;
    }

    //once inside the bounds we want the player to bounce back and forth
    if(_1Y <= _pY - (2 * _pD) && _1X <= _pX + 60
        && _1X >= _pX - 60){


        if(_1X === _pX + 60){
            _zig = -_zig;
        }
        if(_1X === _pX - 60){
            _zig = -_zig;
        }

        _1X += _zig;
        _1Y += _zag;

        if (_zig < 0) {

            this.flyingDown = true;
            this.flyingLeft = true;
        }

        if(_zig > 0) {
            this.flyingDown = true;
            this.flyingRight = true;
        }

    }

    if(_1Y <= _pY - _pD && _1Y > _pY - (2 * _pD)
        && _1X <= _pX + 40 && _1X >= _pX - 40) {


        if (_1X === _pX + 40) {
            _zig = -_zig;
        }
        if (_1X === _pX - 40) {
            _zig = -_zig;
        }

        _1X += _zig;
        _1Y += _zag;

        if (_zig < 0) {

            this.flyingDown = true;
            this.flyingLeft = true;
        }

        if (_zig > 0) {
            this.flyingDown = true;
            this.flyingRight = true;

        }
    }
    if(_1Y < _pY + 40 && _1Y > _pY - _pD
        && _1X <= _pX + 20 && _1X >= _pX - 20) {


        if (_1X == _pX + 20) {
            _zig = -_zig;
        }
        if (_1X === _pX - 20) {
            _zig = -_zig;
        }

        _1X += _zig;
        _1Y += _zag;

        if (_zig < 0) {

            this.flyingDown = true;
            this.flyingLeft = true;
        }

        if (_zig > 0) {
            this.flyingDown = true;
            this.flyingRight = true;
        }
    }

    if (this.flyingLeft && this.flyingDown){
        this.rotation = 225;
    }

    if (this.flyingRight && this.flyingDown) {
        this.rotation = 135;
    }

    zigZag.push(_1X,_1Y, _zig, _zag, this.rotation);
    return zigZag;
}

function diveBomb(_1Y, speed) {
    _1Y += speed;
    this.rotation = 180;

    let dive = [];

    dive.push(_1Y, this.rotation);
    return dive;

}

function moveToTop(_1X, _1Y,) {
    _1Y = -10;

    var xVal = Math.floor(Math.random() * 560) + 40;

    _1X = xVal;

    let location = [];

    location.push(_1X, _1Y);
    return location;

}

function getStarts(integer) {
    // If the number is a 1, set to x = 620, y = 620 for bottom right
    if (integer === 1) {
        return [700, 700];
    }
    // If the number is a 2, set to x = -200, y = 820 for bottom left
    else if (integer === 2) {
        return [-580, 1140];
    }
    // If the number is a 3, set to x = -160, y = -160 for top left
    else if (integer === 3) {
        return [-540, -540];
    }
    // If the number is a 4, set x = 620, y = -20 for top right
    else {
        return [700, -140];
    }

}

