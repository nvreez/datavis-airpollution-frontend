import React, { Component } from 'react';
import * as d3 from "d3";
import hkMap from './hk-map.svg';
import locations from "./locations.json";
import './MapOverview.css';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        width: 1500,
        height: 1100,
      },
      context: {},
      data: locations.map(location => {
        return Object.assign({mean: 0, min: 0, max: 0, stdDev: 0}, location);
      }),
    };
    this.radius = .3;
    this.onImgLoad = this.onImgLoad.bind(this);
    this.colorScale = d3.scaleLinear()
      .domain([0, 4, 6, 9, 11])
      .range(["#00BAC4", "#FFFF8C", "#D7191C", "#670091", "#2D0513"])
      .interpolate(d3.interpolateHcl)
  }

  componentDidMount() {
    this.context = d3.select(this.chart);
    this.contextDefs = this.context.append("defs");

    var filter = this.contextDefs
      .append("filter")
        .attr("id", "blur")
      .append("feGaussianBlur")
        .attr("stdDeviation", 20);

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = this.contextDefs.append("linearGradient")
      .attr("id", "aqhi-legend")
      .attr("x1", "-5%").attr("y1", "0%")
      .attr("x2", "105%").attr("y2", "0%")
      .selectAll("stop")
      .data(d3.range(11))
      .enter().append("stop")
      .attr("offset", (d, i) => { return i / 11; })
      .attr("stop-color", (d, i) => { return this.colorScale( i ); });



    this.voronoi = this.createVoronoi();


    d3.json("http://127.0.0.1:8088/api/pollution-records?from=20170401&to=20170401&granularity=24", (error, data) => {
      data = this.dateType(data[0]);

      this.setState({data});
      this.updatePolygons(data);
    });
  }


  dateType(d) {
    return this.state.data.map(location => {
      return Object.assign(location, d[location.location]);
    });
  }

  setViewbox() {
    this.context.select('svg')
      .attr("viewBox", `0 0 ${this.state.dimensions.width} ${this.state.dimensions.height}`);
  }

  createVoronoi() {
    return d3.voronoi()
      .extent([[-1,-1], [this.state.dimensions.width, this.state.dimensions.height]])
      .x(d => { return d.cx * this.state.dimensions.width; })
      .y(d => { return d.cy * this.state.dimensions.height; });
  }

  createPoints() {
    return this.context.append("g")
        .attr("class", "locations")
      .selectAll("circle")
      .data(this.state.data)
      .enter().append("circle")
        .attr("r", this.radius + 'em')
        .attr("cx", d => { return d.cx * this.state.dimensions.width; })
        .attr("cy", d => { return d.cy * this.state.dimensions.height; });
  }

  createLabels() {
    return this.context.append("g")
        .attr("class", "labels")
      .selectAll("text")
      .data(this.state.data)
      .enter().append("text")
        .text(d => { return d.label; })
        .attr("text-anchor", d => { return d.labelAnchorEnd ? 'end' : 'start'; })
        .attr("x", d => { return d.cx * this.state.dimensions.width; })
        .attr("y", d => { return d.cy * this.state.dimensions.height; })
        .attr("dx", d => {
          var delta = d.labelX + this.radius * Math.sign(d.labelX);
          return delta + 'em';
        })
        .attr("dy", d => {
          var delta = d.labelY + this.radius * Math.sign(d.labelY);
          return delta + 'em';
        });
  }

  createPolygons(data) {
    this.contextDefs
        .attr("class", "polygons")
      .selectAll("clipPath")
      .data(this.voronoi.polygons(data))
      .enter().append("clipPath")
        .attr("id", function(d,i) { return "clip" + i; })
        .append("path")
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });

    return this.context.append("g")
        .attr("class", "circles")
        .attr("filter", "url(#blur)")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
        .attr("r", 0.09 * this.state.dimensions.width)
        .attr("cx", d => { return d.cx * this.state.dimensions.width; })
        .attr("cy", d => { return d.cy * this.state.dimensions.height; })
        .attr("clip-path", function(d,i) { return "url(#clip" + i + ")"; })
        .style("fill", d => { return this.colorScale(d.mean || 0); })
        .style("opacity", d => { return d.mean / 11; });
  }

  updatePolygons(data) {
    return this.context.select(".circles")
      .selectAll("circle")
      .data(this.voronoi.polygons(data))
      .transition()
      .style("fill", d => { return this.colorScale(d.data.mean); })
      .style("opacity", d => {
        console.log("MapOverview.js:107", d.data );
        return d.data.mean / 11; });
  }

  colorPolygon(polygon) {
    console.log("MapOverview.js:107", this);
    polygon.style("fill", d => {
          return this.colorScale(d.data.mean);
        });
  }

  createLegend() {
    var legendWidth = Math.min(this.state.dimensions.width / 2, 300);

    //Color Legend container
    var legendsvg = this.context.append("g")
      .attr("class", "legendWrapper")
      .attr("transform-origin", "right")
      .attr("transform", "translate(" + (this.state.dimensions.width - legendWidth / 1.25) + "," + (this.state.dimensions.height * 0.9) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
      .attr("class", "legendRect")
      .attr("x", -legendWidth/2)
      .attr("y", 0)
      .attr("rx", 8/2)
      .attr("width", legendWidth)
      .attr("height", 8)
      .style("fill", "url(#aqhi-legend)");

    //Append title
    legendsvg.append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .text("Air Quality Health Index (AQHI)");

    //Set scale for x-axis
    var xScale = d3.scaleLinear()
       .range([-legendWidth/2, legendWidth/2])
       .domain([0.7, 10.3] );

    //Define x-axis
    var xAxis = d3.axisBottom(xScale)
        .tickValues([1,2,3,4,5,6,7,8,9,10]);

    //Set up X axis
    legendsvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, 4)")
      .call(xAxis);
  }

  onImgLoad({target:img}) {
    this.setState({
      dimensions: {
        height:img.height,
        width:img.width
      }
    }, function(){
      this.setViewbox();
      this.voronoi = this.createVoronoi();
      this.createPolygons(this.state.data);
      this.createPoints();
      this.createLabels();
      this.createLegend();
    });
  }


  render() {
    return (
      <figure className="map">
        <img className="map-img" src={hkMap} alt="Map of Hong Kong" onLoad={this.onImgLoad} />
        <svg className="map-locations"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${this.state.dimensions.width} ${this.state.dimensions.height}`}
          preserveAspectRatio="xMinYMin meet"
          ref={(c) => { this.chart = c; }}></svg>
      </figure>
    );
  }
}
export default Intro;