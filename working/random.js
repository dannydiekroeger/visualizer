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
	if(!beat){
		timeSinceBeat++;		
	}else timeSinceBeat=0;
	if(timeSinceBeat>16){
			//console.log("here");
		getRandomScene();
	}
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
		randomDraw=drawRetro;
	}else{
		initFreqBars()
		randomDraw=drawBars;
	}
	
}