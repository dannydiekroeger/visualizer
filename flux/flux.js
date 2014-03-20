/*
flux.js

Implements the Flux world. Called from sound.js
Uses helper functions from serenery.js and picksle.js
*/

var fluxMaxAmp;
var fluxPixels;
var fluxImageData;
var newfluxImageData;
var width;
var height;
var invert;
var opacityScale;
var fluxCentX;
var fluxCentY;
var fluxImageDataArray;
var fluxLivePixels;
var fluxDeadPixels;
var oldNoteCounts;
var velo;
var fluxgravity;
var fluxheightscale;
var fluxRadialGrav;
var fluxRotationTheta;
var fluxradscale;
var fluxRotation;
var fluxRadius;
var fluxRandMiddle;
var fluxArrayOffset;
var fluxUpdatePixels;
var fluxUpdatePixelsVal;
var fluxToggle;
var fluxArrayUsage;
var fluxBinwidth;
var fluxPixPerBin;
var fluxMaxBinAmp;
var fluxNumPix;

function initFlux() {
		try {
			initCanvas();
		}
		catch(err){
		   	canv.setAttribute("width", window.innerWidth - 50);
		    canv.setAttribute("height", window.innerHeight-50);
		    canv.setAttribute("style", "background:black");
		    imsrc = "images/"+imsrc;
		}
		
	    fluxCentX = canv.width/2.0;
	    fluxCentY = canv.height/2.0;
	    fluxInitKeyboard();
	    centX = canv.width/2.0;
	    centY = canv.width/4.0;
		fluxRandMiddle = false;
		fluxArrayOffset = 100;
		fluxUpdatePixels = updateFluxPixels;
		fluxUpdatePixelsVal = 0;
		opacityScale = 5;
		fluxMaxAmp = 1.0;
		invert = false;
		velo = 1;
		fluxgravity = 1;
		fluxRadialGrav = 2;
		fluxheightscale = 10;
		fluxradscale = 10;
		fluxRotationTheta = .02;
		fluxRotation = .01;
		fluxRadius = 100;
		accentuate = true;
}


function loadFluxImage() {
	if(fluxImsrc != "capture") {
		var fluxim = new Image();
		fluxim.onload = imageLoadedFlux;
		fluxim.src = fluxImsrc;
	}
	fluxCentX = canv.width/2.0;
	fluxCentY = canv.height/2.0;
	centX = canv.width/2.0;
	centY = canv.width/4.0;
	imageNoteCounts = {"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0};
	closestNotes = new Array();
	oldNoteCounts = {"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0};
	fluxPixels = new Array();
	fluxArrayUsage = 600.0;
	fluxBinwidth = (canv.height+0.0)/fluxArrayUsage;
	fluxPixPerBin = fluxBinwidth*canv.width;
	opacityScale = 5;
	fluxMaxAmp = 1.0;
	fluxMaxBinAmp = 1.0;
	initPrevArrayP();
	fluxNumPix =10000;
	if(fluxImsrc == "capture") {
		var ev = new Object();
		ev.target = "none";
		imageLoadedFlux(ev);
	}
}


function loadFlux() {
	initGraphics = initFlux;
	updateGraphics = updateFlux;
	setupControlPanelFlux();
	fluxToggle = 1;
	//updateGraphics = updateFluxScreenSerenery;
	//updateGraphics = updatePicksle;
	initSound();
}

function setupControlPanelFlux() {
	document.getElementById("controlPanelHeader").innerHTML="Flux";
	document.getElementById("controlPanelMessage").innerHTML="Key Commands: <br> F: alternate gravity <br> O: toggle coolify <br>. (period): decrease opacity <br> / (slash): increase opacity <br> K: decrease radius <br> L: increase radius <br> R: toggle rotate <br> Arrow Keys: move circle";
}

function imageLoadedFlux(ev) {
    var fluxim = ev.target; // the image
    // read the width and height of the canvas
    width = canv.width;
    height = canv.height;
    // stamp the image on the left of the canvas:
    if(fluxim != "none") ctx.drawImage(fluxim, 0, 0);
    // get all canvas pixel data
	fluxInitLiveAndDead();
	initPixelsByNote();
    fluxImageData = ctx.getImageData(0, 0, width, height);
    initPixelBinsP();
    //ctx.putfluxImageData(fluxImageData, 0, 0);
    for (var y = 0; y < height; y++) {
		inpos = y * width * 4; // *4 for 4 ints per pixel
	    for (var x = 0; x < width; x++) {
	    		var index = inpos;
	        	var r = fluxImageData.data[inpos++];
	        	var g = fluxImageData.data[inpos++];
	        	var b = fluxImageData.data[inpos++];
	        	var alpha = fluxImageData.data[inpos];
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
	        	pixel.velocity = [0,0];
	        	pixel.coord = fluxGetCoord(pixel);
				pixel = setRadAndTheta(pixel);
				pixel.distanceFromCenter = getDistanceFromCenter(x,y);
	        	fluxPixels[fluxPixels.length] = pixel;
	        	var arrayIndex = Math.floor(Math.min((canv.height-y)/fluxBinwidth,fluxArrayUsage-1));
	        	deadPixelsPix[arrayIndex].push(pixel);
	        	if(!isBlack(pixel)) {
	        		fluxDeadPixels.push(pixel);
	        		fluxImageData.data[pixel.index+3] = 0;
	        		deadPixels[note].push(pixel);
	        		imageNoteCounts[note] = imageNoteCounts[note]+1;
	        	}
	        	closestNotes[inpos] = note
	        	inpos++;
	    }
   	}
   	fluxPixels.sort(function(a,b){return a.distanceFromCenter - b.distanceFromCenter});
   	ctx.putImageData(fluxImageData,0,0);
   	initFluxPixels();
}

function updateFluxScreenSerenery(array) {
	var maxBin = getMaxFreqBin(array);
	if(accentuate) array[maxBin]*=3;
	var amp = getTotalAmplitude(array);
	if(amp > fluxMaxAmp) fluxMaxAmp = amp;

	//averageHues(getMaxFreqBin(array));
	//updateColorize(array);
	//updateRandomColorize(amp);
	//ctx.putImageData(imageData,0,0);
	
	//ctx.putImageData(imageData,0,0);
	updateRandomPixels(array);
	ctx.clearRect(0,0,canv.width,canv.height);
	ctx.putImageData(fluxImageData,0,0);
}

function setRadAndTheta(pixel) {
	pixel.radius = fluxGetDistanceFromCenter(pixel.x,pixel.y);
	pixel.theta = Math.asin(pixel.coord["y"]/pixel.radius);
	if(pixel.coord["x"] < 0) {
		pixel.theta *= -1;
	    pixel.radius = (-1)*pixel.radius;
	}
	return pixel;
}

function calculateIndex(pixel) {
	return pixel.y*canv.width*4 + pixel.x*4;
}

function updateFlux(array, something, beat) {
	fluxUpdatePixels(array);
	ctx.putImageData(fluxImageData,0,0);
}

function getRandZeroOne(){
	var rand = Math.random();
	if(rand > .66) return 1;
	else if(rand > .33) return 0;
	return -1;
}

function updateFluxPixels(array) {
	var newfluxLivePixels = new Array();
	//console.log(fluxLivePixels);
	for(var i=0;i<fluxLivePixels.length;i++){
		var pixel = fluxLivePixels[i];
		fluxImageData.data[pixel.index+3]=0;
		var newPixel = pixel;
		newPixel.velocity = fluxGetVelocity(newPixel,array);
		newPixel = fluxMoveStep(newPixel);
		newfluxLivePixels.push(newPixel);
		fluxImageData.data[pixel.index+3]=255;
	}
	fluxLivePixels = newfluxLivePixels;
}

function updateFluxRadial(array){
	var chunksize = Math.PI/(array.length-fluxArrayOffset);
	var newfluxLivePixels = new Array();
	for(var i=0;i<fluxLivePixels.length;i++){
		var pixel = fluxLivePixels[i];
		fluxImageData.data[pixel.index+3]=0;
		var newPixel = pixel;
		//newPixel.velocity = fluxGetVelocity(newPixel);
		//newPixel.velocity = fluxGetVelocity(newPixel,array);
		newPixel.velocity = getNewRadialVelocity(newPixel);
		if(fluxInBoundsRadius(newPixel)==1) {
			var trueTheta = newPixel.theta + Math.PI/2;
			if(newPixel.radius < 0)trueTheta = Math.abs(trueTheta - Math.PI);
			var index = Math.floor(trueTheta/chunksize);
			if(index > array.length-1)index = array.length-1;
			var value = array[index]/fluxradscale;
			if(newPixel.radius < 0)newPixel.velocity[0] -= value;
			else newPixel.velocity[0] += value;
		}
		newPixel = moveRadialStep(newPixel)
		newfluxLivePixels.push(newPixel);
		fluxImageData.data[pixel.index+3]=255;
	}
	fluxLivePixels = newfluxLivePixels;
}
//return 1 for true, 0 for false
function fluxInBoundsRadius(pixel) {
	if(Math.abs(pixel.radius)<fluxRadius) return 1;
	return 0;
}

function fluxInBoundsTriangle(pixel) {
	var delta = 50;
	if(pixel.coord["y"] > Math.abs(pixel.coord["x"]) - delta && pixel.coord["y"] > delta) return 1;
	return 0;
}

function getNewRadialVelocity(pixel) {
	var thetavelo = 0;
	//var thetavelo = pixel.velocity[1];
	if(Math.abs(pixel.radius) > fluxRadius) {
		if(pixel.radius > 0) {
			return [pixel.velocity[0]-fluxRadialGrav,thetavelo];
		} else {
			return [pixel.velocity[0]+fluxRadialGrav,thetavelo];	
		}
	} else {
		var skew = 0;
		var rand = 0;
		if(fluxRandMiddle)rand = getRandZeroOne();
		if(pixel.radius < 0) skew = 0;
		return [pixel.velocity[0]/1.5+rand +skew,fluxRotationTheta];
	}	
}

function flipR(pixel) {
	pixel.radius = (-1)*pixel.radius;
	pixel.velocity[0] = (-1)*pixel.velocity[0];
	return pixel;
}

// velocity is now [r,theta]
function moveRadialStep(pixel) {
	pixel.radius += pixel.velocity[0];
	var newTheta = pixel.theta+pixel.velocity[1];
	if(newTheta > Math.PI/2) {
		newTheta = (-1)*Math.PI + newTheta;
		pixel = flipR(pixel);
	} else if(newTheta < (-1)*Math.PI/2) {
		newTheta = Math.PI + newTheta;
		pixel = flipR(pixel);
	}
	pixel.theta = newTheta;
	return updatePixelFromRad(pixel);
}

// sets up the rest of pixel's values to correspond with
// new radius and theta
function updatePixelFromRad(pixel) {
	var xCoord = Math.floor(pixel.radius * Math.cos(pixel.theta));
	var yCoord = Math.floor(pixel.radius * Math.sin(pixel.theta));
	pixel.coord = {"x":xCoord,"y":yCoord};
	pixel.x = Math.floor(xCoord+fluxCentX);
	pixel.y = Math.floor(yCoord+fluxCentY);
	/*For Respawn in center
	if(pixel.x > canvas.width || pixel.x < 0 || pixel.y > canvas.height || pixel.y < 0) {
		pixel.x = fluxCentX;
		pixel.y = fluxCentY;
		pixel.coord = {"x":0,"y":0};
		pixel.radius = 0;
	}*/
	pixel.index = calculateIndex(pixel);
	return pixel;
}


function fluxGetVector(startx,starty,endx,endy,scale) {
	var dx = endx-startx;
	var dy = endy-starty;
	var mag = Math.sqrt(dx*dx+dy*dy);
	return [Math.floor(dx*scale/mag),Math.floor(dy*scale/mag)];
}

function fluxGetVelocity(pixel,array) {
	var xvel = pixel.velocity[0];
	if(pixel.x >= canv.width || pixel.x <= 0) xvel = -xvel;
	if(pixel.y >= canv.height - 200) {
		var yval = fluxGetBump(pixel,array);
		/*
		var variance = -1;
		var rand = Math.random();
		if(rand > .66) variance = 0;
		else if(rand > .33) variance = 1;
		return [pixel.velocity[0],-pixel.velocity[1]+variance-1];
		*/
		//if(Math.random() > .9)
		//return [getRandZeroOne(),getRandZeroOne()-yval];
		return [0,getRandZeroOne()-yval];
		//else return [getRandZeroOne(),getRandZeroOne()];
	}
	return [xvel,pixel.velocity[1]+fluxgravity];
}

function fluxGetBump(pixel,array){
	var chunksize = canv.width/array.length;
	var index = Math.floor(pixel.x/chunksize);
	return Math.floor(array[index]/fluxheightscale);
}

function initFluxPixels() {
	addRandomPixelsFlux(fluxNumPix)
}

function fluxGetCoord(pixel) {
	var xval = pixel.x-fluxCentX;
	var yval = pixel.y-fluxCentY;
	return {"x":xval, "y":yval};
}

// returns new pixel one step away accord. to pixel's velocity
function fluxMoveStep(pixel) {
	pixel.x += Math.floor(pixel.velocity[0]);
	pixel.y += Math.floor(pixel.velocity[1]);
	pixel.coord = fluxGetCoord(pixel);
	pixel.index = calculateIndex(pixel);
	pixel = setRadAndTheta(pixel);
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
		var index = Math.floor(Math.random()*fluxDeadPixels.length);
		var pixel = fluxDeadPixels[index];
		var lastPixel = fluxDeadPixels[fluxDeadPixels.length-1];
		fluxDeadPixels[index] = lastPixel;
		fluxDeadPixels.pop();
		if(pixel) {
			fluxLivePixels.push(pixel);
			fluxImageData.data[pixel.index+3] = 255;
		}	
	}
}

function removeRandomPixelsFlux(num, note) {
	for(var i=0;i<num;i++){
		var index = Math.floor(Math.random()*fluxLivePixels.length);
		var pixel = fluxLivePixels[index];
		var lastPixel = fluxLivePixels[fluxLivePixels.length-1];
		fluxLivePixels[index] = lastPixel;
		fluxLivePixels.pop();
		if(pixel) {
			fluxDeadPixels.push(pixel);
			fluxImageData.data[pixel.index+3] = 0;
		}
	}
}


function colorDistance(color1, color2) {
	return Math.abs(color1[0]-color2[0])+Math.abs(color1[1]-color2[1])+Math.abs(color1[2]-color2[2]);
}


function isBlack(pixel) {
	return pixel.r==255 && pixel.g == 255 && pixel.b==255;
}

function fluxInitLiveAndDead() {
	fluxLivePixels = new Array();
	fluxDeadPixels = new Array();
}


function fluxGetDistanceFromCenter(x,y) {
	return Math.sqrt((x-fluxCentX)*(x-fluxCentX)+(y-fluxCentY)*(y-fluxCentY));
}

function fluxInitKeyboard() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		implementMainKeyboardKeys(code);
		if(code == 70) toggleUpdateFluxPixels();// F
		else if(code == 75) fluxDecreaseRad(); // K
		else if(code == 76) fluxIncreaseRad(); // L
		else if(code==190) lowerOpacityFactor(); // Period
		else if(code==191) increaseOpacityFactor(); // For. Slash
		else if(code >=37 && code <=40) fluxCatchArrowKey(code); // Arrow Keys
		else if(code==79) fluxToggleScene(); // O
		else if(code==82) fluxToggleRotate(); //R
	}
}

function fluxToggleRotate() {
	if(fluxRotationTheta == 0)
		fluxRotationTheta = .02;
	else {
		fluxRotationTheta = 0;
	}
}

function fluxToggleScene() {
	if(fluxToggle == 0) {
		transitionSereneryToFlux();
		fluxToggle = 1;
	} else if(fluxToggle == 1) {
		transitionFluxToSerenery();
		fluxToggle=0;
		//fluxToggle = 2;
	} 
	/*
	else {
		updateGraphics = updatePicksle;
		fluxToggle = 0;
	}*/
}

function transitionSereneryToFlux() {
	initFluxPixels();
	updateGraphics = updateFlux;
}

function transitionFluxToSerenery() {
	/*for(var i=0;i<fluxLivePixels.length;i++){
		var pix = fluxLivePixels[i];
		livePixels[pix.note].push(pix)
	}*/
	// clear flux live pix array
	fluxLivePixels = new Array();
	// change update
	updateGraphics = updateFluxScreenSerenery;
}

function fluxDecreaseRad() {
	if (fluxRadius >= 0) {
		fluxRadius -= 5;
	}
}

function fluxIncreaseRad() {
	fluxRadius += 5;
}

function toggleUpdateFluxPixels() {
	if(fluxUpdatePixelsVal==0) {
		fluxUpdatePixelsVal++;
		fluxUpdatePixels = updateFluxRadial;
	} else {
		fluxUpdatePixelsVal--;
		fluxUpdatePixels = updateFluxPixels;
	}
}

function fluxCatchArrowKey(code) {
	var scale = 5;
	if(code == 37) fluxCentX -= scale;
	else if(code == 38) fluxCentY -= scale;
	else if(code==39) fluxCentX += scale;
	else fluxCentY += scale;
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