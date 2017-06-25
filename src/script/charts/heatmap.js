var data, svg;

var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
times = d3.range(24);

var margin = {top:40, right:50, bottom:70, left:50};

var w = Math.max(Math.min(window.innerWidth, 1280), 500) - margin.left - margin.right - 20;
var gridSize = Math.floor(w / times.length);
var h = gridSize * (days.length+2);


export default function (d, selector) {
  svg = d3.select(".heatmap")
		.attr("width", w + margin.top + margin.bottom)
		.attr("height", h + margin.left + margin.right)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data = d;

	var dayLabels = svg.selectAll(".dayLabel")
	.data(days)
	.enter()
	.append("text")
	.text(function(d) { return d; })
	.attr("class", "dayLabel")
	.attr("x", 0)
	.attr("y", function(d, i) { return i * gridSize; })
	.style("text-anchor", "end")
	.attr("transform", "translate(-6," + gridSize / 1.5 + ")")

	var timeLabels = svg.selectAll(".timeLabel")
	  .data(times)
	  .enter()
	  .append("text")
	  .text(function(d) { return d; })
	  .attr("class", "timeLabel")
	  .attr("x", function(d, i) { return i * gridSize; })
	  .attr("y", 0)
	  .style("text-anchor", "middle")
	  .attr("transform", "translate(" + gridSize / 2 + ", -6)");

	var nest = d3.nest()
      .key(function(d) { return d.location; })
      .entries(data);

    // return an array of locations in the data
    var locations = nest.map(function(d) { return d.key; });
    var currentLocationIndex = 0;

    // create location dropdown menu
    var locationMenu = d3.select("#locationDropdown");
    locationMenu
      .append("select")
      .attr("id", "locationMenu")
      .selectAll("option")
        .data(locations)
        .enter()
        .append("option")
        .attr("value", function(d, i) { return i; })
        .text(function(d) { return d; });

    // function to create the initial heatmap
    var drawHeatmap = function(location) {

      // filter the data to return object of location of interest
      var selectLocation = nest.find(function(d) {
        return d.key == location;
      });
      // console.log(selectLocation);

      var heatmap = svg.selectAll(".hour")
        .data(selectLocation.values)
        .enter()
        .append("rect")
        .attr("x", function(d) { return (d.hour-1) * gridSize; })
        .attr("y", function(d) { return (d.day-1) * gridSize; })
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("stroke", "white")
        .style("stroke-opacity", 0.6)
        .style("fill", function(d) { return config.colorScale(d.value); })
    }
    drawHeatmap(locations[currentLocationIndex]);

    var updateHeatmap = function(location) {
      // filter data to return object of location of interest
      var selectLocation = nest.find(function(d) {
        return d.key == location;
      });

      // update the data and redraw heatmap
      var heatmap = svg.selectAll(".hour")
        .data(selectLocation.values)
        .transition()
          .duration(500)
          .style("fill", function(d) { return config.colorScale(d.value); })
    }

    // run update function when dropdown selection changes
    locationMenu.on("change", function() {
      // find which location was selected from the dropdown
      var selectedLocation = d3.select(this)
        .select("select")
        .property("value");
      currentLocationIndex = +selectedLocation;
      // run update function with selected location
      updateHeatmap(locations[currentLocationIndex]);
      console.log("currentLocationIndex: " + currentLocationIndex);
    });    

    d3.selectAll(".nav").on("click", function() {
      if(d3.select(this).classed("left")) {
        if(currentLocationIndex == 0) {
          currentLocationIndex = locations.length-1;
        } else {
          currentLocationIndex--;  
        }
      } else if(d3.select(this).classed("right")) {
        if(currentLocationIndex == locations.length-1) {
          currentLocationIndex = 0;
        } else {
          currentLocationIndex++;  
        }
      }
      d3.select("#locationMenu").property("value", currentLocationIndex)
      updateHeatmap(locations[currentLocationIndex]);
      console.log("currentLocationIndex: " + currentLocationIndex);
    })
}