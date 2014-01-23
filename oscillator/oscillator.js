// My init function
// Notice: - no parameters taken
//         - refers to "canv" which refers to the element with
//           id "canvas" in sound.html
//         - refers to "ctx" which is defined in sound.js 

var centX;
var centY;
var circle;
var fluid;
var accentPeaks;
var fill;
var space;
var barWidth;
var expandFactor;
var heightMult;
var gradient;
var numColors = 4;

function initScreen() {
	    canv.setAttribute("width", window.innerWidth - 50);
	    canv.setAttribute("height", window.innerHeight-50);
	    canv.setAttribute("style", "background:black");
		
		centX = 3*window.innerWidth/4;
		centY = window.innerHeight/4;
		centX = window.innerWidth/2;
		centY = window.innerHeight/3;
		//create gradient for the bins
		//gradient = ctx.createLinearGradient(0,0,0,canv.height);
		gradient = ctx.createRadialGradient(centX,centY,10,centX,centY,1000);
		gradient.addColorStop(1,'#000000'); //black
		gradient.addColorStop(0.3,'#ff0000'); //red
		gradient.addColorStop(.1,'#ffff00'); //yellow
		gradient.addColorStop(.05, 'rgb(0,255,0)');//green
		gradient.addColorStop(0,'#ffffff'); //white
		initConstants();

		circle = false;
		fluid = false;
		maxfluid = false;
		fill = 0;
		accentPeaks = true;
	
		//set new gradient as fill style
		ctx.fillStyle = gradient;
}
function updateScreen(array) {
	var amp=getTotalAmplitude(array);
	var maxScale = 95555;
	var percent = amp/maxScale;
	var maxRad = 300;
	var radius = maxRad*amp/maxScale;
	var color = getBinColor(getMaxFreqBin(array), array.length);
	ctx.fillStyle = color;
	if(circle) drawOneCircle(centX, centY, radius);
	if(fluid) drawSmoothBars(array);
	//if(accentPeaks) drawPeakAccent(array);
	if(maxfluid) drawMaxFluid(array);
	ctx.fill();
	
}

function initConstants(){
	space = 1;
	barWidth = 1;
	expandFactor = 10;
	heightMult = 2.5;
}

function drawPeakAccent(array) {
	var peakarray = detectPeaks(array);
	for(var i=0;i<peakarray.length;i++){
		var peak = peakarray[i];
		var xval = 5 + peak.bin* space*expandFactor;
		var yval = 100;
		var radius = 20;
		drawOneCircle(xval,yval,radius);
	}	
}

function drawMaxFluid(array) {
	var binsarray = getOrderedBins(array);
	var bin = binsarray[0];
	console.log(bin);
	var amp = array[bin];
	drawLinearBars(0,bin,0,amp,barWidth,space,heightMult);
	drawLinearBars(bin,array.length-1,amp,0,barWidth,space,heightMult);
	
}

function drawLinearBars(startBin, endBin, startAmp, endAmp,barWidth,space,heightMult) {
	var incr = (endAmp-startAmp)/(endBin-startBin);
	console.log(incr);
	for(var i=0;i<(endBin-startBin);i++){
		var value = startAmp+(i*incr);
		ctx.fillRect(5+(i+startBin)*(space+barWidth), canv.height - value*heightMult, barWidth, canv.height);
	}

}

function detectPeaks(array) {
	peakarray = new Array();
	for(var i=1;i<array.length-1;i++){
		if(array[i-1] < array[i] && array[i]>array[i+1]){
			peak = new Object();
			peak.bin = i;
			peak.value = array[i];
			peakarray[peakarray.length] = peak;
		}
	}
	return peakarray;
}

// a large amplitude is 7 figures
function getTotalAmplitude(array) {
	sum = 0;
	for(var i=0; i<array.length; i++){
		sum += array[i];
	}
	return sum;
}

//returns a sorted array of bin indices
//where first is bin with highest amplitude
function getOrderedBins(array) {
	var array2 = new Array();
	for(var i=0; i<array.length; i++){
		array2[i] = i;
	}
	array2.sort(function(a,b) {return array[b]-array[a]});
	return array2;
}

function goFullScreen(){
    var canvas = canv;
    if(canvas.requestFullScreen)
        canvas.requestFullScreen();
    else if(canvas.webkitRequestFullScreen)
        canvas.webkitRequestFullScreen();
    else if(canvas.mozRequestFullScreen)
        canvas.mozRequestFullScreen();
}

function drawOneCircle(x, y, radius) {
	ctx.beginPath();
	ctx.arc(x,y,radius,0,2*Math.PI);
	ctx.stroke();
}

function toggleColor() {
	if(fill == numColors-1) fill = 0;
	else fill++;
}


function toggleCircle() {
	if(circle) {
		circle = false;
	} else {
		circle = true;
	}
}

function toggleFluid() {
	if(fluid) {
		fluid = false;
	} else {
		fluid = true;
	}
}
// My update function
// Notice: takes in array as parameter
function drawSmoothBars(array) {

	//just show bins with a value over the treshold
	var threshold = 0;
	// clear the current state
	//ctx.clearRect(0, 20, canv.width, canv.height);
	//the max count of bins for the visualization
	var maxBinCount = array.length;
	//space between bins

	var maxBin = getMaxFreqBin(array);
	//set fill color to maxBin % 7
	//var color = getBinColor(maxBin, array.length);
	//gradient.addColorStop(.75, color);
	//go over each bin
	for ( var i = 0; i < maxBinCount-1; i++ ){
		var value = array[i];
		if (value >= threshold) {				

			//draw bin
			ctx.fillRect(5 + i * space *expandFactor, canv.height - value*heightMult, barWidth, canv.height);
			var nextVal = array[i+1];
			var diff = nextVal-value;
			var incr = diff/expandFactor;
			
			for (var j=1; j<expandFactor; j++){
				ctx.fillRect(5 + i * space*expandFactor + j, canv.height - (value+incr*j)*heightMult, barWidth, canv.height);
			}
		}
	}
}

function getBinColor(bin, numBins) {
	if(fill==0) {
		return gradient;
	}
	if(fill==1){
		return "rgb(0,255,255)";
	}
	if(fill==2) {
		var f = 7.73;
		var points = 255.0;
		numBins = 200;
		var percent = 100*bin/(numBins+0.0);
		//console.log(percent);
		var rval = points-(f*percent);
		//console.log(rval);
		var red = Math.max(rval,0);
		var blue = Math.max(points-(f*(100.0-percent)),0);
		var green = 255 - red - blue;
		//console.log(red);
		red = Math.round(red);
		green = Math.round(green);
		blue = Math.round(blue);
		var color = 'rgb('+red+','+green+','+blue+')';
		return color;
	}
	var num = bin%7;
	if(num ==0) return 'ff0000'
	if(num == 1) return 'rgb(127,127,0)';
	if(num == 2) return 'rgb(0,255,0)';
	if(num == 3) return 'rgb(0,127,127)';
	if(num == 4) return 'rgb(127,0,127)';
	if(num == 5) return 'rgb(100,100,100)';
	return 'rgb(0,0,255)';
}

function getMaxFreqBin(array) { 
	var maxBin;
	var maxVal=0;
	for ( var i = 0; i < array.length; i++ ){
		var value = array[i];
		if(value>maxVal) {
			maxBin = i;
			maxVal = value;
		}
	}
	return maxBin;
}