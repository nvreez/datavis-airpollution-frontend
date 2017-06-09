var locations = ['central_western', 'eastern', 'kwun_tong', 'sham_shui_po', 'kwai_chung', 'tsuen_wan', 'tseung_kwan_o', 'yuen_long', 'tuen_mun', 'tung_chung', 'tai_po', 'shatin', 'tap_mun', 'causeway_bay', 'central', 'mong_kok'];

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);

var line = d3.line()
    .x(function(d) { return x(d.rdatetime); })
    .y(function(d) { return y(d.central); });

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("201705_Eng_clean.csv", type, function(error, data) {
  x.domain([d3.min(data, function(d) { return d.rdatetime; }), d3.max(data, function(d) { return d.rdatetime; })]);
  y.domain([0, d3.max(data, function(d) { return d.central; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
console.log("d3.js:41", data);
  chart.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  // chart.selectAll(".bar")
  //     .data(data)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     // .attr("x", function(d) { return x(d.rdatetime); })
  //     .attr("y", function(d) { return y(d.central); })
  //     .attr("height", function(d) { return height - y(d.central); })
  //     .attr("width", x.bandwidth());
});

function type(d) {
  for (var i = locations.length - 1; i >= 0; i--) {
    d[locations[i]] = +d[locations[i]];
  }
  d.rdatetime = new Date(d.rdate + "T" + d.rhour + ":00:00");
  d.rhour = +d.rhour;
  d.rdate = new Date(d.rdate);
  return d;
}

function offset(count, height) {
  return count * height + count;
}
