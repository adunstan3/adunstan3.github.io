var database;

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
}

function draw() {
  background(220);
}

function submit(){
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
