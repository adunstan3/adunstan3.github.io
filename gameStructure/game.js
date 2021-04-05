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

        //creating first row of blue enemies
        let homeY = 200;
        let startX = 620;
        let startY = 620;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 40 + 75;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blue', homeX, homeY, startX += 20, startY += 20));
        }

        //creating second row of blue enemies
        homeY = 240;
        startX = -200;
        startY = 820;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 40 + 75;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blue', homeX, homeY, startX += 20, startY -= 20));
        }

        //creating first row of red enemies
        homeY = 160;
        startX = -160;
        startY = -160;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 40 + 115;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'red', homeX, homeY, startX += 20, startY += 20));
        }

        //creating second row of red enemies
        homeY = 120;
        startX = 620;
        startY = -20;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 40 + 115;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'red', homeX, homeY, startX += 20, startY -= 20));
        }

        //creating row of bosses
        homeY = 80;
        startX = 300;
        startY = -20;
        for(var i = 1; i <= 4; i++){
            let homeX = i * 40 + 195;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'boss', homeX, homeY, startX, startY -= 20));
        }

        gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'red'));
        gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'boss'));

        this.helpHandler.addObject(new Player("player", playerDrawOrder));

        console.log(gameHandler.find("player")[0].getTag());


        // Class for level indicator

        // BOTTOM of CONSTRUCTOR
    }

    restart(){
      //player info
      this.playerLives = 4;
      this.savedScore = this.playerScore;
      this.playerScore = 0;
    }


    //--------------------------------------------------------------------------
    // Setup, Tick and Draw game mode decision trees
    //--------------------------------------------------------------------------

    //Stuff that needs to run once when the game mode is switched
    setup(){
      if(this.gameMode == "playing"){
        this.setupPlaying();

      }else if(this.gameMode == "paused"){
        this.setupPaused();

      }else if(this.gameMode == "help"){
        this.setupHelp();

      }else if(this.gameMode == "menu"){
        this.setupMenu();

      }else if(this.gameMode == "gameOver"){
        this.setupGameOver();
      }

      //Only need to do set up once
      this.setupNeeded = false;
    }

    //Update the objects (move them, subtract health, etc)
    tick(){
      //Run setup if you need to
      if(this.setupNeeded){
        this.setup();
      }

      //Tick the correct gamemode
      if(this.gameMode == "playing"){
        this.tickPlaying();

      }else if(this.gameMode == "paused"){

      }else if(this.gameMode == "help"){
        this.helpHandler.tick();

      }else if(this.gameMode == "menu"){
        this.menuHandler.tick();

      }else if(this.gameMode == "gameOver"){

      }
    }

    //Draw the objects to the screen
    draw(){
      if(this.gameMode == "playing"){
        this.drawPlaying();

      }else if(this.gameMode == "paused"){
        //All drawing is in set up, things are paused no objects to draw
      }else if(this.gameMode == "help"){
        this.drawHelp();

      }else if(this.gameMode == "menu"){
        this.drawMenu();

      }else if(this.gameMode == "gameOver"){
        //All drawing is in set up, things are over no objects to draw
      }
    }

    //--------------------------------------------------------------------------
    // Setup methods for each game state
    //--------------------------------------------------------------------------
    setupPlaying(){
      //Create the pause button
      var pauseButton = createButton("");
      pauseButton.position(552, 20);
      pauseButton.parent("sketch");
      pauseButton.addClass("pauseIcon");
      pauseButton.mousePressed(function(){
        game.changeState("paused");
      });
    }

    setupPaused(){
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
    }

    setupHelp(){
      //Set up the buttons
      this.makeCustomButton("Back", this.previousMode, "helpButton", 372, 29);

      let helpText = createP(this.helpString);
      helpText.addClass("helpText");
      helpText.parent("sketch");
      helpText.position(51, 115);
    }

    setupMenu(){
      //restart the game
      this.restart();

      //Set up the buttons
      this.makeCustomButton("Play", "playing", "menuButton", 328, 86);
      this.makeCustomButton("Help", "help", "menuButton", 328, 178);
    }

    setupGameOver(){
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
      inp.position(166, 278);
      inp.addClass("nameInput");
      inp.elt.placeholder = "Leaderboard Name";
      inp.attribute('maxlength', '15');
      inp.parent("sketch");

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

    //--------------------------------------------------------------------------
    // Tick methods for each game state
    //--------------------------------------------------------------------------
    tickPlaying(){
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
      this.collision();


      var allResting = true;

      for (this.tempObject of gameHandler.find('enemy')) {
          if (!(this.tempObject.getResting())) {
              allResting = false;
              console.log("Resting is false");
          }
        }

      if (allResting) {
          console.log("Calling enemy flight");
          this.flightEnemy();
      }



      //deletes bullet when it is out of screen
      for(this.tempObject of gameHandler.find('bullet')) {
          if (this.tempObject.outOfScreen()) {
              this.tempObject.delete();
          }
      }
    }

    //--------------------------------------------------------------------------
    // Draw methods for each game state
    //--------------------------------------------------------------------------

    drawPlaying(){
      //draw the game objects
      gameHandler.draw();
      gameHandler.tick();

      //Top score
      fill(236, 210, 210);
      textStyle(NORMAL);
      textSize(22);
      textAlign(CENTER);
      text('TopScore: ' + this.topScores[0].score, 100, 20, 157+210, 20+30);
      textAlign(LEFT);

      //Your score
      text('Score: ' + this.playerScore, 10, 20, 210, 20+30);

      // Check to see that all the enemies are resting
        // If they are call the flight method
    }

    drawHelp(){
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
    }

    drawMenu(){
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
    }

    //--------------------------------------------------------------------------
    // UI helper methods
    //--------------------------------------------------------------------------

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

    //--------------------------------------------------------------------------
    // End of UI code
    //--------------------------------------------------------------------------

    // Pick enemy to fly down
    chooseEnemyFlight() {
        var enemyFlight = gameHandler.find("enemy");

        let first = Math.floor(Math.random() * 21);
        let second = Math.floor(Math.random() * 21);
        while (first === second) {
            second = Math.floor(Math.random() * 21);
        }
        let third = Math.floor(Math.random() * 21);
        while (first === third || second === third) {
            third = Math.floor(Math.random() * 21);
        }
        let firstEnemy = enemyFlight[first];
        let secondEnemy = enemyFlight[second];
        let thirdEnemy = enemyFlight[third];

        return [firstEnemy, secondEnemy, thirdEnemy];
    }

    flightEnemy() {
        let enemiesChoosen = this.chooseEnemyFlight();
        enemiesChoosen[0].setResting(false);
        enemiesChoosen[0].setChoosen(true);
        enemiesChoosen[1].setResting(false);
        enemiesChoosen[1].setChoosen(true);
        enemiesChoosen[2].setResting(false);
        enemiesChoosen[2].setChoosen(true);

    }


    // Collisions for if either the player or enemy is hit
    collision() {
        var bullets = gameHandler.find("bullet");
        var enemies = gameHandler.find("enemy");
        var player = gameHandler.find("player");

        // Iterate through enemies and player, if either of the coordinates overlap with
        let i, j;
        for (i = 0; i < bullets.length; ++i ) {
            for (j = 0; j < enemies.length; ++j) {
                // See if the bullet overlaps with enemy location
                if (bullets[i].getLeftX() > enemies[j].getLeftVertex()
                        && bullets[i].getTopY() < enemies[j].getBottomY()
                        && bullets[i].getBottomY() > enemies[j].getTopY()
                        && bullets[i].getRightX() < enemies[j].getRightVertex()) {

                    // Set the status of enemy to false
                    enemies[j].setAlive(false);
                    console.log("Bullet hit");
                    this.addPoints(10);
                    bullets[i].delete();

                }
            }
        }

        for (i = 0; i < enemies.length; ++i) {
            if (player[0].getLeftVertex() <= enemies[i].getMiddleX() &&
                    player[0].getRightVertex() >= enemies[i].getMiddleX() &&
                    player[0].getTopY() <= enemies[i].getBottomY() &&
                        player[0].getBottomY() >= enemies[i].getTopY()) {


                enemies[i].setAlive(false);
                console.log("Enemy hit user");
                this.playerLives -= 1;

            }
        }
    }


    addPoints(points) {
        this.playerScore += points;
    }
    // Have points counter print to certain point on screen (in draw method)
}
