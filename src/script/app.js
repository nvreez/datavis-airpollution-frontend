import { initLocationSelect } from './locationSelect';
import lineGraph from './charts/lineGraph';

window.config = {
  locs: [],
  colors: ["#83E827", "#3DBA32", "#03943B", "#FFD91B", "#FFA51C", "#FC7D1F", "#E91B33", "#B6005C", "#88007D", "#63008C", "#5D0021"],
  api: "http://127.0.0.1:8088/api/",
  loc: "central",

  n: 24, // n-period of moving average
  k: 2 // k times n-period standard deviation above/below moving average
};

d3.json(config.api + "locations", function(error, data) {
  config.locs = data.map(d => { return d.name });
  config.loc = config.locs[0] || config.loc;

  initLocationSelect(config.locs);
});

d3.json(config.api + "pollution-records?from=20160601&to=20170501&granularity=1", function(error, data) {
  data = dateType(data);

  lineGraph(data, config.loc);
});


function dateType(d) {
  for (var i = d.length - 1; i >= 0; i--) {
    var hour = ("0" + d[i].startHour).slice(-2);
    d[i].date = new Date(d[i].startDate + "T" + hour + ":00:00");
  }
  return d;
}

