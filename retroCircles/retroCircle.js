/*********************************************
 *
 * Retro Circles World
 *
 * -------------------------------------------
 *
 * A collection of <numNode> circles,
 * represented by a outline. Radius of circle
 * demonstrates a segment's average of 
 * frequency amplitude. 
 *
 * Total amplitude and beat additional displays
 * are available.
 *
 * Colors were indiviually chosen to convey
 * the idea of 'retro'.
 *
 *********************************************/

//Predetermined colors for circles

var retroColor = [
	"#F09B0A", 
	"#F03060", 
	"#13613A", 
	"#805B37", 
	"#EBE18C", 
	"#DC3F1C", 
	"#448D7A", 
	"#D8A027", 
	"#88A764", 
	"#00515C", 
	"#FCFBB8", 
	"#B38235",
	"#A61407", 
	"#5B0400", 
	"#EDC218", 
	"#E30E1F"];

//circle variables

var numNodes = 16;
var retroFirsttime = 0;		// to use with debugging
var circleRadius = 0;
var retroCircleLineWidth = 10;
var twoPI = 2.0 * Math.PI;
var myCircles = new Array();
var canvCentX;
var canvCentY;

//beat circle variables

var retroBeatRadius = 50;
var retroBeatCX;
var retroBeatYX;
var retroBeatColor = "#E8D392";

//total amplitude gradient variables

var retroGrays = 16;	// shades of gray to calculate
var retroDoBox;
var retroBoxX;
var retroBoxY;
var retroBoxW = (256 + retroCircleLineWidth) * 2;
var retroBoxGradR = retroBoxW / 2;



/****************************************
 *
 * The load function for Retro.
 * Takes the type of features user wants
 * to include in variable type.
 *
 ***************************************/

function loadRetro(type) {
	initGraphics = initRetro;
	updateGraphics = drawRetro;
	retroDoBox = type;
	initSound();
}



/****************************************
 *
 * The init function for Retro.
 * sets up the variables and clears
 * myCircles array for new instance
 *
 ***************************************/

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
		var testColor = retroColor[nodeNum];

		myCircles.push(new baseCircleHex(nodeNum, testColor));
	}

	drawCircleLines();
}



/****************************************
 *
 * The update function for Retro.
 * Draw circles with radius representing
 * the frequency average of given range.
 * Additional features signified by 
 * retroDoBox calculated.
 *
 ***************************************/

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
		ctx.fillRect(retroBoxX, retroBoxY, retroBoxW, retroBoxW)
	}

	drawCircleLines();			
}




/****************************************
 *
 * Called by: initRetro
 *
 * Build a circle. 
 *
 ***************************************/

function baseCircleHex(pos, colorHex) {
	this.radius = circleRadius;
	this.cx = canvCentX;
	this.cy = canvCentY;
	this.color = colorHex;
	this.pos = pos;
}




/****************************************
 *
 * Called by: initRetro
 *	      drawRetro
 *
 * Draw the circles stored in myCircles.
 * Drawn using arcs to allow only the
 * outline of the circle.
 *
 ***************************************/

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




/****************************************
 *
 * Called by: drawRetro
 *
 * Draws beat circle when requested.
 * Similar logic to drawCircleLines.
 *
 ***************************************/

function drawRetroBeat(beat) {

	if (beat) {
		ctx.beginPath();
		ctx.fillStyle = retroBeatColor;
		ctx.arc(retroBeatCX, retroBeatCY, retroBeatRadius, 0, twoPI, false);
		ctx.fill();
	}
}




