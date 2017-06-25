import { initLocationSelect } from './locationSelect';
import lineGraph from './charts/lineGraph';
import barChart from './charts/barChart';
import heatmap from './charts/heatmap';

window.config = {
  locs: [],
  // colorScale: d3.scaleLinear()
  //   .domain([0, 4, 7, 10, 11])
  //   .range(["#00BAC4", "#ffff8c", "#d7191c", "#63008C", "#5D0021"])
  //   .interpolate(d3.interpolateHcl),
  colorScale: d3.scaleLinear()
    .domain(d3.range(1, 11, 1))
    .range(["#87cefa", "#86c6ef", "#85bde4", "#83b7d9", "#82afce", "#80a6c2", "#7e9fb8", "#7995aa", "#758b9e", "#708090"]),
  api: "http://139.162.63.93:8088/api/",
  // api: "http://127.0.0.1:8088/api/",
  loc: "central",

  n: 24, // n-period of moving average
  k: 2 // k times n-period standard deviation above/below moving average
};

// http://bl.ocks.org/nbremer/a43dbd5690ccd5ac4c6cc392415140e7


d3.json(config.api + "locations", function(error, data) {
  config.locs = data;
  config.loc = config.locs[0]['name'] || config.loc;

  initLocationSelect(config.locs);
});

d3.json(config.api + "pollution-records?from=20160601&to=20170501&granularity=1", function(error, data) {
  data = dateType(data);

  lineGraph(data, config.loc, ".line-chart");
});

d3.json(config.api + "pollution-records?from=20160601&to=20170501&granularity=24", function(error, data) {
  data = dateType(data);

  barChart(data, config.loc, ".bar-chart");
});

d3.json("./test.json", function(error, data) {
  data.forEach(function(d) {
    d.day = +d.day;
    d.hour = +d.hour;
    d.value = +d.value;
  });

  heatmap(data, ".heatmap");
});

function dateType(d) {
  for (var i = d.length - 1; i >= 0; i--) {
    d[i].date = new Date(d[i].start);
  }
  return d;
}

