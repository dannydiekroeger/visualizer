// My init function
// Notice: - no parameters taken
//         - refers to "canv" which refers to the element with
//           id "canvas" in sound.html
//         - refers to "ctx" which is defined in sound.js 

var state;
var arraysize = 1024;

function initDots() {
		// get the context from the canvas to draw on
	    var canv = document.getElementById("canvas");
	    var ctx = canv.getContext("2d");
	    canv.setAttribute("width", window.innerWidth - 50);
	    canv.setAttribute("height", window.innerHeight-50);
	    canv.setAttribute("style", "background:black");
		//create gradient for the bins
		//gradient = ctx.createLinearGradient(0,0,0,canv.height);
		//gradient.addColorStop(1,'#000000'); //black
		//gradient.addColorStop(0.75,'#ff0000'); //red
		//gradient.addColorStop(0.25,'#ffff00'); //yellow
		//gradient.addColorStop(0,'#ffffff'); //white
	
		//set new gradient as fill style
		//ctx.fillStyle = gradient;
		state = new Array();
		for(var i=0; i<arraysize; i++) {
			state[i] = new Array();
		}
}

function updateDots(array) {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	//console.log(array);
	var scale = 100;
	for(var i=0; i<array.length; i++) {
		var value = array[i];
		var val = value/scale;
		if(val > state[i].length) {
			addDots(val-state[i].length, i);
		} else {
			removeDots(state[i].length-val, i);
		}

		
	}
}

function addDots(num, i) {
	console.log("addDots");
	console.log(num);
	console.log(i);
	stateIndex = state[i].length;
	for (var a=0; a<num; a++) {		
		var xloc = Math.random()*canv.getAttribute("width");
		var yloc = Math.random()*canv.getAttribute("height");
		var color = getColor(i);	
		drawDot(xloc, yloc, color);
		state[i][stateIndex] = new Object();
		state[i][stateIndex].xloc = xloc;
		state[i][stateIndex].yloc = yloc;
		state[i][stateIndex].color = color;
		stateIndex++;
	}
}

function removeDots(num, i) {
	//console.log("remove");
	stateIndex = state[i].length-1;
	for (var a=0; a<num; a++) {
		var dot = state[i].pop();
		clearDot(dot.xloc, dot.yloc);
	}
}

function getColor(i) {
	//console.log("getting color");
	return '#ffffff';
}

var dotsize = 1;

function drawDot(x,y,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x,y,dotsize,dotsize);
}

function clearDot(x,y) {
	ctx.clearRect(x,y,dotsize,dotsize);
}

// My update function
// Notice: takes in array as parameter
function drawBars (array) {

	//just show bins with a value over the treshold
	var threshold = 0;
	// clear the current state
	ctx.clearRect(0, 20, canv.width, canv.height);
	//the max count of bins for the visualization
	var maxBinCount = array.length;
	//space between bins
	var space = 15;
	console.log(maxBinCount);
	//go over each bin
	for ( var i = 0; i < maxBinCount; i++ ){

		var value = array[i];
		if (value >= threshold) {				

			//draw bin
			ctx.fillRect(5 + i * space, canv.height - value*2, 5 , canv.height);

			//draw every second bin area in hertz	
			//if (i % 2 == 0) {
			//	ctx.font = '12px sans-serif';
			//	ctx.textBaseline = 'bottom';
			//	ctx.fillText(Math.floor(context.sampleRate / analyser.fftSize * i), i * space + 5, 20);
			//}
		}
	}
}

// Helper function
//calc the color for the spectral based on the value "v"
function getColor (v) {
	var maxVolume = 255;
	//get percentage of the max volume
	var p = v / maxVolume;
	var np = null;

	if (p < 0.05) {
		np = [0,0,0] //black
	//p is between 0.05 and 0.25
	} else if (p < 0.25) {
		np = [parseInt(255 * (1-p)),0,0] //between black and red
	//p is between 0.25 and 0.75
	} else if (p < 0.75) {
		np = [255,parseInt(255 * (1-p)),0];	 //between red and yellow
	//p is between 0.75 and 1
	} else {
		np = [255,255,parseInt(255 * (1-p))]; //between yellow and white
	}

	return 'rgb('+ (np[0]+","+np[1]+","+np[2]) + ")";
}