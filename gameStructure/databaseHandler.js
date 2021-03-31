class databaseHandler {
  constructor(){
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
    this.database= firebase.database();
    var ref = this.database.ref("scores");

    //Set up a listener to score updating
    //get the players sorted, and only the top 5
    ref.orderByChild("score").limitToLast(5).on('value', this.gotData, this.errData);
  }

  //Called at website load, and when the data base is updated
  gotData(data){
    //get player data and reverse the order saving it in the array
    game.topScores = [];

    data.forEach(function(child){
      game.topScores.unshift(child.val());
    })
  }

  errData(err){
    console.log("Data error");
    console.log(err);
  }

  submitScore(playerName, playerScore){
    //Save new score
    //package data into json
    var data = {
      name: playerName,
      score: playerScore
    }

    //send json to database
    var ref = this.database.ref("scores");
    ref.push(data);

    console.log("New Score!");
    console.log("Player name: "+playerName+", Player score: "+playerScore);
  }
}
