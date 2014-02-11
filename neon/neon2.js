function initNeon2(){
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

function loadNeon2() {
	initGraphics = initNeon;
	updateGraphics = drawNeon;
	initSound();
}

function drawNeon2(freqArray, waveArray, beat){
	/*var circle = d3.select("circle")
	//circle.data(array).transition().attr("r", function(d){
	//	return d;	
	//});*/
	var square = d3.select("rect");
	if(beat){
		square
		.style("fill", "#00FFFF");
	}else{
		square
		.style("fill", "#FF00FF")

	}
	
	var amp=getTotalAmplitude(freqArray);
	var maxScale = 95555;
	var percent = amp/maxScale;
	var maxRad = 2;
	var radius = maxRad*amp/maxScale;
	for(var i=0; i< freqArray.length; i++){
	var fillColor=getNeonColor()

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
		.remove();
	}
	
	for(var i=0; i< waveArray.length; i++){
		var fillColor=getNeonColor()
		d3.select("svg")
		.append("circle")
		.attr("cx", i)
		.attr("cy", waveArray[i]+200)
		.attr("r", 2)
		.style("fill-opacity", .4)
		.style("stroke", fillColor)
		.style("fill", fillColor)
		.transition()
		.duration(50)
		//.ease(Math.sqrt)
		//.style("stroke-opacity",1e-6)
		.remove();
	}

}	
