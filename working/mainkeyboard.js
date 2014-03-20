/*
This defines global keyboard commands that switch between the different worlds
*/

function initMainKeyboard() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		implementMainKeyboardKeys(code);
	}
}

function implementMainKeyboardKeys(code) {
	if(code == 49) loadFreqBars(); // 1
	else if(code == 50) loadOscillator(); // 2
	else if(code == 51) loadRetro(0); // 3
	else if(code == 52) loadFlux(); // 4
	else if(code == 53) loadStarParticles(); // 5
	else if(code == 54) loadRainbowLine(0); // 6
	else if(code == 55) loadNeon(); // 7
	else if(code == 56) loadDonuts(0); // 8
	else if(code == 57) loadWaves(); // 9	
}