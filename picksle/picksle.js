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
var pixels;
var centX;
var centY;
var imageDataArray;
var livePixels;
var deadPixels;
var oldNoteCounts;
var binwidth;
var maxBinAmp;
var prevArray;
var pixPerBin;
var arrayUsage;

function initPicksle() {
		var imsrc = "everest.jpg";
		try {
			initCanvas();
			imsrc = "../serenery/images/"+imsrc;
		}
		catch(err){
		   	canv.setAttribute("width", window.innerWidth - 50);
		    canv.setAttribute("height", window.innerHeight-50);
		    canv.setAttribute("style", "background:black");
		    imsrc = "images/"+imsrc;
		}
	    centX = canv.width/2.0;
	    centY = canv.height/2.0;
	    initKeyboard();
	    im = new Image();
		im.onload = imageLoadedP;
		im.src = imsrc
		
		arrayUsage = 600;
		binwidth = Math.floor(canv.width/arrayUsage);
		pixPerBin = binwidth*canv.height;
		//canv.style.backgroundImage=im;
		opacityScale = 10;
		maxAmp = 1.0;
		maxBinAmp = 1.0;
		invert = false;
		initPrevArray();
		
		//imageData = ctx.getImageData(0,0,canv.width,canv.height);
}

function loadPicksle() {
	initGraphics = initPicksle;
	updateGraphics = updatePicksle;
	initSound();
}

function imageLoadedP(ev) {
    im = ev.target; // the image

    // read the width and height of the canvas
    width = canv.width;
    height = canv.height;
    // stamp the image on the left of the canvas:
    ctx.drawImage(im, 0, 0);
    // get all canvas pixel data
	initPixelBins();
    imageData = ctx.getImageData(0, 0, width, height);
    //ctx.putImageData(imageData, 0, 0);
    for (y = 0; y < height; y++) {
		inpos = y * width * 4; // *4 for 4 ints per pixel
	    for (x = 0; x < width; x++) {
	    		var index = inpos;
	        	var r = imageData.data[inpos++];
	        	var g = imageData.data[inpos++];
	        	var b = imageData.data[inpos++];
	        	var alpha = imageData.data[inpos];
	        	var note = "none"
	        	var pixel = new Object();
	        	pixel.note = note;
	        	pixel.index = index;
	        	pixel.x = x;
	        	pixel.y = y;
	        	pixel.coord = getCoord(pixel);
	        	pixel.distanceFromCenter = getDistanceFromCenter(x,y);
	        	var arrayIndex = Math.floor(Math.min(x/binwidth,arrayUsage-1));
	        	deadPixels[arrayIndex].push(pixel);
	        	imageData.data[pixel.index+3] = 0;
	        	inpos++;
	    }
   	}
}

function initPrevArray(){
	prevArray = new Array();
	for(var i=0;i<1024;i++){
		prevArray[i]=0;
	}
}

function calculateIndex(pixel) {
	return pixel.y*canv.width*4 + pixel.x*4;
}

function updatePicksle(array) {
	var thismax = getMaxBinAmp(array);
	if(thismax) maxBinAmp = Math.max(maxBinAmp,thismax);
	updatePixels(array);
	ctx.putImageData(imageData,0,0);
	prevArray = array;
}

function updatePixels(array) {
	for(var i=0;i<arrayUsage;i++){
		var diff = array[i]-prevArray[i];
		if(diff>0) {
			addRandomPixels(i,diff);
		} else if(diff<0){
			removeRandomPixels(i, (-1)*diff);
		}
	}
}


function addRandomPixels(bin, val) {
	var numPix = (val+0.0)/(maxBinAmp+0.0)*pixPerBin;
	for(var i=0;i<numPix;i++){
		var index = Math.floor(Math.random()*(deadPixels[bin].length));
		var pixel = deadPixels[bin][index];
		var lastPixel = deadPixels[bin][deadPixels[bin].length-1];
		if(pixel) {
			deadPixels[bin][index] = lastPixel;
			deadPixels[bin].pop();
			livePixels[bin].push(pixel);
			imageData.data[pixel.index+3] = 255;
		}
	}
}

function removeRandomPixels(bin, value) {
	var numPix = (value+0.0)/(maxBinAmp+0.0)*pixPerBin;
	for(var i=0;i<numPix;i++){
		var len = livePixels[bin].length;
		var index = Math.floor(Math.random()*(livePixels[bin].length));
		var pixel = livePixels[bin][index];
		var lastPixel = livePixels[bin][livePixels[bin].length-1];
		if(pixel) {
			livePixels[bin][index] = lastPixel;
			livePixels[bin].pop();
			deadPixels[bin].push(pixel);
			imageData.data[pixel.index+3] = 0;
		}
	}
}

function getCoord(pixel) {
	var xval = pixel.x-centX;
	var yval = pixel.y-centY;
	return {"x":xval, "y":yval};
}

function randomVal(min,max){
	return Math.floor(Math.random()*(max-min)+min);
}

function outOfBounds(pixel) {
	return pixel.x > canv.width || pixel.x <0 || pixel.y < 0 || pixel.y > canv.height;
}


function bounceAlpha(amp) {
	updateAlphas(amp/(maxAmp+0.0))
}

function colorDistance(color1, color2) {
	return Math.abs(color1[0]-color2[0])+Math.abs(color1[1]-color2[1])+Math.abs(color1[2]-color2[2]);
}

function isBlack(pixel) {
	return pixel.r==255 && pixel.g == 255 && pixel.b==255;
}

function initPixelBins() {
	livePixels = new Array();
	deadPixels = new Array();
	for(var x=0;x<arrayUsage;x++){
		livePixels[x] = new Array();
		deadPixels[x] = new Array();
	}
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

function getMaxBinAmp(array) {
	return array[getMaxFreqBin(array)];
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