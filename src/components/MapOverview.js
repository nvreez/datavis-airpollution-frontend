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
    };
    this.radius = .3;
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentDidMount() {
    this.context = d3.select(this.chart);
    this.context.selectAll('circle')
      .style('fill', 'red');
  }

  setViewbox() {
    this.context.select('svg')
      .attr("viewBox", `0 0 ${this.state.dimensions.width} ${this.state.dimensions.height}`);
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

  onImgLoad({target:img}) {
    this.setState({
      dimensions: {
        height:img.height,
        width:img.width
      }
    }, function(){
      this.setViewbox();
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