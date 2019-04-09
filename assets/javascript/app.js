// Link the database here
var config = {
    apiKey: "AIzaSyAuFAnJKox2R1PJFcsxaNpF9OnI5oKHDm8",
    authDomain: "test-db-a75be.firebaseapp.com",
    databaseURL: "https://test-db-a75be.firebaseio.com",
    projectId: "test-db-a75be",
    storageBucket: "test-db-a75be.appspot.com",
    messagingSenderId: "998883160586"
};
firebase.initializeApp(config);

// VARIABLES
// --------------------------------------------------------------------------------
// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// var trainArr = [];       // Varible to hold the schedule of currently listed trains


// FUNCTIONS
// --------------------------------------------------------------------------------

// Function to display a train schedule
function displayTrainSchedule() {
    // // prevent form from submitting with event.preventDefault() or returning false
    // event.preventDefault();

    // reference the database
    //  At the page load and subsequent value changes, get a snapshot of the stored data.
    // This function allows you to update your page in real-time when the firebase database changes.
    database.ref("trains/").on("value", function (snapshot) {
        console.log(snapshot.val());
        
        var trainArr = [];       // Varible to hold the schedule of currently listed trains

        snapshot.forEach(function (childSnapshot) {
            var train = childSnapshot.val();
            train.key = childSnapshot.key;

            trainArr.push(train);
        });
        console.log(trainArr);

        for(var i = 0; i < trainArr.length; i++) {
            console.log(i);
        }

        

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

// A $( document ).ready() block.
$(document).ready(function () {
    console.log("Document is ready!");

    displayTrainSchedule();
});