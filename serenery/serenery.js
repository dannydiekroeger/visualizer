// My init function
// Notice: - no parameters taken
//         - refers to "canv" which refers to the element with
//           id "canvas" in sound.html
//         - refers to "ctx" which is defined in sound.js 

var maxAmp;
var imageData;
var newimageData;
var closestNotes;
var width;
var height;
var im;
var invert;
var opacityScale;
var imageNoteCounts;
var pixels;
var centX;
var centY;
function initScreen() {
	   	canv.setAttribute("width", window.innerWidth - 50);
	    canv.setAttribute("height", window.innerHeight-50);
	    canv.setAttribute("style", "background:black");
	    centX = canv.width/2.0;
	    centY = canv.width/4.0;
	    initKeyboard();
	    im = new Image();
		im.onload = imageLoaded;
		im.src = "images/frac1.jpg";
		canv.style.backgroundImage=im;
		opacityScale = 14;
		maxAmp = 1.0;
		invert = false;
		//imageData = ctx.getImageData(0,0,canv.width,canv.height);
}


function updateScreen(array) {
	//newimageData = ctx.getImageData(0,0,canv.width,canv.height);
	var amp = getTotalAmplitude(array);
	if(amp > maxAmp) maxAmp = amp;
	//bounceAlpha(amp);
	//averageHues(getMaxFreqBin(array));
	updateColorize(array);
	ctx.putImageData(imageData,0,0);
}

function averageHues(bin) {
	var scale = 2;
	var color = binNoteColor(bin);
    for (y = 0; y < height; y++) {
        inpos = y * width * 4; // *4 for 4 ints per pixel
        for (x = 0; x < width; x++) {
        	newimageData.data[inpos] = (color[0]+scale*imageData.data[inpos])/(scale+1);
        	inpos++;
        	newimageData.data[inpos] = (color[1]+scale*imageData.data[inpos])/(scale+1);
        	inpos++;
        	newimageData.data[inpos] = (color[2]+scale*imageData.data[inpos])/(scale+1);
        	inpos++;
        	inpos++;
        }
    }
	
}

function bounceAlpha(amp) {
	updateAlphas(amp/(maxAmp+0.0))
}


function updateColorize(array) {
	var noteTotals = getNoteTotals(array);
	//noteTotals = skewNoteTotals(noteTotals);
	var notePercents = getNotePercents(noteTotals);
	var thisNoteCounts = getNoteCounts(notePercents);
	
	//for (var y = 0; y < canv.height; y++) {
	//	var inpos = y * canv.width * 4; // *4 for 4 ints per pixel
	 //   for (var x = 0; x < canv.width; x++) {
	        	//imageData.data[inpos] = 255;
	  for(var i=0;i<pixels.length;i++) {
	  			/*
	        	r = imageData.data[inpos++];
	        	g = imageData.data[inpos++];
	        	b = imageData.data[inpos++];
	        	var note = closestNotes[inpos];
	        	*/
	        	//console.log(note);
	        	//console.log(noteTotals);
	        	//var noteAmp = noteTotals[note] + 0.0;
	        	var pixel = pixels[i];
	        	var inpos = pixel.index + 3;
	        	var note = pixel.note;
	        	// Fill effect
	        	
	        	if(thisNoteCounts[note] > 0) {
	        		imageData.data[inpos]=255;
	        		thisNoteCounts[note] = thisNoteCounts[note]-1;
	        	} else {
	        		imageData.data[inpos]=0;
	        	}
	        	
	        	
	        	
	        	
	        	//Random turn on here
	        	/*
	        	var percent = notePercents[note]
	        	if(Math.random() >percent*percent*percent) { // turn pixel off
	        		imageData.data[inpos] = 0;
	        	} else {
	        		imageData.data[inpos] = 255;
	        	}
	        	*/
	        	//console.log(percent);
	        	//var alphaVal = Math.min(255, 255*percent);
	        	//console.log(alphaVal);
	        	//imageData.data[inpos] = alphaVal;
	        	inpos++;
	  }
	  //  }
   	//}
}

function skewNoteTotals(noteTotals) {
	var note="a";
	for(var i=0;i<6;i++){
		total1 = noteTotals[note];
		total2 = noteTotals[getNextNote(note)];
		if(total1 > total2) {
			noteTotals[note] += noteTotals[getNextNote(note)]/1.1;
			noteTotals[getNextNote(note)] = noteTotals[getNextNote(note)]/1.1;
		} else {
			noteTotals[getNextNote(note)] += noteTotals[note]/1.1;
			noteTotals[note] = noteTotals[note]/1.1;
		}
	}
	return noteTotals;
}

function getNoteCounts(notePercents) {
	var thisNoteCounts = {"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0};
	var note = "a";
	for(var i=0;i<7;i++){
		thisNoteCounts[note] = notePercents[note]*imageNoteCounts[note];
		note = getNextNote(note);
	}
	return thisNoteCounts;
}

function getNotePercents(noteTotals){
	var note="a";
	var notePercents = new Object();
	for(var i=0; i<7; i++){
		notePercents[note] = (noteTotals[note]*opacityScale+0.0)/(maxAmp+0.0);
		note=getNextNote(note);
	}
	return notePercents;
}


function getNextNote(note) {
	if(note=="a")return "b";
	if(note=="b")return "c";
	if(note=="c")return "d";
	if(note=="d")return "e";
	if(note=="e")return "f";
	if(note=="f")return "g";
	return "a"; // note = g
}

function colorDistance(color1, color2) {
	return Math.abs(color1[0]-color2[0])+Math.abs(color1[1]-color2[1])+Math.abs(color1[2]-color2[2]);
}

function getNoteTotals(array) {
	var noteTotals = {"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0};
	for(var i=0;i<array.length;i++){
		var note = getNote(i);
		noteTotals[note] = noteTotals[note] + array[i];
	}
	//console.log(noteTotals);
	return noteTotals;
}

function updateAlphas(percent) {
	if(invert) percent = 1-percent;
	var alphaVal = percent*255;
    for (y = 0; y < height; y++) {
        inpos = y * width * 4; // *4 for 4 ints per pixel
        for (x = 0; x < width; x++) {
        	//imageData.data[inpos] = 255;
        	inpos += 3;
        	newimageData.data[inpos] = alphaVal;
        	inpos++;
        }
    }
}

function getClosestNote(color) {
	note="a";
	var closest;
	minDist = 255*10;
	for(i=0;i<7;i++){
		dist = colorDistance(color, getNoteColor(note));
		if(dist < minDist) {
			closest = note;
			minDist = dist;
		}
		note = getNextNote(note);
	}
	return closest;
}

function imageLoaded(ev) {
    im = ev.target; // the image

    // read the width and height of the canvas
    width = canv.width;
    height = canv.height;
    // stamp the image on the left of the canvas:
    ctx.drawImage(im, 0, 0);
    // get all canvas pixel data
    imageData = ctx.getImageData(0, 0, width, height);
    closestNotes = new Array();
    imageNoteCounts = {"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0};
    pixels = new Array();
    //ctx.putImageData(imageData, 0, 0);
    for (y = 0; y < height; y++) {
		inpos = y * width * 4; // *4 for 4 ints per pixel
	    for (x = 0; x < width; x++) {
	    		var index = inpos;
	        	var r = imageData.data[inpos++];
	        	var g = imageData.data[inpos++];
	        	var b = imageData.data[inpos++];
	        	var alpha = imageData.data[inpos];
	        	var note = getClosestNote([r,g,b]);
	        	var pixel = new Object();
	        	pixel.r = r;
	        	pixel.g = g;
	        	pixel.b = b;
	        	pixel.alpha = alpha;
	        	pixel.note = note;
	        	pixel.index = index;
	        	pixel.x = x;
	        	pixel.y = y;
	        	pixel.distanceFromCenter = getDistanceFromCenter(x,y);
	        	pixels[pixels.length] = pixel;
	        	closestNotes[inpos] = note
	        	imageNoteCounts[note] = imageNoteCounts[note]+1;
	        	inpos++;
	    }
   	}
   	//central sort
   	pixels.sort(function(a,b){return a.distanceFromCenter - b.distanceFromCenter});
}

function getDistanceFromCenter(x,y) {
	return Math.sqrt((x-centX)*(x-centX)+(y-centY)*(y-centY));
}

function initKeyboard() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		if(code == 49) goFullScreen(); // 1
		else if(code == 67) toggleCircle(); // C
		else if(code == 68) toggleDoubleBars(); // D
		else if(code == 70) toggleFluid();// F
		else if(code == 65) toggleColor(); // A
		else if(code == 90) toggleFlippedBars(); // Z
		else if(code == 77) toggleMiddleBars(); // M
		else if(code==190) lowerOpacityFactor(); // Period
		else if(code==191) increaseOpacityFactor(); // For. Slash
		else if(code >=37 && code <=40) catchArrowKey(code); // Arrow Keys
		else if(code==80) toggleBallDrop(); // P
	}
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

function goFullScreen(){
    var canvas = canv;
    if(canvas.requestFullScreen)
        canvas.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    else if(canvas.webkitRequestFullScreen)
        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    else if(canvas.mozRequestFullScreen)
        canvas.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
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
	var maxBin = getMaxFreqBin(array);
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

function binNoteColor(bin) {
	minNote = getNote(bin);
	return getNoteColor(minNote);
}

function getNoteColor(minNote) {
	if(minNote=='c') return [255,0,0];
	if(minNote=='d') return [255,125,0];
	if(minNote=='e') return [255,255,0];
	if(minNote=='f') return [0,255,0];
	if(minNote=='g') return [0,255,255];
	if(minNote=='a') return [0,0,255];
	return [255,0,255]; // b
}

function getNote(bin) {
	var c=12;
	var d=13.25;
	var e=15;
	var f=16;
	var g=9;
	var a=10;
	var b=11;
	minVal = bin%c;
	minNote = 'c';
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
	return minNote;

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
function lowerOpacityFactor() {
	if(opacityScale > 1) {
		opacityScale -= 1;
	}
}

function increaseOpacityFactor() {
	opacityScale++;
}