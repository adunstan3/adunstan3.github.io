var database;
var squareX = 10, squareY = 20;
var squareXvel = -2.2, squareYVel = 1.2;
var squareSize = 100;


function setup() {
  createCanvas(400, 400);

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDX5RQVczOui-HbJv3cURmguxIwsOACCy4",
    authDomain: "cs205-galaga.firebaseapp.com",
    projectId: "cs205-galaga",
    storageBucket: "cs205-galaga.appspot.com",
    messagingSenderId: "557175728490",
    appId: "1:557175728490:web:7e01673f71c0758b0e1d13"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  database= firebase.database();

  var ref = database.ref("scores").orderByValue();
  ref.on('value', gotData, errData);
}

function gotData(data){
  var scores = data.val();
  var keys = Object.keys(scores);

  document.getElementById("topScores").innerHTML = "";

  for(var i = 0; i < keys.length; i++){
    var k = keys[i];
    var name = scores[k].name;
    var score = scores[k].score;
    // console.log(name, score);
    var li = createElement('li', name+": "+score);
    li.parent('topScores');
  }
}

function errData(err){
  console.log("Data error");
  console.log(err);
}

function draw() {
  background(220);

  squareX += squareXvel;
  squareY += squareYVel;

  if(squareX <= 0  || squareX >= width - squareSize){
    squareXvel = - squareXvel;
  }

  if(squareY <= 0 || squareY >= height - squareSize){
    squareYVel = -squareYVel;
  }

  fill('red');
  noStroke();
  square(squareX, squareY, squareSize);
}

function submitScore(){
  var playerName = document.getElementById("playerName").value;
  var playerScore = document.getElementById("playerScore").value;

  document.getElementById("playerName").value = "";
  document.getElementById("playerScore").value = "";

  var ref = database.ref("scores");

  var data = {
    name: playerName,
    score: playerScore
  }

  ref.push(data);

  console.log("Player name: "+playerName+", Player score: "+playerScore);
}
