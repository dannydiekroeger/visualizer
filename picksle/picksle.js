// My init function
// Notice: - no parameters taken
//         - refers to "canv" which refers to the element with
//           id "canvas" in sound.html
//         - refers to "ctx" which is defined in sound.js 

var livePixelsPix;
var deadPixelsPix;
var prevArrayPix;

function imageLoadedP(ev) {
    im = ev.target; // the image

    // read the width and height of the canvas
    width = canv.width;
    height = canv.height;
    // stamp the image on the left of the canvas:
    ctx.drawImage(im, 0, 0);
    // get all canvas pixel data
	initPixelBinsP();
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
	        	var arrayIndex = Math.floor(Math.min((canv.height-y)/binwidth,arrayUsage-1));
	        	deadPixelsPix[arrayIndex].push(pixel);
	        	imageData.data[pixel.index+3] = 0;
	        	inpos++;
	    }
   	}
}

function initPrevArrayP(){
	prevArrayPix = new Array();
	for(var i=0;i<1024;i++){
		prevArrayPix[i]=0;
	}
}

function calculateIndexP(pixel) {
	return pixel.y*canv.width*4 + pixel.x*4;
}

function updatePicksle(array) {
	var thismax = getMaxBinAmp(array);
	if(thismax) fluxMaxBinAmp = Math.max(fluxMaxBinAmp,thismax);
	updatePixelsP(array);
	ctx.putImageData(fluxImageData,0,0);
	prevArrayPix = array;
}

function getMaxBinAmp(array) {
	var maxamp = 0;
	var bin=0;
	for(var i=0;i<array.length;i++){
		if(array[i]>maxamp) {
			maxamp = array[i];
			bin = i;
		}
	}
	return maxamp;
}

function updatePixelsP(array) {
	for(var i=0;i<fluxArrayUsage;i++){
		var diff = array[i]-prevArrayPix[i];
		if(diff>0) {
			addRandomPixelsP(i,diff);
		} else if(diff<0){
			removeRandomPixelsP(i, (-1)*diff);
		}
	}
}


function addRandomPixelsP(bin, val) {
	var numPix = (val+0.0)/(fluxMaxBinAmp+0.0)*(fluxPixPerBin+0.0);
	for(var i=0;i<numPix;i++){
		var index = Math.floor(Math.random()*(deadPixelsPix[bin].length));
		var pixel = deadPixelsPix[bin][index];
		var lastPixel = deadPixelsPix[bin][deadPixelsPix[bin].length-1];
		if(pixel) {
			deadPixelsPix[bin][index] = lastPixel;
			deadPixelsPix[bin].pop();
			livePixelsPix[bin].push(pixel);
			fluxImageData.data[pixel.index+3] = 255;
		}
	}
}

function removeRandomPixelsP(bin, value) {
	var numPix = (value+0.0)/(fluxMaxBinAmp+0.0)*fluxPixPerBin;
	for(var i=0;i<numPix;i++){
		var len = livePixelsPix[bin].length;
		var index = Math.floor(Math.random()*(livePixelsPix[bin].length));
		var pixel = livePixelsPix[bin][index];
		var lastPixel = livePixelsPix[bin][livePixelsPix[bin].length-1];
		if(pixel) {
			livePixelsPix[bin][index] = lastPixel;
			livePixelsPix[bin].pop();
			deadPixelsPix[bin].push(pixel);
			fluxImageData.data[pixel.index+3] = 0;
		}
	}
}

function initPixelBinsP() {
	livePixelsPix = new Array();
	deadPixelsPix = new Array();
	for(var x=0;x<fluxArrayUsage;x++){
		livePixelsPix[x] = new Array();
		deadPixelsPix[x] = new Array();
	}
}


function getDistanceFromCenter(x,y) {
	return Math.sqrt((x-centX)*(x-centX)+(y-centY)*(y-centY));
}

