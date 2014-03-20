
//This function applies several THREE.JS shaders to apply the 
//kaleidoscope effect to the waves 
function kaleidoComposer(){
	
	composer = new THREE.EffectComposer( renderer );
	
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	//adds glow effect
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	//adds kaleidoscope effect
	kaleidoPass= new THREE.ShaderPass(THREE.KaleidoShader);
	composer.addPass(kaleidoPass);

	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;
}

/*
*the init method for the kaleido mode. Sets up variables specific to the kaleido world 
* then calls methods to create the canvas, camera, voluminous light, and waves
*/
function kaleidoInit(){
	//initialize the variables to draw the waves
	vlightx = 500;
	vlighty = 1200;
	vlightz = 500;
	zpos = 200;
	ypos = 1200;
	xpos = 500;
	numLines = 10;
	lineLength = 4000;
	ticks=0;
	vlightRadius = 200;
	vlightDetail = 3;
	AMPLITUDE_SCALE=10;
	//array to hold all of the lines in the scene
	lines = [];

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


//specifies the init and draw functions for the kaleido mode
function loadKaleido(){
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = kaleidoComposer;
	initSound();
}

