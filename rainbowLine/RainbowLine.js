
var numNodes = 64;
var firsttime = 0;
var circleRadius;
var leftOfs;
var innerOfs;
var hFloor;
var hOfs;
var twoPI = 2.0 * Math.PI;
var myCircles = new Array();

// Constructor function to build a circle structure

function baseCircle(pos, colorH) {
	this.radius = circleRadius;
	this.cx = leftOfs + (innerOfs * pos);
	this.cy = hFloor;
	this.colorH = colorH;
	this.colorS = 50;
	this.colorL = 50;
	this.pos = pos;
}

function drawLineCircles() {
	for (var i = 0; i < myCircles.length; i++)
	{
		ctx.beginPath();
		ctx.fillStyle = "hsl(" + myCircles[i].colorH + ", " + myCircles[i].colorS + "%, " + myCircles[i].colorL + "%)";
		ctx.arc(myCircles[i].cx, myCircles[i].cy, myCircles[i].radius, 0, twoPI);
		ctx.fill();
	}
}


function initRainbowLine() {

	initCanvas();

	// get the context from the canvas to draw on
	var svgWidth = window.innerWidth - 50;

	var svgHeight = 325;


	circleRadius = svgWidth / (numNodes * 3 + 1);
	leftOfs = circleRadius + circleRadius;
	innerOfs = leftOfs + circleRadius;
	hFloor = svgHeight - circleRadius;
	hOfs = (hFloor - 100 + circleRadius) / 256;
	var colorDelta = 360 / numNodes;

	for (var nodeNum = 0; nodeNum < numNodes; nodeNum++) {
		myCircles.push(new baseCircle(nodeNum, nodeNum * colorDelta));
	}
	drawLineCircles();
}



function updateRainbowLine(visArray)
{
	ctx.clearRect(0, 20, canv.width, canv.height);
	var interpSize = visArray.length / myCircles.length;		
	var interpStart = 0;						
	var interpEnd = interpSize;					
	var value;
	for (var i = 0; i < myCircles.length; i++) {
		value = 0;
		for (var j = interpStart; j < interpEnd; j++) {		
			value += visArray[j];				
		}
		value /= interpSize;
		myCircles[i].cy = hFloor - (value * hOfs);		
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