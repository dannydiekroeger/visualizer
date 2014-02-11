
function initNeon(){
		initSVG();
	   var svgContainer = d3.select("svg")
	   //var rect = svgContainer.append("rect").attr("x",400).attr("y",200).attr("width", 50).attr("height", 50).style("fill", "#FF00FF");
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
	//circle.data(array).transition().attr("r", function(d){
	//	return d;	
	//});*/
	/*8var square = d3.select("rect");
	if(beat){
		square
		.style("fill", "#00FFFF");
	}else{
		square
		.style("fill", "#FF00FF")

	}*/
	
	var amp=getTotalAmplitude(freqArray);
	var maxScale = 95555;
	var percent = amp/maxScale;
	var maxRad = 4;
	var radius = maxRad*amp/maxScale;
	for(var i=0; i< freqArray.length; i+=2){
	var fillColor=getNeonColor()
/*
	d3.select("svg")
		.append("circle")
		.attr("cx", i)
		.attr("cy", freqArray[i])
		.attr("r",radius)
		.style("fill-opacity", .4)
		.style("stroke", fillColor)
		.style("fill", fillColor)
		.transition()
		.duration(50)
		//.style("stroke-opacity",1e-6)
		.remove(); */
	}
	
	for(var i=0; i< waveArray.length; i++){
		var fillColor=getNeonColor()
		d3.select("svg")
		.append("circle")
		.attr("cx", i)
		//.attr("cy", waveArray[i]+200)
		.attr("cy", waveArray[i])
		.attr("r", 2)
		.style("fill-opacity", .4)
		.style("stroke", fillColor)
		.style("fill", fillColor)
		.transition()
		.duration(50)
		.ease(Math.sqrt)
		.style("stroke-opacity",1e-6)
		.remove();
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

function getNeonColor(){
	var rand = Math.floor(Math.random()*100)/100
	var numNeon = 7
	if(rand< numNeon/100) return "#6FFF00" //Neon Green:
	if (rand<2*numNeon/100) return "#FF00FF" //Neon Pink: 
if (rand<3*numNeon/100) return "#FFFF00" ////Neon Yellow:
 if (rand<4*numNeon/100) return "#00FFFF" // "#4D4DFF" ////Neon Blue:
 if (rand<5*numNeon/100) return "#FE0001" ////Neon Red:
 if (rand<6*numNeon/100) return"#FF4105" //Neon Orange:
else return "#993CF3" //Neon Purple: 
}

function loadNeon() {
	initGraphics = initNeon;
	updateGraphics = drawNeon;
	initSound();
}

 