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
var total3DWorlds = 0;
var total2DWorlds = 7;


/**********************************
 *
 * Load toggle based on given type
 *
 **********************************/

function loadToggle(toggleType) {
	if(toggleType == 0) {
		initGraphics = init2DToggle;
		updateGraphics = draw2DToggle;
	} else if (toggleType == 1) {
		initGraphics = init3DToggle;
		updateGraphics = draw3DToggle;
	}
	initSound();
}

function initToggleKeys() {
	document.onkeydown = function(event) {
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
	initToggleKeys();

	load2DWorld();	
}

function draw2DToggle(freqArray, waveArray, beat) {
	load2DWorld();
	toggleDraw(freqArray, waveArray, beat);
}

function load2DWorld() {
	if(currToggledWorld > total2DWorlds) currToggledWorld = 0;
	if(currToggledWorld < 0) currToggledWorld = 0;


			initNeon();
			toggleDraw = drawNeon;

	switch(currToggledWorld) 
	{
		case 0:
			initNeon();
			toggleDraw = drawNeon;
			break;
		case 1:
			initRainBowLine();
			toggleDraw = updateRainbowLine;
			break;
		case 2:
			initRetro(0);
			toggleDraw = drawRetro;
			break;
		case 3:
			initRetro(1);
			toggleDraw = drawRetro;
			break;
		case 4:
			initRetro(2);
			toggleDraw = drawRetro;
			break;
		case 5:
			initRetro(3);
			toggleDraw = drawRetro;
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
	initToggleKeys();

	load3DWorld();	
}

function draw3DToggle(freqArray, waveArray, beat) {
	load3DWorld();
	toggleDraw(freqArray, waveArray, beat);
}

function load3DWorld() {
	if(currToggledWorld > total3DWorlds) currToggledWorld = 0;
	if(currToggledWorld < 0) currToggledWorld = 0;
/*	
	switch(currToggledWorld) 
	{
		case 0:
			
			break;
		case 1:

			break;
		case 2:

			break;
		default:			
	}
*/	
}