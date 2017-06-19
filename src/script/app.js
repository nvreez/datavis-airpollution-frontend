import { initLocationSelect } from './locationSelect';
import lineGraph from './charts/lineGraph';
import barChart from './charts/barChart';

window.config = {
  locs: [],
  colorScale: d3.scaleLinear()
    .domain([0, 4, 7, 10, 11])
    .range(["#00BAC4", "#ffff8c", "#d7191c", "#63008C", "#5D0021"])
    .interpolate(d3.interpolateHcl),
  api: "http://127.0.0.1:8088/api/",
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


function dateType(d) {
  for (var i = d.length - 1; i >= 0; i--) {
    var hour = ("0" + d[i].startHour).slice(-2);
    d[i].date = new Date(d[i].startDate + "T" + hour + ":00:00");
  }
  return d;
}

