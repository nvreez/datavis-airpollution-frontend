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
      data: locations
    };
    this.radius = .3;
    this.onImgLoad = this.onImgLoad.bind(this);
    this.colorScale = d3.scaleLinear()
      .domain([0, 7, 11])
      .range(["#35B9FF", "#8C7E5E", "#532C13"])
      .interpolate(d3.interpolateHcl)
  }

  componentDidMount() {
    this.context = d3.select(this.chart);
    this.voronoi = this.createVoronoi();


    d3.json("http://127.0.0.1:8088/api/pollution-records?from=20170401&to=20170401&granularity=24", (error, data) => {
      data = this.dateType(data[0]);

      this.setState({data});
      this.updatePolygons(data);
    });
  }


  dateType(d) {
    return locations.map(location => {
      return Object.assign(d[location.location], location);
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
      .data(locations)
      .enter().append("circle")
        .attr("r", this.radius + 'em')
        .attr("cx", d => { return d.cx * this.state.dimensions.width; })
        .attr("cy", d => { return d.cy * this.state.dimensions.height; });
  }

  createLabels() {
    return this.context.append("g")
        .attr("class", "labels")
      .selectAll("text")
      .data(locations)
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
    return this.context.append("g")
        .attr("class", "polygons")
      .selectAll("path")
      .data(this.voronoi.polygons(data))
      .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .style("fill", d => { return this.colorScale(d.data.mean || 0); })
      .style("opacity", d => { return d.data.mean / 12 || 0; });
  }

  updatePolygons(data) {
    return this.context.select(".polygons")
      .selectAll("path")
      .data(this.voronoi.polygons(data))
      .transition()
      .style("fill", d => { return this.colorScale(d.data.mean); })
      .style("opacity", d => {
        console.log("MapOverview.js:107", d.data.mean / 20 );
        return d.data.mean / 20; });
  }

  colorPolygon(polygon) {
    console.log("MapOverview.js:107", this);
    polygon.style("fill", d => {
          return this.colorScale(d.data.mean);
        });
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