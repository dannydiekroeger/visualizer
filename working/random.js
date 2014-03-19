var randomDraw;
var timeSinceBeat;

function initRandom(){
	getRandomScene();
}

function loadRandom() {
	initGraphics = initRandom;
	updateGraphics = drawRandom;
	timeSinceBeat=0;
		console.log(randomDraw);

	initSound();
}

function drawRandom(freqArray, waveArray, beat){
if(timeSinceBeat>20 && beat){
			//console.log("here");
		getRandomScene();
	}
	if(!beat){
		timeSinceBeat++;		
	}else timeSinceBeat=0;

	randomDraw(freqArray, waveArray, beat);
}

function getRandomScene(){
	var rand = Math.floor(Math.random()*100)/100;
	console.log(rand);
	var numModes = 4;
	if(rand< 1/numModes) {
		initNeon();
		randomDraw=drawNeon;
	}else if(rand< 2/numModes) {
		initRainbowLine();
		randomDraw=updateRainbowLine;
	}else if(rand< 3/numModes) {
		initRetro();
		retroDoBox = 0;
		randomDraw=drawRetro;
	}else{
		initFreqBars();
		randomDraw=drawBars;
	}
	
}