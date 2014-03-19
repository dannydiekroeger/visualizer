/*********************************************
 *
 * Visualizer World Toggles
 *
 * -------------------------------------------
 *
 * Rather than having to individually load
 * each world, opt to toggle through like 
 * styles. Keyboard functions used.
 * N for next
 * B for back
 *
 *********************************************/

var toggleType = 0;
var toggleDraw;

var currToggledWorld = 0;
var worldChanged = false;
var total3DWorlds = 4;
var total2DWorlds = 7;


/**********************************
 *
 * Load toggle based on given type
 *
 **********************************/

function loadToggle(type) {
	toggleType = type;
	if(toggleType == 0) {
		initGraphics = init2DToggle;
		updateGraphics = draw2DToggle;
	} else if (toggleType == 1) {
		initGraphics = init3DToggle;
		updateGraphics = draw3DToggle;
	}
	initSound();
	initToggleKeys();
}

function initToggleKeys() {
	document.onkeydown = function(event) {
		worldChanged = true;
		code = event.keyCode;
		if(code == 78) currToggledWorld++; //N
		if(code == 66) currToggledWorld--; //B
	}
}

/**********************************
 *
 * Load 2D Toggles
 *
 **********************************/

function init2DToggle() {
	currToggledWorld = 0;

	load2DWorld();	
}

function draw2DToggle(freqArray, waveArray, beat) {
	
	if (worldChanged) { worldChanged = false; load2DWorld(); }
	toggleDraw(freqArray, waveArray, beat);
}

function load2DWorld() {
	if(currToggledWorld == total2DWorlds) currToggledWorld = 0;
	if(currToggledWorld < 0) currToggledWorld = total2DWorlds - 1;

	switch(currToggledWorld) 
	{
		case 0:
			initNeon();
			toggleDraw = drawNeon;
			break;
		case 1:
			doType = 0;
			initRainbowLine();
			toggleDraw = updateRainbowLine;
			break;
		case 2:
			doType = 2;
			initRainbowLine();
			toggleDraw = updateRainbowLine;
			break;
		case 3:
			initRetro();
			toggleDraw = drawRetro;
			retroDoBox = 0;
			break;
		case 4:
			initRetro();
			toggleDraw = drawRetro;
			retroDoBox = 2;
			break;
		case 5:
			initRetro();
			toggleDraw = drawRetro;
			retroDoBox = 3;
			break;
		default:
			initFreqBars();	
			toggleDraw = drawBars;		
	}


}

/**********************************
 *
 * Load 3D Toggles
 *
 **********************************/

function init3DToggle() {
	currToggledWorld = 0;

	load3DWorld();	
}

function draw3DToggle(freqArray, waveArray, beat) {
	if (worldChanged) { worldChanged = false; load3DWorld(); }
	toggleDraw(freqArray, waveArray, beat);
}

function load3DWorld() {
	if(currToggledWorld == total3DWorlds) currToggledWorld = 0;
	if(currToggledWorld < 0) currToggledWorld = total3DWorlds - 1;
	
	switch(currToggledWorld) 
	{
		case 0:
			StarInit();
			toggleDraw = StarUpdate;
			break;
		case 1:
			doValue = 0;
			DonutInit();
			toggleDraw = DonutUpdate;
			break;
		case 2:
			doValue = 1;
			DonutInit();
			toggleDraw = DonutUpdate;
			break;
		default:
			initComposer = wavesComposer;			
			WavesInit();
			toggleDraw = WaveUpdate;
			
	}
	
}