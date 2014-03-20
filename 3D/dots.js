//specifies the init and draw functions for the dots mode
function loadDots(){
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = dotComposer;
	initSound();
}

//This function applies several THREE.JS shaders to apply the 
// dot effect to the waves 
function dotComposer(){
	composer = new THREE.EffectComposer( renderer );
	
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	//adds the dot screen effect
	dotScreenPass = new THREE.ShaderPass( THREE.DotScreenShader );
	composer.addPass(dotScreenPass);

	
	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;

}