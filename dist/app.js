/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initLocationSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return locationChange; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observer__ = __webpack_require__(3);


var select = d3.select('#locationSelect').on('change', onchange);

var options = select.selectAll('option');

var locationChange = new __WEBPACK_IMPORTED_MODULE_0__Observer__["a" /* default */]();

function initLocationSelect(data) {
  options.data(data).enter().append('option').attr('value', function (d) {
    return d['name'];
  }).text(function (d) {
    return d['pretty_name'];
  });

  return select;
}

function onchange() {
  config.loc = this.value;

  locationChange.fire(this.value);
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locationSelect__ = __webpack_require__(0);

var data, svg;

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 1280 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().domain([0, 11]).range([height, 0]);

var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y).tickSize(3, 0);

/* harmony default export */ __webpack_exports__["a"] = (function (d, location, selector) {
  svg = d3.select(selector).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data = d;

  x.domain(d3.extent(data, function (d) {
    return d.date;
  }));

  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  svg.append("g").attr("class", "y axis").call(yAxis);

  svg.append("g").selectAll("rect").data(data).enter().append("rect").attr("class", "rect bar color-scale").attr("x", function (d) {
    return x(d.date);
  }).attr("y", function (d) {
    return y(d[location].min) - y(d[location].max) ? y(d[location].max) : y(d[location].max) - 0.5;
  }).attr("height", function (d) {
    return y(d[location].min) - y(d[location].max) || 1;
  }).attr("width", width / data.length).style("fill", function (d) {
    return config.colorScale(d[location].mean);
  });
});

__WEBPACK_IMPORTED_MODULE_0__locationSelect__["b" /* locationChange */].subscribe(update);

function update(location) {
  svg.selectAll("rect").data(data).transition().duration(1000).attr("x", function (d) {
    return x(d.date);
  }).attr("y", function (d) {
    return y(d[location].min) - y(d[location].max) ? y(d[location].max) : y(d[location].max) - 0.5;
  }).attr("height", function (d) {
    return y(d[location].min) - y(d[location].max) || 1;
  }).attr("width", width / data.length).style("fill", function (d) {
    return config.colorScale(d[location].mean);
  });
}

function getBollingerBands(n, k, data, location) {
  var bands = [];
  for (var i = 1, len = data.length; i < len; i++) {
    var slice = data.slice(Math.max(i + 1 - n, 0), i);
    var mean = d3.mean(slice, function (d) {
      return d[location].mean;
    });
    var stdDev = Math.sqrt(d3.mean(slice.map(function (d) {
      return Math.pow(d[location].mean - mean, 2);
    })));
    bands.push({ date: data[i].date,
      mean: mean,
      low: mean - k * stdDev,
      high: mean + k * stdDev });
  }
  return bands;
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locationSelect__ = __webpack_require__(0);

var data, svg;

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 1280 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().domain([0, 11]).range([height, 0]);

var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y).tickSize(3, 0);

var mean = d3.line().x(function (d) {
  return x(d.date);
}).y(function (d) {
  return y(d.mean);
});
var bandsArea = d3.area().x(function (d) {
  return x(d.date);
}).y0(function (d) {
  return y(d.low);
}).y1(function (d) {
  return y(d.high);
});

/* harmony default export */ __webpack_exports__["a"] = (function (d, location, selector) {
  svg = d3.select(selector).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  data = d;

  const bandsData = getBollingerBands(config.n, config.k, data, location);

  x.domain(d3.extent(data, function (d) {
    return d.date;
  }));

  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  svg.append("g").attr("class", "y axis").call(yAxis);

  svg.append("path").datum(bandsData).attr("class", "area bands deviation").attr("d", bandsArea);

  svg.append("path").datum(bandsData).attr("class", "line mean bands").attr("d", mean);

  // Add the scatterplot
  svg.selectAll("circle").data(data).enter().append("circle").attr("class", "scatterplot dot").attr("r", 1).attr("cx", function (d) {
    return x(d.date);
  }).attr("cy", function (d) {
    return y(d[location].mean);
  });
});

__WEBPACK_IMPORTED_MODULE_0__locationSelect__["b" /* locationChange */].subscribe(update);

function update(location) {
  const bandsData = getBollingerBands(config.n, config.k, data, location);

  console.log("yay", svg.select(".deviation"));

  svg.select(".deviation").datum(bandsData).transition().duration(1000).attr("d", bandsArea);

  svg.select(".mean").datum(bandsData).transition().duration(1000).attr("d", mean);

  // Add the scatterplot
  svg.selectAll(".scatterplot").data(data).transition().duration(1000).attr("cx", function (d) {
    return x(d.date);
  }).attr("cy", function (d) {
    return y(d[location].mean);
  });
}

function getBollingerBands(n, k, data, location) {
  var bands = [];
  for (var i = 1, len = data.length; i < len; i++) {
    var slice = data.slice(Math.max(i + 1 - n, 0), i);
    var mean = d3.mean(slice, function (d) {
      return d[location].mean;
    });
    var stdDev = Math.sqrt(d3.mean(slice.map(function (d) {
      return Math.pow(d[location].mean - mean, 2);
    })));
    bands.push({ date: data[i].date,
      mean: mean,
      low: mean - k * stdDev,
      high: mean + k * stdDev });
  }
  return bands;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Observer() {
    this.handlers = []; // observers
}

Observer.prototype = {

    subscribe: function (fn) {
        this.handlers.push(fn);
    },

    unsubscribe: function (fn) {
        this.handlers = this.handlers.filter(function (item) {
            if (item !== fn) {
                return item;
            }
        });
    },

    fire: function (o, thisObj) {
        var scope = thisObj || window;
        this.handlers.forEach(function (item) {
            item.call(scope, o);
        });
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Observer);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locationSelect__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__charts_lineGraph__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__charts_barChart__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__charts_heatmap__ = __webpack_require__(5);





window.config = {
  locs: [],
  // colorScale: d3.scaleLinear()
  //   .domain([0, 4, 7, 10, 11])
  //   .range(["#00BAC4", "#ffff8c", "#d7191c", "#63008C", "#5D0021"])
  //   .interpolate(d3.interpolateHcl),
  colorScale: d3.scaleLinear().domain(d3.range(1, 11, 1)).range(["#87cefa", "#86c6ef", "#85bde4", "#83b7d9", "#82afce", "#80a6c2", "#7e9fb8", "#7995aa", "#758b9e", "#708090"]),
  api: "http://139.162.63.93:8088/api/",
  // api: "http://127.0.0.1:8088/api/",
  loc: "central",

  n: 24, // n-period of moving average
  k: 2 // k times n-period standard deviation above/below moving average
};

// http://bl.ocks.org/nbremer/a43dbd5690ccd5ac4c6cc392415140e7


d3.json(config.api + "locations", function (error, data) {
  config.locs = data;
  config.loc = config.locs[0]['name'] || config.loc;

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__locationSelect__["a" /* initLocationSelect */])(config.locs);
});

d3.json(config.api + "pollution-records?from=20160601&to=20170501&granularity=1", function (error, data) {
  data = dateType(data);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__charts_lineGraph__["a" /* default */])(data, config.loc, ".line-chart");
});

d3.json(config.api + "pollution-records?from=20160601&to=20170501&granularity=24", function (error, data) {
  data = dateType(data);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__charts_barChart__["a" /* default */])(data, config.loc, ".bar-chart");
});

d3.json("./test.json", function (error, data) {
  data.forEach(function (d) {
    d.day = +d.day;
    d.hour = +d.hour;
    d.value = +d.value;
  });

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__charts_heatmap__["a" /* default */])(data, ".heatmap");
});

function dateType(d) {
  for (var i = d.length - 1; i >= 0; i--) {
    d[i].date = new Date(d[i].start);
  }
  return d;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var data, svg;

var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    times = d3.range(24);

var margin = { top: 40, right: 50, bottom: 70, left: 50 };

var w = Math.max(Math.min(window.innerWidth, 1280), 500) - margin.left - margin.right - 20;
var gridSize = Math.floor(w / times.length);
var h = gridSize * (days.length + 2);

/* harmony default export */ __webpack_exports__["a"] = (function (d, selector) {
  svg = d3.select(".heatmap").attr("width", w + margin.top + margin.bottom).attr("height", h + margin.left + margin.right).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data = d;

  var dayLabels = svg.selectAll(".dayLabel").data(days).enter().append("text").text(function (d) {
    return d;
  }).attr("class", "dayLabel").attr("x", 0).attr("y", function (d, i) {
    return i * gridSize;
  }).style("text-anchor", "end").attr("transform", "translate(-6," + gridSize / 1.5 + ")");

  var timeLabels = svg.selectAll(".timeLabel").data(times).enter().append("text").text(function (d) {
    return d;
  }).attr("class", "timeLabel").attr("x", function (d, i) {
    return i * gridSize;
  }).attr("y", 0).style("text-anchor", "middle").attr("transform", "translate(" + gridSize / 2 + ", -6)");

  var nest = d3.nest().key(function (d) {
    return d.location;
  }).entries(data);

  // return an array of locations in the data
  var locations = nest.map(function (d) {
    return d.key;
  });
  var currentLocationIndex = 0;

  // create location dropdown menu
  var locationMenu = d3.select("#locationDropdown");
  locationMenu.append("select").attr("id", "locationMenu").selectAll("option").data(locations).enter().append("option").attr("value", function (d, i) {
    return i;
  }).text(function (d) {
    return d;
  });

  // function to create the initial heatmap
  var drawHeatmap = function (location) {

    // filter the data to return object of location of interest
    var selectLocation = nest.find(function (d) {
      return d.key == location;
    });
    // console.log(selectLocation);

    var heatmap = svg.selectAll(".hour").data(selectLocation.values).enter().append("rect").attr("x", function (d) {
      return (d.hour - 1) * gridSize;
    }).attr("y", function (d) {
      return (d.day - 1) * gridSize;
    }).attr("class", "hour bordered").attr("width", gridSize).attr("height", gridSize).style("stroke", "white").style("stroke-opacity", 0.6).style("fill", function (d) {
      return config.colorScale(d.value);
    });
  };
  drawHeatmap(locations[currentLocationIndex]);

  var updateHeatmap = function (location) {
    // filter data to return object of location of interest
    var selectLocation = nest.find(function (d) {
      return d.key == location;
    });

    // update the data and redraw heatmap
    var heatmap = svg.selectAll(".hour").data(selectLocation.values).transition().duration(500).style("fill", function (d) {
      return config.colorScale(d.value);
    });
  };

  // run update function when dropdown selection changes
  locationMenu.on("change", function () {
    // find which location was selected from the dropdown
    var selectedLocation = d3.select(this).select("select").property("value");
    currentLocationIndex = +selectedLocation;
    // run update function with selected location
    updateHeatmap(locations[currentLocationIndex]);
    console.log("currentLocationIndex: " + currentLocationIndex);
  });

  d3.selectAll(".nav").on("click", function () {
    if (d3.select(this).classed("left")) {
      if (currentLocationIndex == 0) {
        currentLocationIndex = locations.length - 1;
      } else {
        currentLocationIndex--;
      }
    } else if (d3.select(this).classed("right")) {
      if (currentLocationIndex == locations.length - 1) {
        currentLocationIndex = 0;
      } else {
        currentLocationIndex++;
      }
    }
    d3.select("#locationMenu").property("value", currentLocationIndex);
    updateHeatmap(locations[currentLocationIndex]);
    console.log("currentLocationIndex: " + currentLocationIndex);
  });
});

/***/ })
/******/ ]);