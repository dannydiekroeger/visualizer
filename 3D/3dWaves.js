

// the main three.js components
var camera, scene, renderer, ticks, composer

lines = [];


function WavesInit() {
	ticks=0;
	initCanvas();
	var width = canv.width;
	var height = canv.height;

	canv.remove();
	camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 1, 4000 );
	 camera.useQuaternion = true;

	camera.position.z = 800;
	camera.position.y=100;
	camera.position.x=900;
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


	
	composer = new THREE.EffectComposer( renderer );
	
	renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass(renderPass);
	
	bloomPass = new THREE.BloomPass(1,25,4.0,256);
	composer.addPass( bloomPass );
	
	kaleidoPass = new THREE.ShaderPass( THREE.KaleidoShader );
	//composer.addPass(kaleidoPass);

	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	composer.addPass( copyPass );
	//set last pass in composer chain to renderToScreen
	copyPass.renderToScreen = true;
    composer.render();


}

// the main update function, called 30 times a second

function WaveUpdate(visArray, waveArray, beat) {
	ticks+=30;

	for(var i=0; i<waveArray.length;i+=50){
	for(var l=0;l<lines.length;l++){
		var curLine = lines[l];
		var curGeom = curLine.geometry;
		curGeom.vertices.push(new THREE.Vector3(700+ticks, waveArray[i]+l*8, 500));
	//	if(i%1000==0&& l==0)console.log(lines[l]);

		}
	}
	camera.position.x=camera.position.x+27;


	if(beat){
		console.log("beat");
		var options = 5;
		var rand = Math.random() * (5 - 0) + 0;
		var rot = Math.random() * (.8 +.8) - .8;
		if(rand<3)

			camera.rotation.x=camera.rotation.x+rot;
		//else if(rand<2)

		//	camera.rotation.y=camera.rotation.y+rot;
		//else if(rand<3)
			//camera.rotation.z=camera.rotation.z+rot;
		else if (rand<4.5)
			camera.position.z-=20;
		else
			camera.position.z+=5;

//camera.rotation.x=camera.rotation.x+rot;
	}
//renderer.render( scene, camera );
composer.render(.1);

}

function drawWaves(){
	var line, lineColor, hslValues;

	//set the material color. UPDATE TO GET NEON COLOUR

     for(var n=0; n<20;n++){
          var geometry = new THREE.Geometry();
          var material = new THREE.LineBasicMaterial({
			  color: getNeonColor(),
			  opacity:.7
		});

     for(var i=0;i<1200;i++){
     	
	 		geometry.vertices.push(new THREE.Vector3(-1000+i, 100*n-600, 500));
	 	}
	 	var line = new THREE.Line(geometry, material);
	      scene.add(line);
      lines.push(line);
	 }
	 
	 
	var imgMaterial2 = new THREE.MeshBasicMaterial( { 
					color:'blue'
				} );

				//create cube
				var geometry = new THREE.CubeGeometry(1000, 1000, 1000);
				cube = new THREE.Mesh(geometry, imgMaterial2);
				scene.add(cube);
				      
     //composer.render(.1);

  //  renderer.render(scene, camera);

}


function loadWaves() {
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initSound();
}

/*
//___________________________________________________________________________________
// the main three.js components
var camera, scene, renderer, ticks

lines = [];
var width = $(window).width()
var height = $(window).height()

var aspect = width/height;
var near = 1;
var far = 1000;
var angle = 45;


function WavesInit() {
	ticks=0;
	initCanvas();
//	$('canvas').remove();
//	$('#screen').append('<div id="container"></div');
	
 camera = new THREE.PerspectiveCamera(
        angle, aspect, near, far);    
	camera.position.z = 800;
	camera.position.y=100;
	camera.position.x=900;
	camera.rotation.x=0;
	camera.rotation.y=0;
	camera.rotation.z=0;
	camera.position.set( -50, 80, 80 );
    camera.lookAt(new THREE.Vector3( 100, 0, -10 ));
	scene = new THREE.Scene();
	
	light = new THREE.PointLight(0xFFFFFF);
    light.position.x=0;
    light.position.y=0;
    light.position.z=100;
    
	//scene.add(camera);
	scene.add(light);

	//renderer = new THREE.CanvasRenderer({ canvas : canv });
	 renderer =  new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth,window.innerHeight );

	//	2drawWaves();
	//createWell();
	drawWaves();
}

// the main update function, called 30 times a second

function WaveUpdate(visArray, waveArray, beat) {
		ticks++;
	

}

function drawWaves(){
	var line, lineColor, hslValues;
		
     for(var n=0; n<1;n++){
           var points = [];

		for(var i=0;i<1200;i++){
	 		points.push(new THREE.Vector3(i, 0, 0));
	 	}
	 
	 	var spline =	new THREE.SplineCurve3(points);
	 	var geometry= new THREE.TubeGeometry(spline, 150,3, 200,false,false);    
	 	var material = 
        new THREE.MeshLambertMaterial(
            {
                color:getNeonColor(),
                side: THREE.DoubleSide,
                wireframe:true
            });
		var tube = new THREE.Mesh(geometry,material);
   	obj = new THREE.Object3D();
	obj.add(tube);

	//	scene.add(obj);
	 }
  //  renderer.render(scene, camera);
	//$("#container").append(renderer.domElement);
	
	var line, lineColor, hslValues;

	//set the material color. UPDATE TO GET NEON COLOUR

     for(var n=0; n<20;n++){
          var geometry = new THREE.Geometry();
          var material = new THREE.LineBasicMaterial({
			  color: getNeonColor(),
			  opacity:.7
		});

     for(var i=0;i<1200;i++){
     	
	 		geometry.vertices.push(new THREE.Vector3(-1000+i, 100*n-600, 500));
	 	}
	 	var line = new THREE.Line(geometry, material);
	 	  scene.add(line);
      lines.push(line);
	 }

     
    renderer.render(scene, camera);
}

function drawParticleWaves(){
	var counter = new SPARKS.SteadyCounter(500);
	var emitter = new SPARKS.Emitter(counter);
	emitter.start();
	emitterpos = new THREE.Vector3( 0, 0, 0 );
	emitter.addInitializer( new SPARKS.Position( new SPARKS.PointZone( emitterpos ) ) );
	emitter.addInitializer( new SPARKS.Lifetime( 1, 15 ));
	var vector = new THREE.Vector3( 0, -5, 1 );
	emitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( vector ) ) );
	emitter.addAction( new SPARKS.Age() );
	emitter.addAction( new SPARKS.Accelerate( 0, 0, -50 ) );
	emitter.addAction( new SPARKS.Move() );
	emitter.addAction( new SPARKS.RandomDrift( 90, 100, 2000 ) );
}


function createWell(){
	 var points1 = [];

	
    points1.push(
        new THREE.Vector3(0,0,0));
    points1.push(
        new THREE.Vector3(0,-40,0));
    points1.push(
        new THREE.Vector3(10,-60,0));
	points1.push(
        new THREE.Vector3(50,-80,0));
    points1.push(
        new THREE.Vector3(100,-80,0));
    points1.push(
        new THREE.Vector3(200,-80,0));

	var path1 = 
        new THREE.SplineCurve3(points1);

    var geometry1 = 
        new THREE.TubeGeometry(path1, 150, 4, 100,
                               false, true);
    
    var material = 
        new THREE.MeshLambertMaterial(
            {
                color:0x0000ff,
                side: THREE.DoubleSide,
                wireframe:true
            });
    
    var tubeMesh1 = new THREE.Mesh(
        geometry1,material);
    
    var points2 = [];

    points2.push(
        new THREE.Vector3(0,0,0));
    points2.push(
        new THREE.Vector3(0,-40,0));
    points2.push(
        new THREE.Vector3(10,-60,0));
	points2.push(
        new THREE.Vector3(50,-80,0));
    points2.push(
        new THREE.Vector3(100,-80,0));
    points2.push(
        new THREE.Vector3(200,-80,-30));
	var path2 =  
        new THREE.SplineCurve3(points2);

    var geometry2 = 
        new THREE.TubeGeometry(path2, 150, 4, 100,
                               false, true);
    
    
    var tubeMesh2 = new THREE.Mesh(
        geometry2,material);
    tubeMesh2.rotation.y=0.5;
    var well = new THREE.Object3D();
    well.add(tubeMesh1);
    well.add(tubeMesh2);
    return well;
  
}


function loadWaves() {
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initSound();
}*/
