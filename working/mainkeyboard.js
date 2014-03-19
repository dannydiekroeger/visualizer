/*
This defines global keyboard commands that switch between the different worlds
*/

function initMainKeyboard() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		if(code == 49) goFullScreen(); // 1
	}
}