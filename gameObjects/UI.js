//This is a file that holds all the classes that deal with the ui of the game
//Right now that includes the background, the score, and the level indicator

class Background extends GameObject{
  constructor(tag, drawOrder){
    super(tag, drawOrder);
  }

  tick(){

  }
  draw(){
    fill("black");
    rect(0, 0, width, height);
  }
}

class Star extends GameObject{
  constructor(tag, drawOrder){
    super(tag, drawOrder);
    this.starX = random(width);
    //-20 for less obvious looping of stars
    this.starY = random(-20, height);
    this.starSize = random(1, 3);
    this.yVel = random(.2, 1);
  }

  tick(){
    this.starY += this.yVel;
    if(this.starY > height){
      this.starY = -20;
    }
  }

  draw(){
    fill(218, 220, 230);
    circle(this.starX, this.starY, this.starSize);
  }
}
