"use strict";

const $addTrain = $("#add-train");
const $tName = $("#train-name");
const $tDest = $("#train-destination");
const $tStart = $("#first-train-time");
const $tFreq = $("#train-frequency");
const $tData = $("#train-data");
const $clock = $("#main-clock");
const yesterday = moment().subtract(1,'d').format("M/D/YYYY");
const db = initFirebase();

var numTrains = 0;
var startTimes = [];

$addTrain.on("click", addTrain);
$clock.html(moment().format("h:mm:ss a"));

var timeInterval = setInterval(everySecond, 1000);

function everySecond(){
	$clock.html(moment().format("h:mm:ss a"));
	startTimes.forEach(function(trainObj){
		// let diffr = trainObj.st.diff(moment(), "seconds");
		// let left = diffr % (trainObj.fq * 60);
		// let arival = moment().add()
		// console.log(trainObj.name, diffr, left)
	})
}

db.ref("trains").on("child_added",

	function(snapshot) {
		
		var $tr = $("<tr>");
		var $td_num = $("<td>").html(++numTrains);
		var $td_name = $("<td>").html(snapshot.val().name);
		var $td_dest = $("<td>").html(snapshot.val().dest);
		var $td_ariv = $("<td>").html("xxx");
		var $td_time = $("<td>").html("xxx");

		startTimes.push({
			$a: $td_ariv,
			$r: $td_time,
			st: moment(snapshot.val().start, "M/D/YYYY H:mm"),
			fq: snapshot.val().freq
		});

		$tr.append($td_num);
		$tr.append($td_name);
		$tr.append($td_dest);
		$tr.append($td_ariv);
		$tr.append($td_time);
		$tData.append($tr);
	
	}
);

//testPush();

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

function testPush(){
	db.ref("trains").remove();

	db.ref("trains").push({
		name: "name1",
		dest: "dest1",
		start: yesterday + "8:30",
		freq: "30"
	});

	db.ref("trains").push({
			name: "name2",
			dest: "dest2",
			start: yesterday + "14:30",
			freq: "1"
	});
}