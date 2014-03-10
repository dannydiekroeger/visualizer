

// the main three.js components
var camera, scene, renderer, ticks, composer
var initComposer

lines = [];


function WavesInit() {
	ticks=0;
	initCanvas();
	var width = canv.width;
	var height = canv.height;

	canv.remove();
	camera = new THREE.PerspectiveCamera(150, width / height, 1, 4000 );

	camera.position.z = 800;
	camera.position.y=1200;
	camera.position.x=500;
	camera.rotation.x=0;
	camera.rotation.y=0;
	camera.rotation.z=0;
	scene = new THREE.Scene();

	scene.add(camera);
	
		drawWaves();


	renderer = new THREE.WebGLRenderer();
	
	//renderer = new THREE.CanvasRenderer({ canvas : canv });
	renderer.setSize(width, height );
	document.getElementById("screen").appendChild( renderer.domElement);

	initComposer();
	
    composer.render();


}

// the main update function, called 30 times a second

function WaveUpdate(visArray, waveArray, beat) {
	ticks+=30;

	for(var i=0; i<waveArray.length;i+=50){
	for(var l=0;l<lines.length;l++){
	//	var curLine = lines[l];
	//	var curGeom = curLine.geometry;
		lines[l].geometry.vertices.shift();

		lines[l].geometry.vertices.push(new THREE.Vector3(700+ticks, waveArray[i]+l*100, 200));
		lines[l].geometry.verticesNeedUpdate=true;

		}
	}
	//camera.position.x=camera.position.x+27;
    camera.position.x=200+ticks;

	if(beat){
		console.log("beat");
		var options = 5;
		var rand = Math.random() * (5 - 0) + 0;
		var rot = Math.random() * (.2 +.2) - .2;
		if(rand<3)

			camera.rotation.x=camera.rotation.x+rot;
		//else if(rand<2)
//
//			camera.rotation.y=camera.rotation.y+rot;
	//	else if(rand<3)
//			camera.rotation.z=camera.rotation.z+rot;
	/*	else if (rand<4.5)
			camera.position.z-=20;
		else
			camera.position.z+=5;*/

//camera.rotation.x=camera.rotation.x+rot;
	}
//renderer.render( scene, camera );
composer.render(.1);

}

function drawWaves(){
	var  lineColor, hslValues;


     for(var n=0; n<50;n++){
          var geometry = new THREE.Geometry();
          geometry.dynamic=true;
          var material = new THREE.LineBasicMaterial({
			  color: getNeonColor(),
			  opacity:.7,
			  linewidth: 3
		});

     for(var i=0;i<3000;i++){
     	
	 		geometry.vertices.push(new THREE.Vector3(-1000+i, 100*n-600, 500));
	 	}
	 	 line = new THREE.Line(geometry, material);
	      scene.add(line);
      lines.push(line);
	 }
	 
	 
	var imgMaterial2 = new THREE.MeshBasicMaterial( { 
					color:'blue'
				} );

				//create cube
				var geometry = new THREE.CubeGeometry(1000, 1000, 1000);
				cube = new THREE.Mesh(geometry, imgMaterial2);
				//scene.add(cube);


}


function loadWaves() {
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = wavesComposer;
	initSound();
}

function loadKaleido(){
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = kaleidoComposer;
	initSound();
}

function loadDots(){
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initComposer = dotComposer;
	initSound();
}

function kaleidoComposer(){
	
	composer = new THREE.EffectComposer( renderer );
	
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	dotScreenPass = new THREE.ShaderPass( THREE.DotScreenShader );
	//composer.addPass(dotScreenPass);
	
	kaleidoPass= new THREE.ShaderPass(THREE.KaleidoShader);
	composer.addPass(kaleidoPass);

	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;
}

function wavesComposer(){
	composer = new THREE.EffectComposer( renderer );
	
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;
}

function dotComposer(){
	composer = new THREE.EffectComposer( renderer );
	
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	dotScreenPass = new THREE.ShaderPass( THREE.DotScreenShader );
	composer.addPass(dotScreenPass);
	
	kaleidoPass= new THREE.ShaderPass(THREE.KaleidoShader);
	composer.addPass(kaleidoPass);

	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;

}