demoSize = 600;
cellNum = 60;
cellNumBuffer = 0;
cellSize = 0;
cells = [];
tempCells = [];

preyDeathRate = 0.0;
preyReproductionRate = .6;
predetorDeathRate = .3;
predetorReproductionRate = .7;

preyMutationRate = 0;
preditorPreference = 0;
paused = false;

let mothImg;

function preload() {
  mothImg = loadImage('assets/whiteBlackMoth.jpg');
}

function setup() {
  createGrid();
  createCanvas(demoSize*2, demoSize);
  createInteractions();
}

function draw() {
  stroke(255);
  strokeWeight(1);
  background(255);
  fill(230);
  square(0,0, demoSize);


  preyDeathRate = preyDeathSlider.value()/100;
  predetorDeathRate = predatorDeathSlider.value()/100;
  preyReproductionRate = preyReproductionSlider.value()/100;
  predetorReproductionRate = predatorReproductionSlider.value()/100;
  preyMutationRate = preyMutationSlider.value()/100;
  preditorPreference = predatorPreferenceSlider.value()/100;

  //Cap the mutation rate at 20 percent
  preyMutationRate *= .2;

  //Cap the preference rate at .55
  preditorPreference *= .55;

  drawTextLabels();

  image(mothImg, demoSize + 65, 320, 280, 280);


  if(frameCount%4 ==0 && !paused){
    updateGrid();
  }

  drawGrid();

  //Draw outline around the grid
  stroke(0);
  fill(0,0,0,0);
  strokeWeight(4);
  square(0,0, demoSize);

  stroke(255);
  line(demoSize+2, 0, demoSize+2, demoSize);
}

function createGrid(){
  cells = [];
  cellNumBuffer = cellNum +2;
  cellSize = int(demoSize/cellNum);
  demoSize = cellSize*cellNum;

  state = '-';
  stateNum = 0;
  for(colNum = 0; colNum<cellNumBuffer; colNum ++){
    temp = new Array(cellNum);
    for(rowNum = 0; rowNum<cellNumBuffer; rowNum ++){
      stateNum = Math.random();
      if(stateNum < .25) state = '1';
      else if(stateNum < .5) state = '2';
      else if(stateNum < .75) state = 'P';
      else state = '-';

      if(rowNum == 0 || rowNum == (cellNumBuffer-1)) state = 'n';

      temp[rowNum] = state;
    }

    if(colNum == 0 || colNum == (cellNumBuffer-1)) temp.fill('n');

    cells[colNum] = temp;
  }
  tempCells = cells;
}

function drawGrid(){
  for(colNum = 0; colNum<cellNum; colNum ++){
    for(rowNum = 0; rowNum<cellNum; rowNum ++){
      state = cells[colNum+1][rowNum+1];
      //console.log(colNum, rowNum);
      switch(state) {
        case '-':
          fill(255);
          break;
        case '1':
          fill(13, 222, 131);
          break;
        case '2':
          fill(235, 178, 35);
          break;
        case 'P':
          fill(100);
          break;
        case 'n':
          fill(1, 21, 230);
          break;
      }
      square(colNum*cellSize, rowNum*cellSize, cellSize);
    }
  }
  console.log(preditorPreference);
}


function updateGrid(){
  //Set up usefull variables including the directions to check
  isDead = false;
  directions = [{col:1, row:0, preyDirections : [{col:1, row:1}, {col:1, row:-1}, {col:0, row:1}, {col:0, row:-1}]},
                {col:0, row:1, preyDirections : [{col:1, row:1}, {col:-1, row:1}, {col:1, row:0}, {col:-1, row:0}]},
                {col:-1, row:0, preyDirections : [{col:-1, row:1}, {col:-1, row:-1}, {col:0, row:1}, {col:0, row:-1}]},
                {col:0, row:-1, preyDirections : [{col:1, row:-1}, {col:-1, row:-1}, {col:1, row:0}, {col:-1, row:0}]}]

  for(colNum = 1; colNum<cellNum+1; colNum ++){
    for(rowNum = 1; rowNum<cellNum+1; rowNum ++){
      state = cells[colNum][rowNum];
      isDead = false;

      //Prey code
      if(state == '1' || state == '2'){
        //Test death
        if(Math.random() < preyDeathRate){
          tempCells[colNum][rowNum] = '-';
          isDead = true;
        }
        if(!isDead){
          for(d = 0; d<4; d++){
            //Is there a blank space in any of the 4 directions
            if(cells[colNum+directions[d].col][rowNum+directions[d].row] == '-'){
              if(Math.random() < preyReproductionRate){
                if(Math.random() < preyMutationRate){
                  if(tempCells[colNum][rowNum] == '1') {
                    tempCells[colNum+directions[d].col][rowNum+directions[d].row] = '2';
                  }else{
                    tempCells[colNum+directions[d].col][rowNum+directions[d].row] = '1';
                  }
                }else{
                  tempCells[colNum+directions[d].col][rowNum+directions[d].row] = tempCells[colNum][rowNum];
                }
              }
            }
          }
        }
      }

      //predetor code
      if(state == 'P'){
        //Test death
        if(Math.random() < predetorDeathRate){
          tempCells[colNum][rowNum] = '-';
          isDead = true;
        }
        if(!isDead){
          //Test mate near by
          for(dir = 0; dir<4; dir++){
            if(cells[colNum+directions[dir].col][rowNum+directions[dir].row] == 'P'){ //Mate to the right?
              for(preyDir = 0; preyDir < 4; preyDir++){
                preyCol = directions[dir].preyDirections[preyDir].col;
                preyRow = directions[dir].preyDirections[preyDir].row;

                //Is there food for both of them to eat?
                if(cells[colNum+preyCol][rowNum+preyRow] == '1'){
                  if(Math.random() < (predetorReproductionRate - preditorPreference)){
                    tempCells[colNum+preyCol][rowNum+preyRow] = tempCells[colNum][rowNum];
                  }
                }

                if(cells[colNum+preyCol][rowNum+preyRow] == '2'){
                  if(Math.random() < (predetorReproductionRate + preditorPreference)){
                    tempCells[colNum+preyCol][rowNum+preyRow] = tempCells[colNum][rowNum];
                  }
                }

              }
            }

           }

          }
        }
      }
      //end preditor code

    }
  }

function pauseGrid(){
  paused = !paused;
}


function createInteractions(){
  resetButton = createButton('Reset');
  resetButton.position(demoSize+50, 100);
  resetButton.mousePressed(createGrid);
  
  pauseButton = createButton('Pause');
  pauseButton.position(demoSize+125, 100);
  pauseButton.mousePressed(pauseGrid);

  preyReproductionSlider = createSlider(0, 100, int(preyReproductionRate*100));
  preyReproductionSlider.position(demoSize+50, 160);
  preyReproductionSlider.style('width', '300px');

  preyDeathSlider = createSlider(0, 100, int(preyDeathRate*100));
  preyDeathSlider.position(demoSize+50, 200);
  preyDeathSlider.style('width', '300px');

  predatorReproductionSlider = createSlider(0, 100, int(predetorReproductionRate*100));
  predatorReproductionSlider.position(demoSize+50, 240);
  predatorReproductionSlider.style('width', '300px');

  predatorDeathSlider = createSlider(0, 100, int(predetorDeathRate*100));
  predatorDeathSlider.position(demoSize+50, 280);
  predatorDeathSlider.style('width', '300px');

  preyMutationSlider = createSlider(0, 100, int(preyMutationRate*100));
  preyMutationSlider.position(demoSize+50, 360);
  preyMutationSlider.style('width', '300px');

  predatorPreferenceSlider = createSlider(-100, 100, int(preditorPreference*100));
  predatorPreferenceSlider.position(demoSize+50, 400);
  predatorPreferenceSlider.style('width', '300px');
}

function drawTextLabels(){
  fill(0);
  textSize(12);

  text('Prey Reproduction Rate (0% - 100%)', demoSize+50, 35);
  text((preyReproductionRate*100).toFixed(2)+"%", demoSize+350, 55);

  text('Prey Death Rate (0% - 100%)', demoSize+50, 75);
  text((preyDeathRate*100).toFixed(2)+"%", demoSize+350, 95);

  text('Predator Reproduction Rate (0% - 100%)', demoSize+50, 115);
  text((predetorReproductionRate*100).toFixed(2)+"%", demoSize+350, 135);

  text('Predator Death Rate (0% - 100%)', demoSize+50, 155);
  text((predetorDeathRate*100).toFixed(2)+"%", demoSize+350, 175);

  text('Prey Mutation Rate (0% - 20%)', demoSize+50, 235);
  text((preyMutationRate*100).toFixed(2)+"%", demoSize+350, 255);

  text('Predator Preference (Only eat green - Only eat oarnge)', demoSize+50, 275);
  text((preditorPreference*100).toFixed(2)+"%", demoSize+350, 295);
}
