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
var velo;

function initFlux() {
		var imsrc = "frac2.jpg";
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
		im.onload = imageLoadedFlux;
		im.src = imsrc
		

		//canv.style.backgroundImage=im;
		opacityScale = 10;
		maxAmp = 1.0;
		invert = false;
		velo = 1;
		
		
		//imageData = ctx.getImageData(0,0,canv.width,canv.height);
}

function loadFlux() {
	initGraphics = initFlux;
	updateGraphics = updateFlux;
	initSound();
}

function imageLoadedFlux(ev) {
    im = ev.target; // the image

    // read the width and height of the canvas
    width = canv.width;
    height = canv.height;
    // stamp the image on the left of the canvas:
    ctx.drawImage(im, 0, 0);
    // get all canvas pixel data
	initLiveAndDead();
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
	        	var note = getClosestNote([r,g,b]);
	        	var pixel = new Object();
	        	//pixel.r = r;
	        	//pixel.g = g;
	        	//pixel.b = b;
	        	//pixel.alpha = alpha;
	        	pixel.note = note;
	        	pixel.index = index;
	        	pixel.x = x;
	        	pixel.y = y;
	        	if(pixel.x>centX) {
	        		pixel.velocity = [5,0];
	        		pixel.hand = 1
	        	}
	        	else {
	        		pixel.velocity = [-5,0];
	        		pixel.hand = 0;
	        	}
	        	pixel.coord = getCoord(pixel);
	        	pixel.distanceFromCenter = getDistanceFromCenter(x,y);
	        	if(!isBlack(pixel)) {
	        		deadPixels.push(pixel);
	        		imageData.data[pixel.index+3] = 0;
	        	}
	        	inpos++;
	    }
   	}
   	initFluxPixels();
}

function calculateIndex(pixel) {
	return pixel.y*canv.width*4 + pixel.x*4;
}

function updateFlux(array, something, beat) {
	//if(livePixels.length > 1)console.log(livePixels[0].index);
	if(beat) velo += 100;
	updateFluxPixels();
	ctx.putImageData(imageData,0,0);
}

function updateFluxPixels() {
	var newLivePixels = new Array();
	//console.log(livePixels);
	for(var i=0;i<livePixels.length;i++){
		var pixel = livePixels[i];
		imageData.data[pixel.index+3]=0;
		var newPixel = moveStep(pixel);
		newPixel.velocity = getVelocity(newPixel);
		newLivePixels.push(newPixel);
		imageData.data[pixel.index+3]=255;
	}
	livePixels = newLivePixels;
}

function getVelocity(pixel) {
	var scale = 50;
	//return [Math.log(pixel.coord["x"])/Math.log(1000), Math.log(pixel.coord["y"])/Math.log(1000)];
	if(velo > 15) velo-=15;
	if(pixel.hand == 1) return [velo,0];
	return[-velo,0];
}


function initFluxPixels() {
	var numpix =30000;
	addRandomPixelsFlux(numpix)
}

function getCoord(pixel) {
	var xval = pixel.x-centX;
	var yval = pixel.y-centY;
	return {"x":xval, "y":yval};
}

// returns new pixel one step away accord. to pixel's velocity
function moveStep(pixel) {
	var spawnRad = 40;
	pixel.x += pixel.velocity[0];
	pixel.y += pixel.velocity[1];
	if(outOfBounds(pixel)) {
		//pixel.x = randomVal(0,canv.width);
		//pixel.y = randomVal(0,canv.height);
		pixel.x -= pixel.velocity[0];
		pixel.y -= pixel.velocity[1];
		pixel.velocity[0] = (-1)*pixel.velocity[0];
		pixel.velocity[1] = (-1)*pixel.velocity[1];
	}
	pixel.coord = getCoord(pixel);
	pixel.index = calculateIndex(pixel);
	return pixel;
}

function randomVal(min,max){
	return Math.floor(Math.random()*(max-min)+min);
}

function outOfBounds(pixel) {
	return pixel.x > canv.width || pixel.x <0 || pixel.y < 0 || pixel.y > canv.height;
}

function updateRandomPixelsFlux(array) {
	var noteTotals = getNoteTotals(array);
	//noteTotals = skewNoteTotals(noteTotals);
	var notePercents = getNotePercents(noteTotals);
	var thisNoteCounts = getNoteCounts(notePercents);
	//console.log(thisNoteCounts);
	var note = "a";
	for(var i=0;i<7;i++) {
		var diff = thisNoteCounts[note] - oldNoteCounts[note];
		if(diff > 0) addPixels(diff, note);
		else if(diff<0) removePixels((-1)*diff,note);
		note = getNextNote(note);
	}
	oldNoteCounts = thisNoteCounts;
}


function addRandomPixelsFlux(num) {
	for(var i=0;i<num;i++){
		var index = Math.floor(Math.random()*deadPixels.length);
		var pixel = deadPixels[index];
		var lastPixel = deadPixels[deadPixels.length-1];
		deadPixels[index] = lastPixel;
		deadPixels.pop();
		if(pixel) {
			livePixels.push(pixel);
			imageData.data[pixel.index+3] = 255;
		}	
	}
}

function removeRandomPixels(num, note) {
	for(var i=0;i<num;i++){
		var index = Math.floor(Math.random()*livePixels.length);
		var pixel = livePixels[index];
		var lastPixel = livePixels[livePixels.length-1];
		livePixels[index] = lastPixel;
		livePixels.pop();
		if(pixel) {
			deadPixels.push(pixel);
			imageData.data[pixel.index+3] = 0;
		}
	}
}


function colorDistance(color1, color2) {
	return Math.abs(color1[0]-color2[0])+Math.abs(color1[1]-color2[1])+Math.abs(color1[2]-color2[2]);
}


function isBlack(pixel) {
	return pixel.r==255 && pixel.g == 255 && pixel.b==255;
}

function initLiveAndDead() {
	livePixels = new Array();
	deadPixels = new Array();
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