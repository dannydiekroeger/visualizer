function ParticlesInit() {
	var counter    = new SPARKS.SteadyCounter( 500 );
	var emitter   = new SPARKS.Emitter( counter );
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
function drawParticleWaves(){
}

function loadWaves() {
	initGraphics = ParticlesInit;
	updateGraphics = drawParticleWaves();
	initSound();
}