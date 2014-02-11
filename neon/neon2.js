 var t;
var freqTimeArr;
var time;
var duration = 750;
var xstart=0;
var xfinish=1024;

var m = [80, 80, 80, 80]; // margins
		var w = 1000 - m[1] - m[3]; // width
		var h = 400 - m[0] - m[2];
 var x = d3.scale.linear().domain([xstart, xfinish]).range([0, w]);
 var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
var line = d3.svg.line()
.x(function(d,i) { 
				// verbose logging to show what's actually being done
				console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
				// return the X coordinate where we want to plot this datapoint
				return x(i); 
			})
	.y(function(d) { 
				// verbose logging to show what's actually being done
				console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
				// return the Y coordinate where we want to plot this datapoint
				return y(d); 
			})
var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
     
function initNeon2(){
		initSVG();
	   t = -1;
	   var svgContainer = d3.select("svg");
	   freqTimeArr = new Array();
	   for(var i=0; i<1024; i++){
		  
		   freqTimeArr[i]=0;
	   }
	  svgContainer.append("svg:g")
			      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
			      
	 svgContainer.append("svg:g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis);
		var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
			// Add the y-axis to the left
			svgContainer.append("svg:g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(-25,0)")
			      .call(yAxisLeft);
	svgContainer.append("svg:path").attr("d", line(freqTimeArr));
			
}

function loadNeon2() {
	initGraphics = initNeon2;
	updateGraphics = drawNeon2;
	initSound();
}

function drawNeon2(freqArray, waveArray, beat){
	console.log("here");
	d3.select("svg").append("svg:path").attr("d", line(waveArray));
	/*for(var i=0; i< freqArray.length; i+=2){
		freqTimeArr.push(freqArray[i]);
		freqTimeArr.shift();
	} */
	 
  /*d3.select("svg")
	.append("line")
	.attr("x1",40)
	.attr("y1",50)
	.attr("x2",100)
	.attr("y2",150)
	.style("stroke", "rgb(100,100,100)");*/
	
	

}	
