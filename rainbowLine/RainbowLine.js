var rainbowNodes = 64;
var rainbowFirsttime;
var rainbowFirsttime2;
var rainbowRadius;
var rainbowLeftOfs;
var rainbowInnerOfs;
var rainbowFloor;
var rainbowWaveFloor;
var rainbowOfs;
var rainbowInterpSize;
var rainbowWaveInterpSize;
var rainbowFirstvisArrayElem;
var rainbowLastvisArrayElem;
var twoPI = 2.0 * Math.PI;
var rainbowCircles = new Array();
var rainbowWaves = new Array();

var rainbowPriorValues = new Array();
var rainbowPeriod = 5;
var rainbowLastAverages = new Array();


var rainbowHuman = false;
var rainbowWavesDraw = false;
var doType = 0;

// Constructor function to build a circle structure

function baseCircle(pos, colorH, floorY) {
	this.radius = rainbowRadius;
	this.cx = rainbowLeftOfs + (rainbowInnerOfs * pos);
	this.cy = floorY;
	this.colorH = colorH;
	this.colorS = 50;
	this.colorL = 50;
	this.pos = pos;
}

function drawLineCircles(circleArray) {
	for (var i = 0; i < circleArray.length; i++)
	{
		ctx.beginPath();
		ctx.fillStyle = "hsl(" + circleArray[i].colorH + ", " + circleArray[i].colorS + "%, " + circleArray[i].colorL + "%)";
		ctx.arc(circleArray[i].cx, circleArray[i].cy, circleArray[i].radius, 0, twoPI);
		ctx.fill();
	}
}

function averageRainbow(array) {
	return array.reduce(function(a, b){ return a + b; }) / array.length;
};

function initRainbowLine() {

	initCanvas();
	
	if (doType == 1) { rainbowHuman = true; rainbowWavesDraw = false; }
	else if (doType == 2) { rainbowHuman = false; rainbowWavesDraw = true; }
	else if (doType == 3) { rainbowHuman = true; rainbowWavesDraw = true; }
	else { rainbowHuman = false; rainbowWavesDraw = false; }

	// get the context from the canvas to draw on
	var svgWidth = canv.width;

	var svgHeight = 325;
	rainbowFirsttime = false;
	rainbowFirsttime2 = false;
	rainbowRadius = svgWidth / (rainbowNodes * 3 + 1);
	rainbowLeftOfs = rainbowRadius + rainbowRadius;
	rainbowInnerOfs = rainbowLeftOfs + rainbowRadius;
	rainbowFloor = svgHeight - rainbowRadius;
	rainbowWaveFloor = canv.height - rainbowRadius - 10;
	rainbowOfs = (rainbowFloor - 100 + rainbowRadius) / 256;
	var colorDelta = 360 / rainbowNodes;

	rainbowCircles.splice(0, rainbowCircles.length);
	rainbowWaves.splice(0, rainbowWaves.length);

	for (var nodeNum = 0; nodeNum < rainbowNodes; nodeNum++) {
		rainbowCircles.push(new baseCircle(nodeNum, nodeNum * colorDelta, rainbowFloor));
		rainbowWaves.push(new baseCircle(nodeNum, nodeNum * colorDelta, rainbowWaveFloor));
	}

	drawLineCircles(rainbowCircles);

	if (rainbowWavesDraw) {
		drawLineCircles(rainbowWaves);
	}
}



function updateRainbowLine(visArray, waveArray, beat)
{
	ctx.clearRect(0, 0, canv.width, canv.height);

	if (!rainbowFirsttime) {
		rainbowFirstvisArrayElem = analyser.fftSize / 2;
		rainbowLastvisArrayElem = 0;
		if (rainbowHuman) {
			rainbowInterpSize = context.sampleRate / analyser.fftSize;
			rainbowInterpSize = Math.floor(20000 / rainbowInterpSize) + 1;
			rainbowInterpSize = Math.floor(rainbowInterpSize / rainbowCircles.length) + 1;
		} else {
			rainbowInterpSize = visArray.length / rainbowCircles.length;
		}
		rainbowWaveInterpSize = waveArray.length / rainbowCircles.length;
		for(var i = 0; i < rainbowWaves.length; i++) {
			rainbowPriorValues.push(new Array());
		}
		rainbowFirsttime = true;
	}

	var interpStart = 0;
	var interpEnd = rainbowInterpSize;
	var value;
	var interpStartWave = 0;
	var interpEndWave = rainbowWaveInterpSize;
	var valueWave;

	for (var i = 0; i < rainbowCircles.length; i++) {
		value = 0;
		valueWave = 0;
		for (var j = interpStart; j < interpEnd; j++) {
			value += visArray[j];
			if (visArray[j] > 0) {
				if (j > rainbowLastvisArrayElem) rainbowLastvisArrayElem = j;
				if (j < rainbowFirstvisArrayElem) rainbowFirstvisArrayElem = j;
			}
		}
		value /= rainbowInterpSize;
		rainbowCircles[i].cy = rainbowFloor - (value * rainbowOfs);		
		for (var j = interpStartWave; j < interpEndWave; j++) {
			valueWave += waveArray[j];
		}
		valueWave /= rainbowWaveInterpSize;
		if(rainbowPriorValues[i].length > rainbowPeriod) rainbowPriorValues[i].shift();
		rainbowPriorValues[i].push(valueWave);
		valueWave = averageRainbow(rainbowPriorValues[i]);
		rainbowWaves[i].cy = rainbowWaveFloor - (valueWave * rainbowOfs);
		interpStart += rainbowInterpSize;
		interpEnd += rainbowInterpSize;
		interpStartWave += rainbowWaveInterpSize;
		interpEndWave += rainbowWaveInterpSize;
	}

	drawLineCircles(rainbowCircles);

	var svgHeight = rainbowFloor + rainbowRadius;

	if (rainbowWavesDraw) {
		drawLineCircles(rainbowWaves);
	}
}


function loadRainbowLine(type){
	initGraphics = initRainbowLine;
	updateGraphics = updateRainbowLine;
	doType = type;
	initSound();
}