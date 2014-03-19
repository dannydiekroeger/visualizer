/*********************************************
 *
 * Donut World
 *
 * -------------------------------------------
 *
 * A test world for webgl rendering. A series
 * of toruses are rendered, similar to the 
 * children stacking ring toy. Toruses are 
 * colored in a rainbow scheme.
 *
 * Variations available.
 *
 *********************************************/


// the main three.js components

var cameraTorus, sceneTorus, rendererTorus;
var lookAtTorus = new THREE.Vector3(0, 0, 0);
var yUpTorus = new THREE.Vector3(0, 1, 0);	// used as a vector in the xy plane for up vector calculations

// Phong lights

var ambLightTorus = new THREE.AmbientLight( 0x404040 );

var dirLightTorus = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLightTorus.position.set( 0, 0, 1 );

var pntLightTorus = new THREE.PointLight( 0xffffff, 1, 0 );
pntLightTorus.position.set( 0, 0, 0 );
var plFramesTorus = 0;
var plFramesMaxTorus = 3;

// an array to store our materials in

var torusMaterials = [];

var torusDftOpacity = 0.7;
var torusDftTransparency = true;

// an array to store our toruses in

var toruses = [];
var torusParms = [];

var numTorus = 16;
var cameraDistanceTorus = 1200;

var moveCamera = 2.0;

var doValue = 0;



/****************************************
 *
 * The load function for Donuts.
 *
 * Type set for variation availablity.
 *
 ***************************************/

function loadDonuts(type) {
	doValue = type;
	initGraphics = DonutInit;
	updateGraphics = DonutUpdate;
	initSound();
}



/****************************************
 *
 * The init function for Donuts.
 *
 ***************************************/

function DonutInit() {
	initCanvasWebGL();
	initTorus();
}



/****************************************
 *
 * The update function for Donuts.
 *
 ***************************************/

function DonutUpdate(visArray, waveArray, beat) {

	if ((moveCamera > 0 && cameraTorus.position.z == cameraDistanceTorus) || (moveCamera < 0 && cameraTorus.position.z == -cameraDistanceTorus)) moveCamera = -moveCamera;

	updateCameraParmsTorus(moveCamera);

	updateToruses(visArray, beat);

	// render the scene from the new perspective of the camera
	rendererTorus.render( sceneTorus, cameraTorus );
}



/****************************************
 *
 * Called by: DonutInit
 *
 * Setup donut world.
 *
 ***************************************/ 

function initTorus() {

	// Camera parameters : field of view, aspect ratio for render output, near and far clipping plane. 
	cameraTorus = new THREE.PerspectiveCamera(80, canvWebGL.width / canvWebGL.height, 1, 10000 );

	// move the camera backwards so we can see stuff! 
	// default position is 0,0,0. 
	updateCameraParmsTorus(cameraDistanceTorus);	

	// the scene contains all the 3D object data
	sceneTorus = new THREE.Scene();

	// add camera and lights to the scene 
	sceneTorus.add(cameraTorus);

	sceneTorus.add(ambLightTorus);
	sceneTorus.add(dirLightTorus);
	sceneTorus.add(pntLightTorus);

	// Create the WebGLRenderer using the existing WebGL canvas

	rendererTorus = new THREE.WebGLRenderer({canvas: canvWebGL});
	rendererTorus.setSize( canvWebGL.width, canvWebGL.height );

	// build the torus set
	makeToruses(); 
 
	// display the initial torus set
	rendererTorus.render( sceneTorus, cameraTorus );
}



/****************************************
 *
 * Called by: DonutUpdate
 *
 * Set camera up vector and evoke lookAt to
 * recalculate camera values. DeltaZ is 
 * the change to the camera Z coordinate.
 * The camera X coordinate is calculated
 * to simulate a globe effect where
 * the camera rests on a globe with the 
 * scene inside. The globe is rotated
 * so that the view ranges from the top 
 * to the bottom of the globe.
 *
 ***************************************/ 


function updateCameraParmsTorus(deltaZ) {

	cameraTorus.position.z += deltaZ;
	if (cameraTorus.position.z > cameraDistanceTorus) {
		cameraTorus.position.z = cameraDistanceTorus;

	}
	if (cameraTorus.position.z < -cameraDistanceTorus) {
		cameraTorus.position.z = -cameraDistanceTorus;

	}


	cameraTorus.position.x = Math.sqrt((cameraDistanceTorus * cameraDistanceTorus) - (cameraTorus.position.z * cameraTorus.position.z));
	var upVector = new THREE.Vector3();
	upVector.copy(cameraTorus.position);
	upVector.cross(yUpTorus).normalize();
	
	cameraTorus.up = upVector;
	cameraTorus.lookAt(lookAtTorus); // set to be looking at the origin
}



/****************************************
 *
 * Called by: initTorus
 *
 * Create the toruses and load them into
 * toruses array.
 *
 ***************************************/ 

function makeToruses() { 
	var torus, material, torusColor, hslValues, opacity, transparent;
	var radius, tube;
	var colorDelta = 1 / numTorus;
	var maxHeight = canvWebGL.height / 2;

	toruses.splice(0, toruses.length);
	torusMaterials.splice(0, torusMaterials.length);
	torusParms.splice(0, torusParms.length);


	for ( var m = 0; m < numTorus; m++) {
		var hue = m * colorDelta;
		hslValues = {h:hue, s:0.5, l:0.5};
		torusColor = new THREE.Color().setHSL(hue, 0.5, 0.5);

		if(doValue == 0 && m != 0) {
			opacity = torusDftOpacity;
			transparent = torusDftTransparency;
		} else {
			opacity = 1.0;
			transparent = false;
		}
		
		//material = new THREE.MeshPhongMaterial( { color: torusColor, ambient: torusColor, overdraw: 0.5 } );
		material = new THREE.MeshPhongMaterial( { color: torusColor, ambient: torusColor, opacity: opacity, transparent: transparent, overdraw: 0.5 } );
		torusMaterials.push(material);
	}

	for ( var m = 0; m < numTorus; m++ ) {
		material = torusMaterials[m];

		// make the torus
		var temp = Math.floor(m / 2);
		if (m == temp * 2) {
			temp = temp * (m + 1);
		} else {
			temp = (temp + 1) * m;
		}
		radius = 20 + (temp * 4) + (m * 8);
		tube = 5 + (m * 2);
		torus = new THREE.TorusGeometry(radius, tube, 8, 8);
		torus = new THREE.Mesh(torus, material);

		// add it to the scene
		sceneTorus.add( torus );

		// and to the array of toruses. 
		toruses.push(torus); 

		var maxZ = maxHeight - tube;
		var minZ = -maxZ;
		var speed = numTorus - m;	// move the smaller toruses faster
		if(doValue == 0) speed = (maxZ - minZ) / 256;
		var torusParm = {maxZ: maxZ, minZ: minZ, speed: speed, dir: 1};
		torusParms.push(torusParm);
	}
}



/****************************************
 *
 * Called by: DonutUpdate
 *
 * Toruses move along the z axis.
 * If doValue is 1 they move dependent 
 * their size. If do value is 0 they
 * move based on an average of the
 * frequency array.
 *
 ***************************************/ 

function updateToruses(visArray, beat) { 

	var dirReversed;
	var interpSizeTorus = visArray.length / toruses.length;
	//interpSizeTorus = (visArray.length) / (toruses.length + 2.0);		
	var interpStartTorus = 0;						
	var interpEndTorus = interpSizeTorus;
	var valueTorus;

	plFramesTorus += 1;

	// iterate through every torus
	for(var i = 0; i < toruses.length; i++) {


		var torus = toruses[i];
		dirReversed = false;

		if (doValue == 0) {
	
			valueTorus = 0;
			for (var j = interpStartTorus; j < interpEndTorus; j++) {		
				valueTorus += visArray[j];				
			}
			valueTorus /= interpSizeTorus;
			valueTorus -= 128; //this will allow it to move up and down
			
			torus.position.z = valueTorus * torusParms[i].speed;
			
			interpStartTorus += interpSizeTorus;				
			interpEndTorus += interpSizeTorus;

		}
		
		if (doValue == 1) {
			torus.position.z +=  torusParms[i].speed * torusParms[i].dir;

			// if the torus is too close move it to the back
			if((torus.position.z > torusParms[i].maxZ) || (torus.position.z < torusParms[i].minZ)) {
				torusParms[i].dir = -torusParms[i].dir;
				torus.position.z +=  torusParms[i].speed * torusParms[i].dir;
				dirReversed = true;
			}
		}

	}

	if(beat) sceneTorus.add(pntLightTorus);
	else sceneTorus.remove(pntLightTorus);

}


