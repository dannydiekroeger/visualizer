// the main three.js components
var camera, scene, renderer,

// to keep track of the mouse position
//mouseX = 0, mouseY = 0,

materials = [];
particles = [];
hslBase = [];
hslParticles = [];

// if true, calculate hsl from material color; else, use base values
calchsl = false;

zMoveConst = 200; //remove mouse dep
StarBeatTime = 0;

StarTotalAmp = 0;

function StarInit() {

	initCanvas();

	camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 4000 );

	camera.position.z = 1000;

	scene = new THREE.Scene();

	scene.add(camera);

	renderer = new THREE.CanvasRenderer({ canvas : canv });
	renderer.setSize( canv.width, canv.height );

	makeStarParticles(); 

}

// the main update function, called 30 times a second

function StarUpdate(visArray, waveArray, beat) {
	
	getTotalAmpStar(visArray);
	
	updateStarParticles(beat);

	renderer.render( scene, camera );

}

// creates a random field of Particle objects
function makeStarParticles() { 

	var particle, material, particleColor, hslValues;


	for ( var m = 0; m < 20; m++) {
		var hue = Math.random();
		hslValues = {h:hue, s:0.1, l:0.5, lh:hue, ls:0.1, ll:0.5};
		hslBase.push(hslValues);
		particleColor = new THREE.Color().setHSL(hue, .1, .5);
		material = new THREE.SpriteCanvasMaterial( { color: particleColor, program: StarParticleRender } );
		materials.push(material);
	}

	// we're gonna move from z position -1000 (far away) 
	// to 1000 (where the camera is) and add a random particle at every pos. 
	for ( var zpos= -1000; zpos < 1000; zpos+=20 ) {

		// we make a particle material and pass through the 
		// colour and custom particle render function we defined.
		var iMat = ((zpos + 1000) / 20) % 20;


		material = materials[iMat];

		// make the particle
		particle = new THREE.Sprite(material);

		// save the base hsl values
		hslValues = hslBase[iMat];
		hslParticles.push(hslValues);

		// give it a random x and y position between -500 and 500
		particle.position.x = Math.random() * 1000 - 500;
		particle.position.y = Math.random() * 1000 - 500;

		// set its z position
		particle.position.z = zpos;

		// scale it up a bit
		particle.scale.x = particle.scale.y = 10;

		// add it to the scene
		scene.add( particle );

		// and to the array of particles. 
		particles.push(particle); 
	}


}

// there isn't a built in circle particle renderer 
// so we have to define our own. 

function StarParticleRender( context ) {

	context.beginPath();
	context.arc( 0, 0, 1, 0,  Math.PI * 2, true );
	context.fill();
};

function getTotalAmpStar(visArray) {
	StarTotalAmp = 0;
	for(var j = 0; j < visArray.length; j++) {
		StarTotalAmp += visArray[j];
	}
	StarTotalAmp /= visArray.length;
}



// moves all the particles dependent on mouse position
function updateStarParticles(beat) { 
	var hsl;
	if(beat) { StarBeatTime = 3; }

	// iterate through every particle
	for(var i=0; i<particles.length; i++) {

		particle = particles[i]; 
 
		
		particle.position.z +=  StarTotalAmp * 0.1;

		// if the particle is too close move it to the back
		if(particle.position.z>1000) particle.position.z-=2000;


		if(StarBeatTime == 0) {
			// set luminosity to range .1 to .9 as sprite gets nearer to viewer
			if (calchsl) {
			hsl = particle.material.color.getHSL();
			} else {
			hsl = hslParticles[i];
			}


			hsl.s = (Math.round((particle.position.z + 1000) / 250)) / 10 + .1;
			//hsl.l = (Math.round((particle.position.z + 1000) / 250)) / 10 + .1;
			particle.material.color.setHSL(hsl.h, hsl.s, hsl.l);
	
			hsl.lh = hsl.h;
			hsl.ls = hsl.s;
			hsl.ll = hsl.l;
		} else {
			particle.material.color.setHSL(360, 1, 1);
		}

	}
	if(StarBeatTime > 0) { StarBeatTime--; }

}


function loadStarParticles() {
	initGraphics = StarInit;
	updateGraphics = StarUpdate;
	initSound();
}