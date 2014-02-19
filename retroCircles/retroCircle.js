var newColor = ["#F09B0A", "#F03060", "#13613A", "#805B37", "#EBE18C", "#DC3F1C", "#448D7A", "#D8A027", "#88A764", "#00515C", "#FCFBB8", "#B38235","#A61407", "#5B0400", "#EDC218", "#E30E1F"];

var numNodes = 16;
var retroFirsttime = 0;		// to use with debugging
var circleRadius = 50;
var retroCircleLineWidth = 10;
var twoPI = 2.0 * Math.PI;
var myCircles = new Array();
var canvCentX;
var canvCentY;

var retroBeatRadius = 50;
var retroBeatCX;
var retroBeatYX;
var retroBeatColor = "#E8D392";

var retroGrays = 16;	// shades of gray to calculate
var retroDoBox;
var retroBoxX;
var retroBoxY;
var retroBoxW = (256 + retroCircleLineWidth) * 2;
//var retroBoxGradR = Math.sqrt((retroBoxW * retroBoxW) / 2);	// this value will create an obvious rectangle
var retroBoxGradR = retroBoxW / 2;

function baseCircleHex(pos, colorHex) {
	this.radius = circleRadius;
	this.cx = canvCentX;
	this.cy = canvCentY;
	this.color = colorHex;
	this.pos = pos;
}

function drawCircleLines() {
	ctx.lineWidth = retroCircleLineWidth;

	for (var i = 0; i < myCircles.length; i++)
	{
		ctx.beginPath();
		ctx.strokeStyle = myCircles[i].color;
		ctx.arc(myCircles[i].cx, myCircles[i].cy, myCircles[i].radius, 0, twoPI, false);
		ctx.stroke();
	}
}

function drawRetroBeat(beat) {

	if (beat) {
		ctx.beginPath();
		ctx.fillStyle = retroBeatColor;
		ctx.arc(retroBeatCX, retroBeatCY, retroBeatRadius, 0, twoPI, false);
		ctx.fill();
	}
}

function initRetro() {

	initCanvas();	

	canvCentX = canv.width / 2.0;
	canvCentY = canv.height / 2.0;
	retroBoxX = canvCentX - (retroBoxW / 2);
	retroBoxY = canvCentY - (retroBoxW / 2);
	retroBeatCX = canvCentX / 4;
	retroBeatCY = canvCentY;

	myCircles.splice(0, myCircles.length);

	for (var nodeNum = 0; nodeNum < numNodes; nodeNum++) {
		var testColor = newColor[nodeNum];

		myCircles.push(new baseCircleHex(nodeNum, testColor));
	}

	drawCircleLines();
}


function drawRetro(visArray, waveArray, beat)
{
//	ctx.clearRect(0, 0, canv.width, canv.height);
	var interpSize = visArray.length / myCircles.length;		
	var interpStart = 0;						
	var interpEnd = interpSize;					
	var value;
	var valueBox = 0;

	for (var i = 0; i < myCircles.length; i++) {
		value = 0;
		for (var j = interpStart; j < interpEnd; j++) {		
			value += visArray[j];				
		}
		valueBox += value;
		value /= interpSize;
		myCircles[i].radius = value;
		interpStart += interpSize;				
		interpEnd += interpSize;
	}

	if (retroDoBox == 0) {
		ctx.clearRect(0, 0, canv.width, canv.height);
	} else if (retroDoBox == 3) {
		ctx.clearRect(0, 0, canv.width, canv.height);
		drawRetroBeat(beat);
	} else {
		valueBox /= visArray.length;
		valueBox = Math.floor((valueBox + 1) / retroGrays) * retroGrays;
		if (retroDoBox == 1) {
			ctx.fillStyle = "rgb(" + valueBox + ", " + valueBox + ", " + valueBox + ")";
		} else {
			var grad = ctx.createRadialGradient(canvCentX, canvCentY, 0, canvCentX, canvCentY, retroBoxGradR);
			grad.addColorStop(0, "rgb(" + valueBox + ", " + valueBox + ", " + valueBox + ")");
			grad.addColorStop(1, "black");
			ctx.fillStyle = grad;
		}
		//ctx.fillRect(retroBoxX, retroBoxY, retroBoxW, retroBoxW)
		ctx.fillRect(0,0,canv.width,canv.height);
	}

	drawCircleLines();			
}


function loadRetro(type) {
	initGraphics = initRetro;
	updateGraphics = drawRetro;
	retroDoBox = type;
	initSound();
}
