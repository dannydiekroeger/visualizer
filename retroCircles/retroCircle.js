//var newColor = ["#097487", "#EDC218", "#E30E1F", "#E8D392"];

var newColor = ["#F09B0A", "#F03060", "#13613A", "#805B37", "#EBE18C", "#DC3F1C", "#448D7A", "#D8A027", "#88A764", "#00515C", "#FCFBB8", "#B38235","#A61407", "#5B0400", "#EDC218", "#E30E1F"];

//var numNodes = 4;
var numNodes = 16;
var firsttime = 0;
var circleRadius = 50;
var leftOfs;
var innerOfs;
var hFloor;
var hOfs;
var twoPI = 2.0 * Math.PI;
var myCircles = new Array();
var canvCentX;
var canvCentY;




function baseCircleHex(pos, colorHex) {
	this.radius = circleRadius;
	this.cx = canvCentX;
	this.cy = canvCentY;
	this.color = colorHex;
	this.pos = pos;
}

function drawCircleLines() {
	for (var i = 0; i < myCircles.length; i++)
	{
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.strokeStyle = myCircles[i].color;
		ctx.arc(myCircles[i].cx, myCircles[i].cy, myCircles[i].radius, 0, twoPI, false);
		ctx.stroke();
		
	}
}


function initRetro() {

	initCanvas();	

	canvCentX = canv.width / 2.0;
	canvCentY = canv.height / 2.0;


	for (var nodeNum = 0; nodeNum < numNodes; nodeNum++) {
		var testColor = newColor[nodeNum];

		myCircles.push(new baseCircleHex(nodeNum, testColor));
	}

	drawCircleLines();
}


function drawRetro(visArray)
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
		myCircles[i].radius = value;
		interpStart += interpSize;				
		interpEnd += interpSize;
	}
	drawCircleLines();			
}


function loadRetro() {
	initGraphics = initRetro;
	updateGraphics = drawRetro;
	initSound();
}