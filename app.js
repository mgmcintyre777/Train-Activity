"use strict";

const $addTrain = $("#add-train");
const $tName = $("#train-name");
const $tDest = $("#train-destination");
const $tStart = $("#first-train-time");
const $tFreq = $("#train-frequency");
const $tData = $("#train-data");
const $clock = $("#main-clock");
const yesterday = moment().subtract(1,'d').format("M/D/YYYY");
const trainData = [];
const db = initFirebase();
const timeInterval = setInterval(updateTimes, 1000);
$clock.html(moment().format("h:mm:ss a"));

function updateTimes(){

	$clock.html(moment().format("h:mm:ss a"));

	trainData.forEach(function(trainObj){

		var diffTime = moment().diff(trainObj.st, "seconds");
		var tRemainder = diffTime % trainObj.fq;
		var tsecondsTillTrain = moment.duration((trainObj.fq - tRemainder), "seconds");
		var nextTrain = moment().add(tsecondsTillTrain, "seconds");
		trainObj.$a.html(nextTrain.format("h:mm a"));
		trainObj.$r.html(nextTrain.fromNow(true));

	})
}

db.ref("trains").on("child_added",

	function(snapshot) {
		
		var $tr = $("<tr>");
		var $td_num = $("<td>").html(trainData.length + 1);
		var $td_name = $("<td>").html(snapshot.val().name);
		var $td_dest = $("<td>").html(snapshot.val().dest);
		var $td_ariv = $("<td>");
		var $td_time = $("<td>");

		trainData.push({
			$a: $td_ariv,
			$r: $td_time,
			st: moment(yesterday + snapshot.val().start, "M/D/YYYY H:mm"),
			fq: snapshot.val().freq * 60
		});

		updateTimes();

		$tr.append($td_num);
		$tr.append($td_name);
		$tr.append($td_dest);
		$tr.append($td_ariv);
		$tr.append($td_time);
		$tData.append($tr);
	
	}
);

function initFirebase(){

	firebase.initializeApp({
	 apiKey: "AIzaSyBdJ0xTSpbeCGUr5SLIlQPjh3Jrnt_gmUw",
	 authDomain: "rockpaperscissors-713b3.firebaseapp.com",
	 databaseURL: "https://rockpaperscissors-713b3.firebaseio.com",
	 projectId: "rockpaperscissors-713b3",
	 storageBucket: "rockpaperscissors-713b3.appspot.com",
	 messagingSenderId: "853712295348"
	});

	return firebase.database();
}

function addTrain(){

	event.preventDefault();

	db.ref("trains").push({
		name: $tName.val().trim(),
		dest: $tDest.val().trim(),
		start: $tStart.val().trim(),
		freq: $tFreq.val().trim()
	});

	$tName.val("");
	$tDest.val("");
	$tStart.val("");
	$tFreq.val("");
}

// testPush();

// function testPush(){
// 	db.ref("trains").remove();

// 	db.ref("trains").push({
// 		name: "Super Fast",
// 		dest: "Charlotte, NC",
// 		start: "8:30",
// 		freq: "2"
// 	});

// 	db.ref("trains").push({
// 			name: "Orient Express",
// 			dest: "Istanbul",
// 			start: "14:00",
// 			freq: "53"
// 	});

// 	db.ref("trains").push({
// 			name: "Flying Scotsman",
// 			dest: "London",
// 			start: "2:00",
// 			freq: "17"
// 	});
// }