// My init function
// Notice: - no parameters taken
//         - refers to "canv" which refers to the element with
//           id "canvas" in sound.html
//         - refers to "ctx" which is defined in sound.js 

var centX;
var centY;
var circle;
var gradient;
var imageData;
var phase;

function initScreen() {
	    canv.setAttribute("width", window.innerWidth - 50);
	    canv.setAttribute("height", window.innerHeight-50);
		
		var width = canv.width;
		var height = canv.height;
		imageData = ctx.createImageData(width,height);
		phase = 0;
		makeSwirl();
		
}
function updateScreen(array) {
	phase += 2.4;
	if(phase % Math.PI*2 <= .5) phase=0;
	makeSwirl();
}

function makeSwirl() {
	console.log(phase);
	var pos = 0; // index position into imagedata array
	var width = canv.width;
	var height = canv.height;
	var xoff = width / 2; // offsets to "center"
	var yoff = height / 2;
	
	// walk left-to-right, top-to-bottom; it's the
	// same as the ordering in the imagedata array:
	
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			// calculate sine based on distance
			var x2 = x - xoff;
			var y2 = y - yoff;
			var d = Math.sqrt(x2*x2 + y2*y2);
			var t = Math.sin(d/6.0-phase);
	
			// calculate RGB values based on sine
			var r = t * 200;
			var g = 125 + t * 80;
			var b = 235 + t * 20;
			// set red, green, blue, and alpha:
			imageData.data[pos++] = Math.max(0,Math.min(255, r));
			imageData.data[pos++] = Math.max(0,Math.min(255, g));
			imageData.data[pos++] = Math.max(0,Math.min(255, b));
			imageData.data[pos++] = 255; // opaque alpha
		}
	}
	ctx.putImageData(imageData,0,0);
}

function setPixel(image, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    image.data[index+0] = r;
    image.data[index+1] = g;
    image.data[index+2] = b;
    image.data[index+3] = a;
}

function initKeyboard() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		if(code == 49) goFullScreen(); // 1
	}
}

function drawOneArc(x,y,radius) {
	incr = 2.0*Math.PI/16.0;
	
	//console.log(incr);
	for(i=circleRotateStart;i<2*Math.PI;i+=(incr*2)){
		//console.log(i);
		ctx.beginPath();
		ctx.arc(x,y,radius,i,i+incr);
		//ctx.stroke();
		ctx.fill();
	}
	circleRotateStart += .02;
	if(circleRotateStart>incr)circleRotateStart = 0;
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