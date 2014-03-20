// My init function
// Notice: - no parameters taken
//         - refers to "canv" which refers to the element with
//           id "canvas" in sound.html
//         - refers to "ctx" which is defined in sound.js 



function loadFreqBars() {
	initGraphics = initFreqBars;
	updateGraphics = drawBars;
	setupControlPanelFreqBars();
	initSound();
}

function setupControlPanelFreqBars() {
	document.getElementById("controlPanelHeader").innerHTML="Frequency Bars";
	document.getElementById("controlPanelMessage").innerHTML="Key Commands: none";
}


function initFreqBars() {
	
		initCanvas();

		//create gradient for the bins
		gradient = ctx.createLinearGradient(0,0,0,300);
		gradient.addColorStop(1,'#ff0000'); //red
		gradient.addColorStop(0.5,'#ffff00'); //yellow
		gradient.addColorStop(0,'#ffffff'); //white
		//set new gradient as fill style
		ctx.fillStyle = gradient;
}

// My update function
// Notice: takes in array as parameter
function drawBars (array, waveArray, beat) {

	//just show bins with a value over the treshold
	var threshold = 0;
	// clear the current state
	ctx.clearRect(0, 20, canv.width, canv.height);
	//the max count of bins for the visualization
	//space between bins
	var space = 15;

	//go over each bin
	for ( var i = 0; i < maxBinCount; i++ ){

		var value = array[i];
		if (value >= threshold) {				

			//draw bin
			ctx.fillRect(5 + i * space, canv.height - value, 5 , value);

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