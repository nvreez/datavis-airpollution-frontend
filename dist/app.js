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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locationSelect__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__charts_lineGraph__ = __webpack_require__(5);



window.config = {
  locs: [],
  colors: ["#83E827", "#3DBA32", "#03943B", "#FFD91B", "#FFA51C", "#FC7D1F", "#E91B33", "#B6005C", "#88007D", "#63008C", "#5D0021"],
  api: "http://127.0.0.1:8088/api/",
  loc: "central",

  n: 24, // n-period of moving average
  k: 2 // k times n-period standard deviation above/below moving average
};

d3.json(config.api + "locations", function (error, data) {
  config.locs = data;
  config.loc = config.locs[0]['name'] || config.loc;

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__locationSelect__["a" /* initLocationSelect */])(config.locs);
});

d3.json(config.api + "pollution-records?from=20160601&to=20170501&granularity=1", function (error, data) {
  data = dateType(data);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__charts_lineGraph__["a" /* default */])(data, config.loc);
});

function dateType(d) {
  for (var i = d.length - 1; i >= 0; i--) {
    var hour = ("0" + d[i].startHour).slice(-2);
    d[i].date = new Date(d[i].startDate + "T" + hour + ":00:00");
  }
  return d;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initLocationSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return locationChange; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observer__ = __webpack_require__(4);


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
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locationSelect__ = __webpack_require__(3);

var data;

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

var svg = d3.select(".chart").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* harmony default export */ __webpack_exports__["a"] = (function (d, location) {
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

/***/ })
/******/ ]);