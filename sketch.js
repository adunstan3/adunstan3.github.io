//Global database variables
var database;
var scoreThreshold = 10;

//Global p5 variables
var squareX = 10, squareY = 20;
var squareXvel = -2.2, squareYVel = 1.2;
var squareSize = 100;


function setup() {
  createCanvas(400, 400);

  // Your web app's Firebase configuration
  var firebaseConfig = {
    // Not at all secure!
    apiKey: "AIzaSyDX5RQVczOui-HbJv3cURmguxIwsOACCy4",
    authDomain: "cs205-galaga.firebaseapp.com",
    projectId: "cs205-galaga",
    storageBucket: "cs205-galaga.appspot.com",
    messagingSenderId: "557175728490",
    appId: "1:557175728490:web:7e01673f71c0758b0e1d13"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //establish a reference to top scores
  database= firebase.database();
  var ref = database.ref("scores");

  //Set up a listener to score updating
  //get the players sorted, and only the top 5
  ref.orderByChild("score").limitToLast(5).on('value', gotData, errData);
}

//Called at website load, and when the data base is updated
function gotData(data){
  //clear curent list
  document.getElementById("topScores").innerHTML = "";

  //get player data and reverse the order
  var topPlayerList = [];
  data.forEach(function(child){
    topPlayerList.unshift(child.val());
  })

  //Make a list element for each to player
  var player;
  for (player of topPlayerList) {
    name = player.name;
    score = player.score;
    console.log(name, score);

    var li = createElement('li', name+": "+score);
    li.parent('topScores');
  }
}

function errData(err){
  console.log("Data error");
  console.log(err);
}

//P5 function for the canvas
function draw() {
  background(220);

  //move the square
  squareX += squareXvel;
  squareY += squareYVel;

  //keep the square in bounds
  if(squareX <= 0  || squareX >= width - squareSize){
    squareXvel = - squareXvel;
  }
  if(squareY <= 0 || squareY >= height - squareSize){
    squareYVel = -squareYVel;
  }

  //draw the square
  fill('red');
  noStroke();
  square(squareX, squareY, squareSize);
}

//called every time the submit button is pressed
function submitScore(){
  //get input
  var playerName = document.getElementById("playerName").value;
  var playerScore = document.getElementById("playerScore").value;
  playerScore = parseInt(playerScore);

  //clear input fields
  document.getElementById("playerName").value = "";
  document.getElementById("playerScore").value = "";

  if(playerScore > scoreThreshold){
    //Save new score
    //package data into json
    var data = {
      name: playerName,
      score: playerScore
    }

    //send json to database
    var ref = database.ref("scores");
    ref.push(data);

    console.log("New Score!");
    console.log("Player name: "+playerName+", Player score: "+playerScore);
  }else{
    alert("Score not high enough :(");
  }
}
