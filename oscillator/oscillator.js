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
var flippedBars;
var doubleBars;
var middleBars;
var numColors = 4;
var ballDrop;
var ballDropVelocity;
var circleRotateStart;
var backgroundImage;
var backgroundPattern;
var sideFluid;

function initScreenOsc() {
		try {
			initCanvas();
		}
		catch(err){
		   	canv.setAttribute("width", window.innerWidth - 50);
		    canv.setAttribute("height", window.innerHeight-50);
		    canv.setAttribute("style", "background:black");
		}
		
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
		fluid = true;
		maxfluid = false;
		fill = 0;
		accentPeaks = true;
		flippedBars = true;
		doubleBars = false;
		middleBars = false;
		ballDrop = false;
		sideFluid = true;
		circleRotateStart = 0;
		initKeyboardOsc();
		//set new gradient as fill style
		
		ctx.fillStyle = gradient;
}

function updateScreenOsc(array) {
	array = convertArray(array);
	var amp=getTotalAmplitude(array);
	var maxScale = 95555;
	var percent = amp/maxScale;
	var maxRad = 150*heightMult;
	var radius = maxRad*amp/maxScale;
	var maxFreqBin = getMaxFreqBinOsc(array);
	var color = getBinColor(maxFreqBin, array.length);
	//logPeaks(detectPeaks(array),5);
	//var color = binNoteColorOsc(maxFreqBin);
	//canv.setAttribute("style","background:"+color);
	//console.log(maxFreqBin);
	//ctx.fillStyle = backgroundPattern;
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	ctx.fillStyle = color;
	if(ballDrop) updateBallDrop();
	if(circle) drawOneCircle(centX, centY, radius);
	if(fluid) drawSmoothBars(array);
	if(sideFluid) {
		drawLeftBars(array.slice(array.length/2,3*array.length/4));
		drawRightBars(array.slice(array.length/2,3*array.length/4));
	}
	//if(accentPeaks) drawPeakAccent(array);
	if(maxfluid) drawMaxFluid(array);
	
	ctx.fill();
	
}

function initKeyboardOsc() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		implementMainKeyboardKeys(code);
		if(code == 67) toggleCircle(); // C
		else if(code == 68) toggleDoubleBars(); // D
		else if(code == 70) toggleFluid();// F
		else if(code == 65) toggleColor(); // A
		else if(code == 90) toggleFlippedBars(); // Z
		else if(code == 77) toggleMiddleBars(); // M
		else if(code==190) lowerExpandFactor(); // Period
		else if(code==191) increaseExpandFactor(); // For. Slash
		else if(code==75) lowerRiseFactor(); // K
		else if(code==76) increaseRiseFactor(); // L
		else if(code >=37 && code <=40) catchArrowKey(code); // Arrow Keys
		else if(code==80) toggleBallDrop(); // P
		else if(code==83) toggleSideFluid(); // P
	}
}

function loadOscillator() {
	initGraphics = initScreenOsc;
	updateGraphics = updateScreenOsc;
	setupControlPanelOsc();
	initSound();
	//alert("Hot Keys are F,Z,D,M,A,S,'Period','Backslash',K,L,P,C \n Try them out!");
}

function setupControlPanelOsc() {
	document.getElementById("controlPanelHeader").innerHTML="Oscillator";
	document.getElementById("controlPanelMessage").innerHTML="Key Commands: <br><br> A: change color scheme <br> F: toggle fluid <br> S: toggle side fluid <br> . (period): squash fluid <br> / (slash): expand fluid <br> Z: flip fluid <br> D: double fluid <br> M: middle fluid <br> K: decrease amplitude <br> L: increase amplitude <br> C: toggle circle <br> Arrow Keys: move circle <br> P: drop circle";
}

function convertArray(array) {
	newArray = new Array();
	for(var i=0;i<array.length;i++){
		newArray[i] = array[i];
	}
	return newArray;
}

function logPeaks(peakarray, num) {
	var str = ""
	for(var i=0; i< peakarray.length && i<num; i++){
		str = str + peakarray[i].bin + ", ";
	}
	console.log(str);
}




function catchArrowKey(code) {
	var scale = 20;
	if(code == 37) centX -= scale;
	else if(code == 38) centY -= scale;
	else if(code==39) centX += scale;
	else centY += scale;
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
	//console.log(bin);
	var amp = array[bin];
	maxbin = (canv.width-5)/(space*expandFactor)
	drawLinearBars(0,bin,0,amp,barWidth,space,heightMult);
	drawLinearBars(bin,maxbin,amp,0,barWidth,space,heightMult);
	
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
function toggleSideFluid() {
	if(sideFluid) {
		sideFluid = false;
	} else {
		sideFluid = true;
	}
}

function toggleFlippedBars() {
	if(flippedBars) {
		flippedBars = false;
	} else {
		flippedBars = true;
	}
}

function toggleDoubleBars() {
	if(doubleBars) {
		doubleBars = false;
	} else {
		doubleBars = true;
	}
}

function toggleMiddleBars() {
	if(middleBars) {
		middleBars = false;
	} else {
		middleBars = true;
	}	
}

function toggleFluid() {
	if(fluid) {
		fluid = false;
	} else {
		fluid = true;
	}
}

function toggleBallDrop() {
	if(ballDrop) ballDrop = false;
	else {
		ballDrop = true;
		ballDropVelocity = 0;
	}
}

function updateBallDrop() {
	var dropFactor = .3;
	if(centY >= canv.height) {
		ballDrop = false;
		ballDropVelocity = 0;
		if(fluid && !flippedBars) {
			doubleBars = true;
		} else {
			flippedBars = true;
			fluid = true;
		}
	} else {
		centY += ballDropVelocity;
		ballDropVelocity += dropFactor;
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
	var yval = 0;
	var maxBin = getMaxFreqBinOsc(array);
	//set fill color to maxBin % 7
	//var color = getBinColor(maxBin, array.length);
	//gradient.addColorStop(.75, color);
	//go over each bin
	//expandFactor = 3*(canv.width-5)/(maxBinCount*space);
	//expandFactor = 10;
	if(middleBars) {
		helpDrawBars(array, maxBinCount, threshold,yval,expandFactor);
	} else {
		helpDrawBars(array, maxBinCount, threshold,yval,expandFactor);
		if(doubleBars) {
			toggleFlippedBars();
			helpDrawBars(array, maxBinCount, threshold,yval,expandFactor);
			toggleFlippedBars();
		}
	}
}

function helpDrawBars(array, maxBinCount, threshold, yval, expandFactor) {
	for ( var i = 0; i < maxBinCount-1; i++ ){
		var value = array[i];
		if (value >= threshold) {				

			//draw bin
			if(middleBars) {
				yval = canv.height/2 - value*heightMult/2;
			} else if(flippedBars) {
				yval = canv.height-value*heightMult;
			}
			var xval = 5 + i * space *expandFactor;
			if(xval <= canv.width) {
				ctx.fillRect(xval, yval, barWidth, value*heightMult);
				var nextVal = array[i+1];
				var diff = nextVal-value;
				var incr = diff/expandFactor;
				
				for (var j=1; j<expandFactor; j++){
					if(middleBars) yval = canv.height/2 - (value+incr*j)*heightMult/2
					else if(flippedBars) yval = canv.height - (value+incr*j)*heightMult;
					ctx.fillRect(5 + i * space*expandFactor + j, yval, barWidth, (value+incr*j)*heightMult);
				}
			}
		}
	}
}

function binNoteColorOsc(bin) {
	var c=12;
	var d=13.25;
	var e=15;
	var f=16;
	var g=9;
	var a=10;
	var b=11;
	var minVal = bin%c;
	var minNote = 'c';
	if(bin%d<minVal) {
		minVal = bin%d;
		minNote = 'd';
	}
	if(bin%e<minVal) {
		minVal = bin%e;
		minNote = 'e';
	}
	if(bin%f<minVal) {
		minVal = bin%f;
		minNote = 'f';
	}
	if(bin%g<minVal) {
		minVal = bin%g;
		minNote = 'g';
	}
	if(bin%a<minVal) {
		minVal = bin%a;
		minNote = 'a';
	}
	if(bin%b<minVal) {
		minVal = bin%b;
		minNote = 'b';
	}
	if(bin%d<minVal) {
		minVal = bin%d;
		minNote = 'd';
	}
	if(minNote=='c') return "rgb(255,0,0)";
	if(minNote=='d') return "rgb(255,125,0)";
	if(minNote=='e') return "rgb(255,255,0)";
	if(minNote=='f') return "rgb(0,255,0)";
	if(minNote=='g') return "rgb(0,255,255)";
	if(minNote=='a') return "rgb(0,0,255)";
	if(minNote=='b') return "rgb(255,0,255)";
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
	return binNoteColorOsc(bin);
	/*
	var num = bin%7;
	if(num ==0) return 'ff0000'
	if(num == 1) return 'rgb(127,127,0)';
	if(num == 2) return 'rgb(0,255,0)';
	if(num == 3) return 'rgb(0,127,127)';
	if(num == 4) return 'rgb(127,0,127)';
	if(num == 5) return 'rgb(100,100,100)';
	return 'rgb(0,0,255)';
	*/
}

function getMaxFreqBinOsc(array) { 
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
function lowerExpandFactor() {
	if(expandFactor > 2) {
		expandFactor -= 1;
	}
}

function increaseExpandFactor() {
	expandFactor++;
}
function lowerRiseFactor() {
	if(heightMult > .1) {
		heightMult -= .1;
	}
}

function drawLeftBars(array) {
	var expand = (canv.height+0.0)/array.length;
	for(var i=0;i<array.length;i++){
		var value = array[i];
		var xval = 5;
		var yval = i*expand;
		if(yval <= canv.height) {
			ctx.fillRect(xval, yval, value*heightMult, barWidth);
			var nextVal = array[i+1];
			var diff = nextVal-value;
			var incr = diff/expand;
				
			for (var j=1; j<expand; j++){
				ctx.fillRect(xval, yval+j,(value+incr*j)*heightMult, barWidth);
			}
		}
		
	}
}
function goFullScreen(){
    var canvas = canv;
    if(canvas.requestFullScreen) {
        canvas.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    else if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    else if(canvas.mozRequestFullScreen)
        canvas.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
}

function drawRightBars(array) {
	var expand = (canv.height+0.0)/array.length;
	for(var i=0;i<array.length;i++){
		var value = array[i];
		var xval = canv.width-value*heightMult;
		var yval = i*expand;
		if(yval <= canv.height) {
			ctx.fillRect(xval, yval, value*heightMult, barWidth);
			var nextVal = array[i+1];
			var diff = nextVal-value;
			var incr = diff/expand;
				
			for (var j=1; j<expand; j++){
				ctx.fillRect(xval, yval+j,(value+incr*j)*heightMult, barWidth);
			}
		}
		
	}
}

function increaseRiseFactor() {
	heightMult += .1;
}