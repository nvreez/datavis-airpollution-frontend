import React, { Component } from 'react';
import * as d3 from "d3";
import hkMap from './hk-map.svg';
import locations from "./locations.json";
import './MapOverview.css';

class Intro extends Component {
  componentDidMount() {
    const context = this.setContext();
    context.selectAll('circle')
      .style('fill', 'red');

    this.createPoints(context);
    this.createLabels(context);
  }

  setContext() {
    return d3.select(this.chart);
  }

  createPoints(context) {
    return context.append("g")
        .attr("class", "locations")
      .selectAll("circle")
      .data(locations)
      .enter().append("circle")
        .attr("r", 2.5)
        .attr("cx", function(d) { return d.cx; })
        .attr("cy", function(d) { return d.cy; });
  }

  createLabels(context) {
    return context.append("g")
        .attr("class", "labels")
      .selectAll("text")
      .data(locations)
      .enter().append("text")
        .text(function(d) { return d.label; })
        .attr("text-anchor", function(d) { return d.labelAnchorEnd ? 'end' : 'start'; })
        .attr("x", function(d) { return d.labelX; })
        .attr("y", function(d) { return d.labelY; });
  }


  render() {
    return (
      <figure className="map">
        <img className="map-img" src={hkMap} alt="Map of Hong Kong" />
        <svg className="map-locations" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 1100" ref={(c) => { this.chart = c; }}></svg>
      </figure>
    );
  }
}
export default Intro;