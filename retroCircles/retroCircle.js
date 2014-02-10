var RetroCircleColor = ["#F09B0A", "#F03060", "#13613A", "#805B37", "#EBE18C", "#DC3F1C", "#448D7A", "#D8A027", "#88A764", "#00515C", "#FCFBB8", "#B38235","#A61407", "#5B0400", "#EDC218", "#E30E1F"];

var RetroNumNodes = 16;
var RetroCircleRadius = 50;
var twoPI = 2.0 * Math.PI;
var RetroCircles = new Array();
var RetroCanvCentX;
var RetroCanvCentY;




function RetroBaseCircleHex(pos, colorHex) {
	this.radius = RetroCircleRadius;
	this.cx = RetroCanvCentX;
	this.cy = RetroCanvCentY;
	this.color = colorHex;
	this.pos = pos;
}

function RetroDrawCircle() {
	for (var i = 0; i < RetroCircles.length; i++)
	{
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.strokeStyle = RetroCircles[i].color;
		ctx.arc(RetroCircles[i].cx, RetroCircles[i].cy, RetroCircles[i].radius, 0, twoPI, false);
		ctx.stroke();
		
	}
}


function initRetro() {

	initCanvas();	

	RetroCanvCentX = canv.width / 2.0;
	RetroCanvCentY = canv.height / 2.0;


	for (var nodeNum = 0; nodeNum < RetroNumNodes; nodeNum++) {
		var testColor = RetroCircleColor[nodeNum];

		RetroCircles.push(new RetroBaseCircleHex(nodeNum, testColor));
	}

	RetroDrawCircle();
}


function drawRetro(visArray, waveArray, beat)
{
	ctx.clearRect(0, 20, canv.width, canv.height);
	var interpSize = visArray.length / RetroCircles.length;		
	var interpStart = 0;						
	var interpEnd = interpSize;					
	var value;
	for (var i = 0; i < RetroCircles.length; i++) {
		value = 0;
		for (var j = interpStart; j < interpEnd; j++) {		
			value += visArray[j];				
		}
		value /= interpSize;		
		RetroCircles[i].radius = value;
		interpStart += interpSize;				
		interpEnd += interpSize;
	}
	RetroDrawCircle();			
}


function loadRetro() {
	initGraphics = initRetro;
	updateGraphics = drawRetro;
	initSound();
}