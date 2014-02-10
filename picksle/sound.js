//------------ Use this portion -------------------------------//
// How to implement your custom graphics:
// 1. Create a javascript file and link it in sound.html (see how
// mygraphics.js is linked for an example). Define your functions in here.
//
// 2. Set initGraphics to equal the name of your init function.
// No parameters are taken, see mygraphics.js for example.
var initGraphics = initPicksle;

// 3. Set updateGraphics to equal the name of your update function.
// This function must take in a single parameter "array" which is
// the frequency array bin.
// see mygraphics.js for example.
var updateGraphics = updatePicksle;

// ------------------------------------------------------------//


// You can basically ignore everything below here //


//         
//     |---|   |---| 
//
//          ||
//
//   __-           ---
//     ---      ---
//       --------
//


// create the audio context (chrome only for now)
// create the audio context (chrome only for now)
    if (! window.AudioContext) {
        if (! window.webkitAudioContext) {
            alert('no audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }
var context = new AudioContext();
var audioBuffer;
var sourceNode;
var analyser;
var javascriptNode;
var canv = document.getElementById("canvas");
var ctx = canv.getContext("2d");


initGraphics();
initNavigator();

	function updateVisualization() {
	    // get the average for the first channel
	    var array =  new Uint8Array(analyser.frequencyBinCount);
	    analyser.getByteFrequencyData(array);
	    // clear the current state
	    //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	    // set the fill style
	    //ctx.fillStyle=gradient;
	    updateGraphics(array);
	    rafID = window.requestAnimationFrame(updateVisualization);
	}
	
	function playClick() {
		inputtype = "play"
		clearNodes();
		setupAudioNodes();

		// when the javascript node is called
    	// we use information from the analyzer node
    	// to draw the volume
    	
    	////javascriptNode.onaudioprocess = updateVisualization
    	loadSound("../satisfy.mp3");
	}
	
	function initNavigator() {
		if (!!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
	            navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
			
			//handle different types navigator objects of different browsers
			navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia ||navigator.msGetUserMedia;
	            }
	}
	
	function microClick() {
		//capturing input of the micropone
		navigator.getUserMedia({audio: true, video: false}, 
				//success
				handleMicrophoneInput, 
					//failed	
				function () {
					console.log('capturing microphone data failed!');
					console.log(evt);
				}
		);
	}
	function handleMicrophoneInput (stream) {
		clearNodes();
		//convert audio stream to mediaStreamSource (node)
		microphone = context.createMediaStreamSource(stream);
		//create analyser
	  	if (analyser == null) analyser = context.createAnalyser();
	  	//connect microphone to analyser
	    microphone.connect(analyser);
	    //start updating
		rafID = window.requestAnimationFrame( updateVisualization );
	}
    function clearNodes() {
    	if (sourceNode) {
    		sourceNode.stop(0);
    	}
    	analyser = null;
    	sourceNode = null;
    }
    
    function setupAudioNodes() {
        analyser = context.createAnalyser();
        sourceNode = context.createBufferSource();
        sourceNode.connect(analyser);
        sourceNode.connect(context.destination);
        rafID = window.requestAnimationFrame(updateVisualization);
    }

    // load the specified sound
    function loadSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = function() {

            // decode the data
            context.decodeAudioData(request.response, function(buffer) {
                // when the audio is decoded play the sound
                playSound(buffer);
            }, onError);
        }
        request.send();
    }

    function playSound(buffer) {
        sourceNode.buffer = buffer;
        sourceNode.start(0);
    }

    // log if an error occurs
    function onError(e) {
    	console.log("error");
        console.log(e);
    }

	function drawCircles(array) {
		
		var x = 0;
        for ( var i = 0; i < (array.length); i++ ){
            var sum = 0;
            for (var j = i; j<i+array.length/7; j++) {
            	var value = array[i];
            	sum += value
            }
            rad = sum*200/10000;
			drawOneCircle(x, rad);
			i = j;
			x += 1;
        }
        
		
	}
	





	
	
	
