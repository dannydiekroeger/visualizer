

// the main three.js components
var camera, scene, renderer, ticks, composer, vlight
var initComposer

//variables used to draw waves, kaleido, and dots
var numLines;
var lineLength; 
var vlightx, vlighty, vlightz;
var xpos, ypos, zpos;
var fov = 150;
var near = 1; 
var far = 4000;
var vlightRadius;
var vlightDetail;
var lookAtWaves; 
var yUpWaves = new THREE.Vector3(0, 1, 0);	// used as a vector in the xy plane for up vector calculations
var rotate = false;

//array to hold all of the lines in the scene
lines = [];

//constant definitions
var MOVE_RIGHT =30;
var STEP_SIZE=100;
var RAND_MAX=5;
var RAND_MIN=0;
var ROT_MAX = .2;
var ROT_MIN = -.2;
var PROB_ROTATION = .3;
var RENDER_CONST = .1;
var LINE_WIDTH = 3;
var START_X = -1000;
var START_Y=600;
var START_Z = 500;
var LINE_SEP = 30;
var X_OFFSET = 1200;
var LIGHT_X_OFFSET = X_OFFSET+50;
var AMPLITUDE_SCALE=10;
var BASE_Z = 200;


/*
*the init method for the waves world. Sets up variables needed to draw the world that 
* are specific to the starndard waves then calls methods to create the canvas, 
*camera, voluminous light, and waves
*/
function WavesInit() {
	//initialize the variables to draw the waves
	vlightx = 500;
	vlighty = 1200;
	vlightz = 500;
	zpos = 800;
	ypos = 1200;
	xpos = 500;
	numLines = 10;
	lineLength = 4000;
	ticks=0;
	vlightRadius = 200;
	vlightDetail = 3;
	AMPLITUDE_SCALE=10;

	initCanvasWebGL(); //this allows for 3D context 

	initCamera();
	drawWaves();
	drawvLight();
				
	lookAtWaves = new THREE.Vector3(vlightx, vlighty, vlightz);
	camera.lookAt(lookAtWaves); 
	initRenderer();
	
	initComposer();
	
    composer.render();


}

//inits the THREE camera and addis it to a new THREE scene
function initCamera(){
	var width = canvWebGL.width; //references to the 3D context 
	var height = canvWebGL.height; 
	camera = new THREE.PerspectiveCamera(fov, width / height, near, far );
	camera.position.z = zpos;
	camera.position.y= ypos;
	camera.position.x= xpos;
	scene = new THREE.Scene();

	scene.add(camera);

}

//initializes a THREE renderer and adds its DOM element to the screen
function initRenderer(){
	var width = canvWebGL.width; 
	var height = canvWebGL.height; 

	renderer = new THREE.WebGLRenderer({canvas: canvWebGL}); 
	renderer.setSize(width, height );
}


//draws the voluminous light object that leads the waves
//uses a Icosahedron geometry with high enough detail that it appears sphere
function drawvLight(){
	vlight = new THREE.Mesh(
   	 	new THREE.IcosahedronGeometry(vlightRadius, vlightDetail),
   	 	new THREE.MeshBasicMaterial({
   	     	color: getNeonColor()
   		 })
   	);
	vlight.position.y = vlighty;
	vlight.position.x= vlightx;
	vlight.position.z= vlightz;
	scene.add( vlight );
}


// the main update function, called 30 times a second
//updates each line's y value to show the sound wave form
//line stays a constant length, just shifts to add each new value to the end
function WaveUpdate(visArray, waveArray, beat) {
	//the ticks variable keeps track of how far to the right we have moved in the world
	ticks+=MOVE_RIGHT;

	for(var i=0; i<waveArray.length;i+=STEP_SIZE){
	for(var l=0;l<lines.length;l++){
		var curLine = lines[l];
		curLine.geometry.vertices.shift();
		curLine.geometry.vertices.push(new THREE.Vector3(X_OFFSET+ticks, waveArray[i]*AMPLITUDE_SCALE, BASE_Z-l*LINE_SEP));
		curLine.geometry.verticesNeedUpdate=true;
		vlight.position.set(LIGHT_X_OFFSET+ticks, waveArray[i]*AMPLITUDE_SCALE, BASE_Z-lines.length/2*LINE_SEP );
		}
	}
    camera.position.x=STEP_SIZE+ticks;
	if(beat && rotate){
		rotateCam();
	}
composer.render(RENDER_CONST);

}

function rotateCam(){
		var rand = Math.random() * (RAND_MAX - RAND_MIN) + RAND_MIN;
		var rot = Math.random() * (ROT_MAX - ROT_MIN) + ROT_MIN;
		if(rand<PROB_ROTATION){
			//rotate camera
			camera.position.z+=rot;
			camera.up=yUpWaves;
			camera.lookAt(vlight.position); // set to be looking at the light
		}
}


//creates the line objects and adds them to the scene when the scene is intiailized
function drawWaves(){
	var  lineColor;

     for(var n=0; n<numLines;n++){
          var geometry = new THREE.Geometry();
          geometry.dynamic=true;
          
          	
			var color = getNeonColor();
			var material = new THREE.LineBasicMaterial({
			  color: color,
			  ambient: color,  
			  linewidth: LINE_WIDTH,			  
		});

     for(var i=0;i<lineLength;i++){	
	 		geometry.vertices.push(new THREE.Vector3(START_X+i, START_Y, START_Z-LINE_SEP*n));
	 	}
	 	 line = new THREE.Line(geometry, material);
	     scene.add(line);
		 lines.push(line);
	 }
	 
	
}

//specifies the init and draw functions for the waves mode
function loadWaves() {
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = wavesComposer;
	setupControlPanelWaves();
	initKeyboardWaves();
	initSound();
}

function setupControlPanelWaves() {
	document.getElementById("controlPanelHeader").innerHTML="Waves";
	document.getElementById("controlPanelMessage").innerHTML="Key Commands:<br>A: Waves <br>B: Dot Waves <br> C: Kaleido Waves <br> R: Turn On/Off Rotation <br> I: Increase Amplitude <br> D: Decrease Amplitude";
} 


//This function applies several THREE.JS shaders to apply the 
//illuminated effect to the waves 
function wavesComposer(){
	composer = new THREE.EffectComposer( renderer );
	
	//causes the scene to be rendered by the composer
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	//bloom pass creates the glowing look
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );

	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;
}


//inits the keyboard functions for the waves
function initKeyboardWaves() {
	document.onkeydown = function (event) {
		code = event.keyCode;
		implementMainKeyboardKeys(code);
		if (code == 65) loadWaves(); //A switches to normal waves
		else if (code == 66) loadDots(); //B switches to the dot world
		else if (code == 67) loadKaleido(); //C switches to the Kaleido world
		else if (code == 82) rotate=!rotate; //R turns on camera rotation for all worlds
		else if (code == 68) AMPLITUDE_SCALE--;
		else if (code == 73)  AMPLITUDE_SCALE++;
	}
}

