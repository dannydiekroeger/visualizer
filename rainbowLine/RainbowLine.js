var rainbowNodes = 64;
var firsttime = 0;
var rainbowRadius;
var rainbowLeftOfs;
var rainbowInnerOfs;
var rainbowFloor;
var rainbowOfs;
var twoPI = 2.0 * Math.PI;
var rainbowCircles = new Array();

// Constructor function to build a circle structure

function baseCircle(pos, colorH) {
	this.radius = rainbowRadius;
	this.cx = rainbowLeftOfs + (rainbowInnerOfs * pos);
	this.cy = rainbowFloor;
	this.colorH = colorH;
	this.colorS = 50;
	this.colorL = 50;
	this.pos = pos;
}

function drawLineCircles() {
	for (var i = 0; i < rainbowCircles.length; i++)
	{
		ctx.beginPath();
		ctx.fillStyle = "hsl(" + rainbowCircles[i].colorH + ", " + rainbowCircles[i].colorS + "%, " + rainbowCircles[i].colorL + "%)";
		ctx.arc(rainbowCircles[i].cx, rainbowCircles[i].cy, rainbowCircles[i].radius, 0, twoPI);
		ctx.fill();
	}
}


function initRainbowLine() {

	initCanvas();

	// get the context from the canvas to draw on
	var svgWidth = canv.width;

	var svgHeight = 325;


	rainbowRadius = svgWidth / (rainbowNodes * 3 + 1);
	rainbowLeftOfs = rainbowRadius + rainbowRadius;
	rainbowInnerOfs = rainbowLeftOfs + rainbowRadius;
	rainbowFloor = svgHeight - rainbowRadius;
	rainbowOfs = (rainbowFloor - 100 + rainbowRadius) / 256;
	var colorDelta = 360 / rainbowNodes;

	rainbowCircles.splice(0, rainbowCircles.length);

	for (var nodeNum = 0; nodeNum < rainbowNodes; nodeNum++) {
		rainbowCircles.push(new baseCircle(nodeNum, nodeNum * colorDelta));
	}
	drawLineCircles();
}



function updateRainbowLine(visArray, waveArray, beat)
{
	ctx.clearRect(0, 0, canv.width, canv.height);
	var interpSize = visArray.length / rainbowCircles.length;		
	var interpStart = 0;						
	var interpEnd = interpSize;					
	var value;
	for (var i = 0; i < rainbowCircles.length; i++) {
		value = 0;
		for (var j = interpStart; j < interpEnd; j++) {		
			value += visArray[j];				
		}
		value /= interpSize;
		rainbowCircles[i].cy = rainbowFloor - (value * rainbowOfs);		
		interpStart += interpSize;				
		interpEnd += interpSize;
	}
	drawLineCircles();					
}


function loadRainbowLine(){
	initGraphics = initRainbowLine;
	updateGraphics = updateRainbowLine;
	initSound();
}