// the main three.js components
var camera, scene, renderer, ticks

lines = [];


function WavesInit() {
	ticks=0;
	initCanvas();

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

	renderer = new THREE.CanvasRenderer({ canvas : canv });
	renderer.setSize( canv.width, canv.height );

	drawWaves();
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
renderer.render( scene, camera );

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
	 //var spline =	new THREE.SplineCurve3(geometry, material);
	 //new tugeGeometry(spline curve, number of segments, radius, radius segments, closed, debug), 2, 
	// var line= new THREE.TubeGeometry(spline, 1, 10, false,false );
    // parent = new THREE.Object3D();

	/* tubeMesh = THREE.SceneUtils.createMultiMaterialObject( line, 										new THREE.MeshBasicMaterial({
					color: 0x000011,
					opacity: 1,
					wireframe: true,
					//transparent: true
			}));
			*/
     //parent.add(tubeMesh);
      //scene.add(parent);
      scene.add(line);
      lines.push(line);
	 }

     
    renderer.render(scene, camera);
		
}


function loadWaves() {
	initGraphics = WavesInit;
	updateGraphics = WaveUpdate;
	initSound();
}