var locations = ['central_western', 'eastern', 'kwun_tong', 'sham_shui_po', 'kwai_chung', 'tsuen_wan', 'tseung_kwan_o', 'yuen_long', 'tuen_mun', 'tung_chung', 'tai_po', 'shatin', 'tap_mun', 'causeway_bay', 'central', 'mong_kok'];
var colors = ["#83E827", "#3DBA32", "#03943B", "#FFD91B", "#FFA51C", "#FC7D1F", "#E91B33", "#B6005C", "#88007D", "#63008C", "#5D0021"];

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 1280 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var n = 24; // n-period of moving average
var k = 2;  // k times n-period standard deviation above/below moving average

// var parseDate = d3.time.format("%m/%d/%Y").parse;

var x = d3.scaleTime()
        .range([0, width]);
var y = d3.scaleLinear()
        .domain([0, 11])
        .range([height, 0]);


var xAxis = d3.axisBottom()
    .scale(x);
var yAxis = d3.axisLeft()
    .scale(y)
    .tickSize(3, 0);


var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.central); });
var ma = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.ma); });
var lowBand = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.low); });
var highBand = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.high); });
var bandsArea = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.low); })
        .y1(function(d) { return y(d.high); });

var svg = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("201705_Eng_clean.csv", type, function(error, data) {
    var bandsData = getBollingerBands(n, k, data);

    x.domain(d3.extent(data, function(d) { return d.date; }));

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    svg.append("path")
            .datum(bandsData)
            .attr("class", "area bands")
            .attr("d", bandsArea);
    svg.append("path")
            .datum(bandsData)
            .attr("class", "line bands")
            .attr("d", lowBand);
    svg.append("path")
            .datum(bandsData)
            .attr("class", "line bands")
            .attr("d", highBand);

    svg.append("path")
            .datum(bandsData)
            .attr("class", "line ma bands")
            .attr("d", ma);

    // Add the scatterplot
    svg.selectAll("circle")
      .data(data)
      .enter().append("circle")
        .attr("class", "scatterplot dot")
        .attr("r", 1)
        .attr("cx", function(d) {
          return x(d.date); })
        .attr("cy", function(d) { return y(d.central); });
});


function getBollingerBands(n, k, data) {
  var bands = []; //{ ma: 0, low: 0, high: 0 }
  for (var i = 1, len = data.length; i < len; i++) {
    var slice = data.slice(Math.max(i + 1 - n, 0), i);
    var mean = d3.mean(slice, function(d) { return d.central; });
    var min = d3.min(slice, function(d) { return d.central; });
    var max = d3.max(slice, function(d) { return d.central; });
    var qlow = d3.quantile(slice, 0.25, function(d) { return d.central; });
    var qhigh = d3.quantile(slice, 0.75, function(d) { return d.central; });
    var avHigh = d3.mean(slice.filter(function(d) {
      return d.central > mean;
    }), function(d) { return d.central; }) || mean;
    var avLow = d3.mean(slice.filter(function(d) {
      return d.central < mean;
    }), function(d) { return d.central; }) || mean;
    var stdDev = Math.sqrt(d3.mean(slice.map(function(d) {
      return Math.pow(d.central - mean, 2);
    })));
    bands.push({ date: data[i].date,
     ma: mean,
     min: min,
     max: max,
     // low: qlow,
     // high: qhigh});
     // low: avLow,
     // high: avHigh});
     low: mean - (k * stdDev),
     high: mean + (k * stdDev) });
  }
  return bands;
}


function type(d) {
  for (var i = locations.length - 1; i >= 0; i--) {
    d[locations[i]] = +d[locations[i]];
  }
  d.date = new Date(d.rdate + "T" + d.rhour + ":00:00");
  d.rhour = +d.rhour;
  d.rdate = new Date(d.rdate);
  return d;
}

function offset(count, height) {
  return count * height + count;
}
