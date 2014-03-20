//variables to draw the exploding flowers
var flowerSize= 60;
var initFlowerRadius = 2;
var explosionDuration = 400;
var circleDilution = 10;

//initialize the neon flower scene
//this scene uses the d3 library 
function initNeon(){
	//inits a new svg canvas for use with d3
	initSVG();
	var svgContainer = d3.select("svg")
	var currentGenre;
	  /* function mycallback() { 
		   currentGenre="katie"
		   currentGenre = ID3.getTag(song, "genre");
		};
		ID3.loadTags(song,mycallback);*/
		//console.log(currentGenre);
}

//the main update function for this scene, called 30 times per second
//draws an expanding flower if there is a beat
//draws all 8 circles and sets their movement in the shape of a circle around the initial point

function drawNeon(freqArray, waveArray, beat){
	var amp=getTotalAmplitude(freqArray);
	var maxScale = 95555;
	var percent = amp/maxScale;
	//the maximum radius of each circle
	var maxRad = 15;
	//each circle's radius is dependent on the current amplitude of the sound
	var radius = maxRad*amp/maxScale;
	
	if(beat){
		//flower is drawn at random x and y location on the screen
		var x =  Math.random() * (canvasWidth - 0) + 0;
		var y =  Math.random() * (canvasHeight - 0) + 0;
				
		//up
		var fillColor=getNeonColor()		
		d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cy", y+flowerSize)
			.attr("r",radius)
			.remove()
	
	//down
		var fillColor=getNeonColor()
		d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("r",radius)
			.attr("cy", y-flowerSize)
			.remove()	
			
	//to lower left corner
		var fillColor=getNeonColor()	
		d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cy", y-flowerSize/Math.sqrt(2))
			.attr("cx", x-flowerSize/Math.sqrt(2))
			.attr("r",radius)
			.remove()	
		
		//to lower right corner	
			var fillColor=getNeonColor()
			d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cy", y-flowerSize/Math.sqrt(2))
			.attr("cx", x+flowerSize/Math.sqrt(2))
			.attr("r",radius)
			.remove()
		
		//to upper left corner	
			var fillColor=getNeonColor()
			d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cy", y+flowerSize/Math.sqrt(2))
			.attr("cx", x-flowerSize/Math.sqrt(2))
			.attr("r",radius)
			.remove()
		
		//to upper right corner
			var fillColor=getNeonColor()
			d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cy", y+flowerSize/Math.sqrt(2))
			.attr("cx", x+flowerSize/Math.sqrt(2))
			.attr("r",radius)
			.remove()
			
		//to left
		var fillColor=getNeonColor()
		d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cx", x-flowerSize)
			.attr("r",radius)
			.remove()
			
		//to right
		var fillColor=getNeonColor()
		d3.select("svg")
			.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r",initFlowerRadius)
			.style("fill-opacity", .4)
			.style("stroke", fillColor)
			.style("fill", fillColor)
			.transition()
			.duration(explosionDuration)
			.attr("cx", x+flowerSize)
			.attr("r",radius)
			.remove()
	}
	

}	

// gets total amplitude by summing frequency array
function getTotalAmplitude(array) {
	sum = 0;
	for(var i=0; i<array.length; i++){
		sum += array[i];
	}
	return sum;
}

//randomly returns a neon color. Used by the neon and 3D worlds
function getNeonColor(){
	var numNeon = 7
	var rand = Math.random() * (numNeon - 0) + 0;
	
	if(rand< 1.5) return "#6FFF00" //Neon Green:
	//if (rand<2) return "#ea00ff" //Neon Purple: 
	if (rand<3) return "#F3F315" ////Neon Yellow:
	if (rand<4.5) return "#00FFFF" //  ////Neon Blue:
	if (rand<5) return "#ff0099" ////Neon pink 2:
	if (rand<6) return"#FF6600" //Neon Orange:
	else return "#ff0099" //Neon Pink: 
}

//called when the load neon world is selected
//specifies the init and draw functions for the neon world
function loadNeon() {
	initGraphics = initNeon;
	updateGraphics = drawNeon;
	setupControlPanelNeon();
	initSound();
}

function setupControlPanelNeon() {
	document.getElementById("controlPanelHeader").innerHTML="Neon";
	document.getElementById("controlPanelMessage").innerHTML="Key Commands: none";
}


 