let gameHandler;

//Constants for recording what layer things get drawn on
let backgroundDrawOrder = 1;
let starDrawOrder = 10;
let bulletDrawOrder = 20;
let enemyDrawOrder = 30;
let playerDrawOrder = 40;

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
        this.playerLives = 3;
        this.allResting = false;
        this.allDead = false;

        //variables needed for level indicator at the start of each level
        this.showLevel = 0;
        this.showLevelDuration = 80;

        //help text
        let spanStart = '<span style="color: rgb(113, 229, 125)">';
        this.helpString = spanStart + 'Movement:</span> move your ship left and right with arrow keys or \'a\' and \'d\'<br><br>'+
        spanStart + 'Firing:</span> fire bullets by tapping or holding space<br><br>'+
        spanStart + 'Points:</span> get points by killing enemies and completing levels. For testing you get points by pressing \'p\'<br><br>'+
        spanStart + 'Lives:</span> start with 3 lives, and get an extra life every 10,000 points<br><br>'+
        spanStart + 'Death:</span> you die if you are hit with a bullet or if you crash into a ship. If you are pulled by a tractor beam you have the ability to get two ships. You also die when you press \'k\' for testing<br><br>'

        // Need level class instantiated here
        level = new Levels();

        // Need points system
        let pointTotal = 0;

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
        let startX = 700;
        let startY = 700;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 50 + 5;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blueOne', homeX, homeY, startX += 40, startY += 40));
        }

        //creating second row of blue enemies
        homeY = 240;
        startX = -580;
        startY = 1140;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 50 + 5;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blueTwo', homeX, homeY, startX += 40, startY -= 40));
        }

        //creating first row of red enemies
        homeY = 160;
        startX = -540;
        startY = -540;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 50 + 50;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'redOne', homeX, homeY, startX += 40, startY += 40));
        }

        //creating second row of red enemies
        homeY = 120;
        startX = 700;
        startY = -140;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 50 + 50;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'redTwo', homeX, homeY, startX += 40, startY -= 40));
        }

        //creating row of bosses
        homeY = 80;
        startX = 300;
        startY = -300;
        for(var i = 1; i <= 4; i++){
            let homeX = i * 50 + 145;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'boss', homeX, homeY, startX, startY -= 40));
        }

        this.helpHandler.addObject(new Player("player", playerDrawOrder));


        // BOTTOM of CONSTRUCTOR
    }

    restart() {
        //player info
        this.playerLives = 3;
        this.savedScore = this.playerScore;
        this.playerScore = 0;
        level.setLevel(1);
        level.setShipSpeed(1);


        let enemyDrawOrder = 30;

        // Delete the other enemies
        let enemies = gameHandler.find("enemy");
        for (let tempObject of enemies) {
            tempObject.delete();
        }

        // Delete the bullets
        let bullets = gameHandler.find("bullet")
        for (let tempObject of bullets) {
            tempObject.delete();
        }

        //creating first row of blue enemies
        let homeY = 200;
        let startX = 700;
        let startY = 700;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 50 + 5;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blueOne', homeX, homeY, startX += 40, startY += 40));
        }

        //creating second row of blue enemies
        homeY = 240;
        startX = -580;
        startY = 1140;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 50 + 5;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blueTwo', homeX, homeY, startX += 40, startY -= 40));
        }

        //creating first row of red enemies
        homeY = 160;
        startX = -540;
        startY = -540;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 50 + 50;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'redOne', homeX, homeY, startX += 40, startY += 40));
        }

        //creating second row of red enemies
        homeY = 120;
        startX = 700;
        startY = -140;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 50 + 50;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'redTwo', homeX, homeY, startX += 40, startY -= 40));
        }

        //creating row of bosses
        homeY = 80;
        startX = 300;
        startY = -300;
        for(var i = 1; i <= 4; i++){
            let homeX = i * 50 + 145;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'boss', homeX, homeY, startX, startY -= 40));
        }
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
        pauseButton.html('Success!');
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


      gameHandler.tick();
      this.collision();

      let alive = false;
      // If all the enemies have been destroyed, reset their start positions
        for (let tempObject of gameHandler.find('enemy')) {
            if (tempObject.getAlive()) {
                alive = true;
            }
        }
        if (!alive) {
            this.allDead = true;
            this.newLevelStart = true;
        }

        if (this.allDead) {
            this.allDead = false;
            level.updateLevel();
            this.resetStart();
        }


      this.allResting = false;
      let restCount = 0;
      let  aliveCount = 0;
      for (let tempObject of gameHandler.find('enemy')) {
          if (tempObject.getAlive()) {
              aliveCount += 1;
              if (tempObject.getResting()) {
                  restCount += 1;
              }
          }
      }
      if (restCount === aliveCount) {
              this.allResting = true;
      }

      let numChoosen = 0;
      for (let tempObject of gameHandler.find('enemy')) {
          if (tempObject.getChoosen()) {
              numChoosen += 1;
          }
      }
      if (this.allResting && numChoosen === 0 && aliveCount > 2) {
          this.allResting = false;
          this.flightEnemy();
      }

      if (this.allResting && numChoosen === 0 && aliveCount <= 2) {
          for (let tempObject of gameHandler.find("enemy")) {
              if (tempObject.getAlive()) {
                  tempObject.setChoosen(true);
              }
          }
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

      //lives left
      this.liveSize = 30;
      this.liveX = 15;
      this.liveY = 570;
      this.liveBuffer = 40

      if(this.playerLives == 3){
          image(playerImage, this.liveX, this.liveY, this.liveSize, this.liveSize);
          image(playerImage, this.liveX + this.liveBuffer, this.liveY, this.liveSize, this.liveSize);
      }
      if(this.playerLives == 2){
          image(playerImage, this.liveX, this.liveY, this.liveSize, this.liveSize);
      }

      //level indicator
      this.level = level.getLevel()
      text('Level: ' + this.level , 510, 570, 100, 100);

      //level start text
      if(this.showLevel <= this.showLevelDuration){
          text("LEVEL " + this.level, 270, 280, 200, 200)
          this.showLevel++;
      }
      if(this.newLevelStart){
          this.showLevel = 0;
          this.newLevelStart = false;
      }

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
        var aliveEnemy = [];
        for (var i = 0, l = enemyFlight.length; i < l; i++) {
            var tempObject = enemyFlight[i];
            if (tempObject.getAlive()) {
                aliveEnemy.push(tempObject);
            }
        }

        if (aliveEnemy.length < 3){
            var firstEnemy = aliveEnemy[0];
            var secondEnemy = aliveEnemy[1];
            return[firstEnemy,secondEnemy];
        }
        var first = Math.floor(Math.random() * aliveEnemy.length);
        var second = Math.floor(Math.random() * aliveEnemy.length);
        while (first === second) {
            second = Math.floor(Math.random() * aliveEnemy.length);
        }
        var third = Math.floor(Math.random() * aliveEnemy.length);
        while (first === third || second === third) {
            third = Math.floor(Math.random() * aliveEnemy.length);
        }
        var firstEnemy = aliveEnemy[first];
        var secondEnemy = aliveEnemy[second];
        var thirdEnemy = aliveEnemy[third];

        //console.log(firstEnemy, secondEnemy, thirdEnemy);
        return [firstEnemy, secondEnemy, thirdEnemy];
    }

    flightEnemy() {
        let enemiesChoosen = [];
        enemiesChoosen = this.chooseEnemyFlight();

        if(enemiesChoosen.length < 3){
            enemiesChoosen[0].setChoosen(true);
            enemiesChoosen[1].setChoosen(true);
        }
        else{
            enemiesChoosen[0].setChoosen(true);
            enemiesChoosen[1].setChoosen(true);
            enemiesChoosen[2].setChoosen(true);
        }

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
                if ((enemies[j].getX()  <= bullets[i].getRightX()) &&
                    ((enemies[j].getX() + enemies[j].getSize()) >= bullets[i].getLeftX()) &&
                    ((enemies[j].getY() + enemies[j].getSize()) >= bullets[i].getTopY()) &&
                    (enemies[j].getY() <= bullets[i].getBottomY()) &&
                    (bullets[i].getType() === "player") &&
                    enemies[j].getExploding() == false){

                    // Set the status of enemy to false
                    enemies[j].lostLife();
                    //console.log("Bullet hit");
                    this.addPoints(10);
                    bullets[i].delete();

                    }
                }
            }
        if (player[0].getExploding() == false){
            for (i = 0; i < bullets.length; ++i) {
                if ((player[0].getX()  <= bullets[i].getRightX()) &&
                    ((player[0].getX() + player[0].getSize()) >= bullets[i].getLeftX()) &&
                    ((player[0].getY() + player[0].getSize()) >= bullets[i].getTopY()) &&
                    (player[0].getY() <= bullets[i].getBottomY())
                    && (bullets[i].getType() === "enemy")) {

                    // Player hit with enemy bullet
                    player[0].kill();
                    console.log("Player hit by bullet");
                    bullets[i].delete();
                }
            }

            for (i = 0; i < enemies.length; ++i) {
                if ((player[0].getX()  <= (enemies[i].getX() + enemies[i].getSize())) &&
                    ((player[0].getX() + player[0].getSize()) >= enemies[i].getX()) &&
                    ((player[0].getY() + player[0].getSize()) >= enemies[i].getY()) &&
                    (player[0].getY() <= (enemies[i].getY() + enemies[i].getSize()))) {

                    enemies[i].lostLife();
                    //console.log("Enemy hit user");
                    player[0].kill();
                }
            }
        }
    }


    addPoints(points) {
        this.playerScore += (points * level.getLevel());
    }
    // Have points counter print to certain point on screen (in draw method)


    resetStart() {
        this.allDead = false;

        let enemyDrawOrder = 30;

        // Delete the other enemies
        let enemies = gameHandler.find("enemy");
        for (let tempObject of enemies) {
            tempObject.delete();
        }

        // Delete the bullets
        let bullets = gameHandler.find("bullet")
        for (let tempObject of bullets) {
            tempObject.delete();
        }

        // Generate 4 random numbers
        var first = Math.floor(Math.random() * 4);
        var second = Math.floor(Math.random() * 4);
        while (first === second) {
            second = Math.floor(Math.random() * 4);
        }
        var third = Math.floor(Math.random() * 4);
        while (first === third || second === third) {
            third = Math.floor(Math.random() * 4);
        }
        var fourth = Math.floor(Math.random() * 4);
        while (first === fourth || second === fourth || third === fourth) {
            fourth = Math.floor(Math.random() * 4);
        }

        // Call getStarts for new starting positions
        var start = getStarts(first);
        var offset = this.offsetStart(start[0], start[1]);
        var x = start[0];
        var y = start[1];

        let homeY = 200;
        let startX = x;
        let startY = y;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 50 + 5;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blueOne', homeX, homeY, startX += offset[0], startY += offset[1]));
        }

        start = getStarts(second);
        offset = this.offsetStart(start[0], start[1]);
        x = start[0];
        y = start[1];
        homeY = 240;
        startX = x;
        startY = y;
        for(var i = 1; i <= 10; i++){
            let homeX = i * 50 + 5;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'blueTwo', homeX, homeY, startX += offset[0], startY += offset[1]));
        }

        start = getStarts(third);

        offset = this.offsetStart(start[0], start[1]);
        x = start[0];
        y = start[1];
        //creating first row of red enemies
        homeY = 160;
        startX = x;
        startY = y;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 50 + 50;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'redOne', homeX, homeY, startX += offset[0], startY += offset[1]));
        }


        start = getStarts(fourth);


        offset = this.offsetStart(start[0], start[1]);
        x = start[0];
        y = start[1];
        homeY = 120;
        startX = x;
        startY = y;
        for(var i = 1; i <= 8; i++){
            let homeX = i * 50 + 50;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'redTwo', homeX, homeY, startX += offset[0], startY += offset[1]));
        }

        homeY = 80;
        startX = 300;
        startY = -300;
        for(var i = 1; i <= 4; i++){
            let homeX = i * 50 + 145;
            gameHandler.addObject(new Enemy("enemy", enemyDrawOrder, 'boss', homeX, homeY, startX, startY -= 40));
        }

    }

    offsetStart(x, y) {
        // Has an if else that looks at the x value and either returns a positive value
        // or negative and this is incremented or decremented (if negative) in the for loops
        // of each tempObject when the tempObject.setStartX()

        // If x is 640 and y is 640, return x = 40, y = 40
        if (x === 700 && y === 700) {
            return [40, 40];
        } else if (x === -580 && y === 1140) {
            // If x is --540 and y is 1100 return x = 20, y = -20
            return [40, -40];
        } else if (x === -540 && y === -540) {
            // If x is -160 and y is -160, return x = 20, y = 20
            return [40, 40];
        } else if (x === 700 && y === -140) {
            // If x is 620 and y is -20, return x = 20, y = -20
            return [40, -40];
        }
    }
}
