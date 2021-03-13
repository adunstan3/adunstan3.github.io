

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
}

function draw() {
  background(220);
}
