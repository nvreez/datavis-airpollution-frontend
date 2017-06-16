import lineGraph from './lineGraph';

window.config = {
  locs: ['centralWestern', 'eastern', 'kwunTong', 'shamShuiPo', 'kwaiChung', 'tsuenWan', 'tseungKwanO', 'yuenLong', 'tuenMun', 'tungChung', 'taiPo', 'shatin', 'tapMun', 'causewayBay', 'central', 'mongKok'],
  colors: ["#83E827", "#3DBA32", "#03943B", "#FFD91B", "#FFA51C", "#FC7D1F", "#E91B33", "#B6005C", "#88007D", "#63008C", "#5D0021"],
  api: "http://127.0.0.1:8088/api/",
  loc: "tungChung",

  n: 24, // n-period of moving average
  k: 2 // k times n-period standard deviation above/below moving average
};



d3.json(config.api + "pollutionRecords?from=20160601&to=20170501&granularity=1", function(error, data) {
  console.log("d3.js:12", data);
  data = dateType(data);

  lineGraph(data);
});


function dateType(d) {
  for (var i = d.length - 1; i >= 0; i--) {
    var hour = ("0" + d[i].startHour).slice(-2);
    d[i].date = new Date(d[i].startDate + "T" + hour + ":00:00");
  }
  return d;
}

