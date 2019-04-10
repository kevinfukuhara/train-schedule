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
    
    // Clear the tbody
    $("tbody").empty();

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

        for (var i = 0; i < trainArr.length; i++) {
            // Store into variables the needed info from FireBase Query
            var trainName = trainArr[i].trainName;
            var destination = trainArr[i].destination;
            var freq = trainArr[i].frequency;
            var firstTime = trainArr[i].firstTime;

            // Create new table row item
            var newRow = $("<tr>");

            // Create new <th> elements to hold the information
            var thName = $("<th>");
            thName.attr("scope", "col");
            thName.html(trainName);

            var thDest = $("<th>");
            thDest.attr("scope", "col");
            thDest.html(destination);

            var thFreq = $("<th>");
            thFreq.attr("scope", "col");
            thFreq.html(freq);

            // NEED Moment.js calculations here

            // Find the difference between now timestamp and the first train time we have on file
            //  THEN, Mod the difference (minDiff) by the frequency in which trains arrive to get how long in between the next train is from now.
            var firstTimeConverted = moment(firstTime, "hh:mm A").subtract(1, "years");

            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            var minDiff = moment().diff(moment(firstTimeConverted), "minutes");
            var remainderMin = minDiff % freq;
            var timeTillNextTrain = freq - remainderMin;
            console.log(moment(firstTimeConverted));
            console.log("Time from now till next train arrival: " + timeTillNextTrain);

            var nextArrive = moment().add(timeTillNextTrain, 'minutes').format('hh:mm A');
            console.log("Time of next Arrival: " + timeTillNextTrain);

            var thNextArrive = $("<th>");
            thNextArrive.attr("scope", "col");
            thNextArrive.html(nextArrive);

            var thMinAway = $("<th>");
            thMinAway.attr("scope", "col");
            thMinAway.html(timeTillNextTrain);

            // Append all <th> to the <tr>
            newRow.append(thName);
            newRow.append(thDest);
            newRow.append(thFreq);
            newRow.append(thNextArrive);
            newRow.append(thMinAway);

            // Append <tr> to the <tbody> in HTML
            $("tbody").append(newRow);
        }

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

function submitTrain() {
    // prevent form from submitting with event.preventDefault() or returning false
    event.preventDefault();

    console.log("New Train submitted!");

    // store info from HTML page
    var trainName = $("#train-name").val();
    var dest = $("#destination").val();
    var trainStart = $("#train-start").val();
    var freq = $("#frequency").val();

    // database.ref("trains/").on("value", function (snapshot) {
    // });
    var ref = database.ref();
    var trainRef = ref.child("trains");

    trainRef.push({
        trainName: trainName,
        destination: dest,
        firstTime: trainStart,
        frequency: freq
    });

    displayTrainSchedule();
}

// ------------------------------
//  EVENT HANDLERS
//-------------------------------

// A $( document ).ready() block.
$(document).ready(function () {
    console.log("Document is ready!");

    displayTrainSchedule();

    // ------------------------------
    //  EVENT HANDLERS
    //-------------------------------
    $("#submit-train").on("click", submitTrain);

});

