let gameHandler;

class Game {
    constructor() {
        //For frame navigation
        this.gameMode = "menu";
        this.previousMode = "menu";
        this.setupNeeded = true;

        //create handlers for different frames
        gameHandler = new ObjectHandler();
        this.menuHandler = new ObjectHandler();
        this.helpHandler = new ObjectHandler();

        //Save the top score information when the data base sends any
        this.topScores = [];

        this.playerScore = 0;
        this.savedScore = 0;
        this.playerLives = 4;

        //help text
        let spanStart = '<span style="color: rgb(113, 229, 125)">';
        this.helpString = spanStart + 'Movement:</span> move your ship left and right with arrow keys or \'a\' and \'d\'<br><br>'+
        spanStart + 'Firing:</span> fire bullets by tapping or holding space<br><br>'+
        spanStart + 'Points:</span> get points by killing enemies and completling levels. For testing you get points by pressing \'p\'<br><br>'+
        spanStart + 'Lives:</span> start with 3 lives, and get an extra life every 10,000 points<br><br>'+
        spanStart + 'Death:</span> you die if you are hit with a bullet or if you crash into a ship. If you are pulled by a tractor beam you have the ability to get two ships. You also die when you press \'k\' for testing<br><br>'

        // Need an array enemies

        // Need level class instantiated here

        // Need points system
        let pointTotal = 0;

        //Constants for recording what layer things get drawn on
        let backgroundDrawOrder = 1;
        let starDrawOrder = 10;
        let bulletDrawOrder = 20;
        let enemyDrawOrder = 30;
        let playerDrawOrder = 40;

        gameHandler.addObject(new Background("background", backgroundDrawOrder));
        this.menuHandler.addObject(new Background("background", backgroundDrawOrder));
        this.helpHandler.addObject(new Background("background", backgroundDrawOrder));

        for(var i = 0; i < 50; i++){
          gameHandler.addObject(new Star("star", starDrawOrder));
          this.menuHandler.addObject(new Star("star", starDrawOrder));
        }

        gameHandler.addObject(new Player("player", playerDrawOrder));
        gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blue'));
        gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'red'));
        gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'boss'));

        this.helpHandler.addObject(new Player("player", playerDrawOrder));

        console.log(gameHandler.find("player")[0].getTag());


        this.x = gameHandler.find("player")[0].getGun()[0];
        this.y = gameHandler.find("player")[0].getGun()[1];
        gameHandler.addObject(new Bullet("bullet", bulletDrawOrder, this.x, this.y));

        // Class for background

        // Class for level indicator

        // BOTTOM of CONSTRUCTOR
        // Create a reset method, to restart game / clear
    }

    restart(){
      //player info
      this.playerLives = 4;
      this.savedScore = this.playerScore;
      this.playerScore = 0;
    }

    //Stuff that needs to run once when the game mode is switched
    setup(){
      if(this.gameMode == "playing"){
        //Create the pause button
        var pauseButton = createButton("");
        pauseButton.position(552, 20);
        pauseButton.parent("sketch");
        pauseButton.addClass("pauseIcon");
        pauseButton.mousePressed(function(){
          game.changeState("paused");
        });

      }else if(this.gameMode == "paused"){
        //Draw in the last frame of the game
        gameHandler.draw();

        //Shade background once so the alpha doesn't grow to opaque
        background('rgba(219,214,214, 0.35)');
        this.needToShadeBackground = false;

        //Draw red square
        fill(178,34,34);
        stroke("black");
        strokeWeight(7);
        rect(125,100,350,350);

        //Paused title
        noStroke();
        fill("black");
        textStyle(BOLD);
        textSize(36);
        text('Paused', 238, 121+34);

        //Set up the buttons
        this.makeCustomButton("Menu", "menu", "pauseButton", 199, 172);
        this.makeCustomButton("Continue", "playing", "pauseButton", 199, 264);
        this.makeCustomButton("Help", "help", "pauseButton", 199, 356);

      }else if(this.gameMode == "help"){
        //Set up the buttons
        this.makeCustomButton("Back", this.previousMode, "helpButton", 372, 29);

        let helpText = createP(this.helpString);
        helpText.addClass("helpText");
        helpText.position(51, 140);

      }else if(this.gameMode == "menu"){
        //restart the game
        this.restart();

        //Set up the buttons
        this.makeCustomButton("Play", "playing", "menuButton", 328, 86);
        this.makeCustomButton("Help", "help", "menuButton", 328, 178);

      }else if(this.gameMode == "gameOver"){
        //restart the game
        this.restart();

        //Draw in the last frame of the game
        gameHandler.draw();

        //Shade background once so the alpha doesn't grow to opaque
        background('rgba(219,214,214, 0.35)');
        this.needToShadeBackground = false;

        //Draw red square
        fill(178,34,34);
        stroke("black");
        strokeWeight(7);
        rect(125, 65, 350, 466);

        //GameOver title
        noStroke();
        fill("black");
        textStyle(BOLD);
        textSize(36);
        text('Game Over', 202, 81+34);

        //skull image
        image(skullImage, 100, -35, 400, 400);

        //rectangle
        noFill();
        stroke("black");
        strokeWeight(2);
        rect(149, 217, 300, 120, 10);
        noStroke();

        //Print score text
        textSize(28);
        fill("white");
        textAlign(CENTER);
        textStyle(NORMAL);
        text("Score: "+this.savedScore, 195, 231, 195+20, 231+28);
        textAlign(LEFT);

        //Create text box
        let inp = createInput();
        inp.position(166, 314);
        inp.addClass("nameInput");
        inp.elt.placeholder = "Leaderboard Name";
        inp.attribute('maxlength', '15');

        //Create the submit button
        var pauseButton = createButton("Submit");
        pauseButton.position(335, 280);
        pauseButton.parent("sketch");
        pauseButton.addClass("submitButton");
        pauseButton.mousePressed(function(){
          console.log("score submitted");
          pauseButton.attribute('disabled', '');
          inp.attribute('disabled', '');
          myDatabase.submitScore(inp.value(), game.savedScore);
        });



        //create buttons
        this.makeCustomButton("Menu", "menu", "pauseButton", 199, 355);
        this.makeCustomButton("Restart", "playing", "pauseButton", 199, 436);

      }

      //Only need to do set up once
      this.setupNeeded = false;
    }

    //Tick the right ticks for each gamemode
    tick(){
      //Run setup if you need to
      if(this.setupNeeded){
        this.setup();
      }

      //Tick the correct gamemode
      if(this.gameMode == "playing"){
        //pressing k ends the game
        if(keyIsDown(75)){
          console.log("game Over");
          game.playerLives = 0;
        }

        //if the player is out of lives end the game and stop the tick
        if(this.playerLives == 0){
          this.changeState("gameOver");
          return;
        }

        //type p to increase score by 10
        if(keyIsDown(80)){
          game.playerScore += 10;
        }

        gameHandler.tick();
      }else if(this.gameMode == "paused"){

      }else if(this.gameMode == "help"){
        this.helpHandler.tick();

      }else if(this.gameMode == "menu"){
        this.menuHandler.tick();
      }else if(this.gameMode == "gameOver"){

      }
    }

    //Draw some stuff depending on game mode
    draw(){
      if(this.gameMode == "playing"){
        //draw the game objects
        gameHandler.draw();

        //Top score
        fill(236, 210, 210);
        textStyle(NORMAL);
        textSize(22);
        textAlign(CENTER);
        text('TopScore: ' + this.topScores[0].score, 100, 20, 157+210, 20+30);
        textAlign(LEFT);

        //Your score
        text('Score: ' + this.playerScore, 10, 20, 210, 20+30);

      }else if(this.gameMode == "paused"){
        //All drawing is in set up, things are paused no objects to draw
      }else if(this.gameMode == "help"){
        //draw the little ship at the bottom
        this.helpHandler.draw();

        //Title
        noStroke();
        fill(220, 90, 90);
        textStyle(BOLD);
        textSize(64);
        text('Help', 27, 21+64);

        //dividing line
        stroke(220, 90, 90)
        strokeWeight(4);
        line(42, 111, 42+280, 111);
        noStroke();

      }else if(this.gameMode == "menu"){
        this.menuHandler.draw();

        //Title
        noStroke();
        fill(220, 90, 90);
        textStyle(BOLD);
        textSize(64);
        text('Galaga', 35, 22+64);

        //high score title
        textSize(36);
        let desc = textDescent() * .8;
        text('High Scores', 195, 331+36);
        stroke(220, 90, 90)
        strokeWeight(2);
        line(195, 331+42, 195+212, 331+42);
        noStroke();

        //update score text
        var scoreText = "";
        var player;
        for (player of this.topScores) {
          scoreText += player.name + ": " + player.score + "\n";
        }

        //Print score text
        textSize(24);
        fill("white");
        textAlign(CENTER);
        text(scoreText, 80, 390, 80+375, 390+170);
        textAlign(LEFT);

        //Ship image
        image(playerImage, 70, 120, 150, 150);
      }else if(this.gameMode == "gameOver"){

      }
    }

    //Helper function since all our buttons are so similar
    makeCustomButton(text, newState, customClass, x, y){
      var newButton = createButton(text);
      newButton.position(x, y);
      newButton.parent("sketch");
      newButton.addClass("myButton");
      newButton.addClass(customClass);
      newButton.mousePressed(function(){
        game.changeState(newState);
      });
    }

    changeState(newState){
      game.previousMode = game.gameMode;
      game.gameMode = newState;
      game.setupNeeded = true;
      removeElements();
    }

    // addPoints(pointTotal)
    // Have points counter print to certain point on screen (in draw method)
}
