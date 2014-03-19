/*
serenery.js

Helper functions for flux.js

*/

var imageData;
var newimageData;
var closestNotes;
var width;
var height;
var im;
var invert;
var opacityScale;
var imageNoteCounts;
//var pixels;
var centX;
var centY;
var imageDataArray;
var livePixels;
var deadPixels;
var oldNoteCounts
var accentuate;

function averageHues(bin) {
	var scale = 10;
	var color = binNoteColor(bin);
    for (y = 0; y < height; y++) {
        inpos = y * width * 4; // *4 for 4 ints per pixel
        for (x = 0; x < width; x++) {
        	newimageData.data[inpos] = (color[0]+scale*fluxImageData.data[inpos])/(scale+1);
        	inpos++;
        	newimageData.data[inpos] = (color[1]+scale*fluxImageData.data[inpos])/(scale+1);
        	inpos++;
        	newimageData.data[inpos] = (color[2]+scale*fluxImageData.data[inpos])/(scale+1);
        	inpos++;
        	inpos++;
        }
    }
	
}

function bounceAlpha(amp) {
	updateAlphas(amp/(fluxMaxAmp+0.0))
}

function updateRandomPixels(array) {
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

function addPixels(num, note) {
	for(var i=0;i<num;i++){
		var index = Math.floor(Math.random()*deadPixels[note].length);
		var pixel = deadPixels[note][index];
		var lastPixel = deadPixels[note][deadPixels[note].length-1];
		deadPixels[note][index] = lastPixel;
		deadPixels[note].pop();
		if(pixel) {
			livePixels[note].push(pixel);
			fluxImageData.data[pixel.index+3] = 255;
		}	
	}
}

function removePixels(num, note) {
	for(var i=0;i<num;i++){
		var index = Math.floor(Math.random()*livePixels[note].length);
		var pixel = livePixels[note][index];
		var lastPixel = livePixels[note][livePixels[note].length-1];
		livePixels[note][index] = lastPixel;
		livePixels[note].pop();
		if(pixel) {
			deadPixels[note].push(pixel);
			fluxImageData.data[pixel.index+3] = 0;
		}
	}
}

function updateColorize(array) {
	var noteTotals = getNoteTotals(array);
	//noteTotals = skewNoteTotals(noteTotals);
	var notePercents = getNotePercents(noteTotals);
	var thisNoteCounts = getNoteCounts(notePercents);
	for(var i=0;i<pixels.length;i++) {
	        	var pixel = pixels[i];
	        	var inpos = pixel.index + 3;
	        	var note = pixel.note;
	        	// Fill effect
	        	/*
	        	if(thisNoteCounts[note] > 0) {
	        		imageData.data[inpos]=255;
	        		thisNoteCounts[note] = thisNoteCounts[note]-1;
	        	} else {
	        		imageData.data[inpos]=0;
	        	}
	        	*/
	   
	        	//Random turn on here
	        	
	        	var percent = notePercents[note]
	        	if(Math.random() >percent*percent*percent) { // turn pixel off
	        		fluxImageData.data[inpos] = 0;
	        	} else {
	        		fluxImageData.data[inpos] = 255;
	        	}inpos++;
	  }
}

function skewNoteTotals(noteTotals) {
	var scale = 1.1;
	var note="a";
	var maxnote="a";
	for(var i=0;i<7;i++){
		if(noteTotals[note] > noteTotals[maxnote]) {
			maxnote = note;
		}
		note = getNextNote(note);
	}
	note = "a";
	for(var i=0;i<7;i++){
		if(note != maxnote) {
			noteTotals[maxnote] += noteTotals[note]/scale;
			noteTotals[note] = noteTotals[note]/scale;
		}
		note = getNextNote(note);
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
		var val = (noteTotals[note]*opacityScale+0.0)/(fluxMaxAmp+0.0);
		notePercents[note] = Math.min(1.0, val*val);
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

function isBlack(pixel) {
	return pixel.r==255 && pixel.g == 255 && pixel.b==255;
}

function initPixelsByNote() {
	livePixels = {"a":new Array(), "b":new Array(), "c":new Array(), "d":new Array(), "e":new Array(), "f":new Array(), "g":new Array()};
	deadPixels = {"a":new Array(), "b":new Array(), "c":new Array(), "d":new Array(), "e":new Array(), "f":new Array(), "g":new Array()};
}


function getDistanceFromCenter(x,y) {
	return Math.sqrt((x-centX)*(x-centX)+(y-centY)*(y-centY));
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