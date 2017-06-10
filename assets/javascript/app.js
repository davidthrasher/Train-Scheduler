$(document).ready(function() {
    // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBAqPh49EwPlbjNTRs65QtlCJJ0Ud0zj1g",
        authDomain: "train-scheduler-6abdd.firebaseapp.com",
        databaseURL: "https://train-scheduler-6abdd.firebaseio.com",
        projectId: "train-scheduler-6abdd",
        storageBucket: "train-scheduler-6abdd.appspot.com",
        messagingSenderId: "317154026070"
      };

      firebase.initializeApp(config);

    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = 0;

    $('#submit-train').on("click", function(event){
      event.preventDefault();
      //store form input values as strings to global variables
      trainName = $('#train-name').val().trim();
      destination = $('#destination').val().trim();
      trainTime = $('#first-train-time').val().trim();
      frequency = $('#frequency').val().trim();

      database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

database.ref().on("child_added", function(childSnapshot){

    var train = childSnapshot.val().trainName;
    var dest = childSnapshot.val().destination;
    var time = childSnapshot.val().trainTime;
    var freq = childSnapshot.val().frequency;

    var currentTime = moment().format("HH:mm");
    //convert time to ensure that the first train time has happened in the past
    var convertedTime = moment(time, "HH:mm").subtract(1, "years");
    //determine difference in time in ms
    var diffTime = moment().diff(moment(convertedTime), "minutes");
    //determine how far apart in time
    var remainder = diffTime % freq;
    //determine how many minutes until the next arrival
    var minutesUntilArrival = freq - remainder;

    var nextTrain = moment().add(minutesUntilArrival, "minutes");
    //determine the arrival time of the next train
    var arrival = moment(nextTrain).format("HH:mm");
    //write all this data to the table
    $('#itemize').append("<tr><td>" + train + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + arrival + "</td><td>" + minutesUntilArrival + "</td>");

    });
  });
