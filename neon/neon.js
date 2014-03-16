var flowerSize= 60;
var initFlowerRadius = 2;
var explosionDuration = 400;
var circleDilution = 10;

function initNeon(){
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

function drawNeon(freqArray, waveArray, beat){
	/*var circle = d3.select("circle")
	circle.data(array).transition().attr("r", function(d){
		return d;	
	});*/
	
	var amp=getTotalAmplitude(freqArray);
	var maxScale = 95555;
	var percent = amp/maxScale;
	var maxRad = 15;
	var radius = maxRad*amp/maxScale;
	
	if(beat){
		var x =  Math.random() * (canvasWidth - 0) + 0;
		var y =  Math.random() * (canvasHeight - 0) + 0;
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

// a large amplitude is 7 figures
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

function loadNeon() {
	initGraphics = initNeon;
	updateGraphics = drawNeon;
	initSound();
}

 