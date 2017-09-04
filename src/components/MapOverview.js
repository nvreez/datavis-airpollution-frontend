import React, { Component } from 'react';
import * as d3 from "d3";
import { select as d3Select } from 'd3-selection';
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
        return Object.assign({mean: 10 * Math.random(), min: 0, max: 0, stdDev: 0}, location);
      }),
    };
    this.radius = .2;
    this.colorScale = d3.scaleLinear()
      .domain([0, 4, 7, 9, 11])
      .range(["#00BAC4", "#FFFF8C", "#D7191C", "#59091E", "#1C1014"])
      .interpolate(d3.interpolateHcl)

    this.voronoi = this.createVoronoi(this.state.dimensions.width, this.state.dimensions.height);
    this.voronoiPolygons = this.voronoi.polygons(this.state.data);
    this.voronoiLinks = this.createLinks(this.voronoi, this.state.data);
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        height: this.chart.clientHeight,
        width: this.chart.clientWidth
      }
    }, function(){
      this.voronoi = this.createVoronoi(this.state.dimensions.width, this.state.dimensions.height);
      this.voronoiPolygons = this.voronoi.polygons(this.state.data);
      this.voronoiLinks = this.createLinks(this.voronoi, this.state.data);
    });

    this.context = d3.select(this.chart);
    this.contextDefs = this.context.append("defs");

    d3.json("http://127.0.0.1:8088/api/pollution-records?from=20170401&to=20170401&granularity=24", (error, data) => {
      data = this.dateType(data[0]);

      this.setState({data});
    });
  }


  dateType(d) {
    return this.state.data.map(location => {
      // return location;
      return Object.assign(location, d[location.location]);
    });
  }

  createVoronoi(width, height) {
    return d3.voronoi()
      .extent([[-1,-1], [width, height]])
      .x(d => { return d.cx * width; })
      .y(d => { return d.cy * height; });
  }

  createLinks(voronoi, data) {
    let links = {};
    voronoi.links(data).map(link => {
      let distance = Math.sqrt(
        (link.source.cx - link.target.cx) * (link.source.cx - link.target.cx)
          + (link.source.cy - link.target.cy) * (link.source.cy - link.target.cy)
        );

      links[link.source.location] = links[link.source.location] || {
        links: [],
        min: distance,
        max: distance,
        avarage: 0
      };
      links[link.target.location] = links[link.target.location] || {
        links: [],
        min: distance,
        max: distance,
        avarage: 0
      };
      links[link.source.location].min = Math.min(links[link.source.location].min, distance);
      links[link.target.location].min = Math.min(links[link.target.location].min, distance);
      links[link.source.location].max = Math.max(links[link.source.location].max, distance);
      links[link.target.location].max = Math.max(links[link.target.location].max, distance);
      links[link.source.location].links.push(distance);
      links[link.target.location].links.push(distance);
    });

    for (let [key, value] of Object.entries(links)) {
      links[key].avarage = value.links.reduce((a,b) => { return a + b;}) / value.links.length;
    }

    return links;
  }

  render() {
    const colourScale = [];
    for (var i=0; i < 11; i++) {
        colourScale.push(<stop offset={i / 11} key={i / 11} stopColor={this.colorScale( i )} />);
    }

    const voronoiPolygons = [];
    for (var i=0; i < this.voronoiPolygons.length; i++) {
      voronoiPolygons.push(<clipPath id={"clip" + i} key={"clip" + i}>
          <path d={this.voronoiPolygons[i] ? "M" + this.voronoiPolygons[i].join("L") + "Z" : null} />
        </clipPath>);
    }

    const locationValues = this.state.data.map((location, i) => {
      var constrainedSize = Math.min(0.22, Math.max(0.1, this.voronoiLinks[location.location].max));
      return {
        radius: constrainedSize * this.state.dimensions.width / 2,
        x: location.cx * this.state.dimensions.width,
        y: location.cy * this.state.dimensions.height,
        clipPath: "url(#clip" + i + ")",
        fill: this.colorScale(location.mean || 0),
        opacity: location.mean / 12 + 0.2,
        key: location.label,
      }
    })


    const locationPoints = this.state.data.map(locationPoint => {
      return {
        x: locationPoint.cx * this.state.dimensions.width,
        y: locationPoint.cy * this.state.dimensions.height,
      }
    });

    const locationNames = this.state.data.map(locationName => {
      return {
        label: locationName.label,
        textAnchor: locationName.labelAnchorEnd ? 'end' : 'start',
        x: locationName.cx * this.state.dimensions.width,
        y: locationName.cy * this.state.dimensions.height,
        dx: locationName.labelX + this.radius * Math.sign(locationName.labelX),
        dy: locationName.labelY + this.radius * Math.sign(locationName.labelY),
      }
    });

    const legendWidth = Math.min(this.state.dimensions.width / 2, 300);

    //Set scale for x-axis
    const legendScale = d3.scaleLinear()
       .range([-legendWidth/2, legendWidth/2])
       .domain([0.7, 10.3] );

    //Define x-axis
    const legendAxis = d3.axisBottom(legendScale)
        .tickValues([1,2,3,4,5,6,7,8,9,10]);

    return (
      <figure className="map">
        <img className="map-img" src={hkMap} alt="Map of Hong Kong" />
        <svg className="map-locations"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${this.state.dimensions.width} ${this.state.dimensions.height}`}
          preserveAspectRatio="xMinYMin meet"
          ref={(c) => { this.chart = c; }}>

          <defs className="definitions">
            <filter id="blur">
              <feGaussianBlur stdDeviation={0.022 * this.state.dimensions.width} />
            </filter>
            <linearGradient id="aqhi-legend" x1="-5%" x2="105%" y1="0%" y2="0%">
              {colourScale}
            </linearGradient>
            {voronoiPolygons}
          </defs>

          <g className="locationValues" filter="url(#blur)">
            {locationValues.map(locationValue => (
              <circle
                r={locationValue.radius}
                cx={locationValue.x}
                cy={locationValue.y}
                clipPath={locationValue.clipPath}
                fill={locationValue.fill}
                opacity={locationValue.opacity}
                key={locationValue.key}
              />
            ))}
          </g>

          <g className="locationPoints">
            {locationPoints.map(locationPoint => (
              <circle
                cx={locationPoint.x}
                cy={locationPoint.y}
                key={`${locationPoint.x},${locationPoint.y}`}
                r={this.radius + 'em'}
              />
            ))}
          </g>

          <g className="locationNames">
            {locationNames.map(locationName => (
              <text
                x={locationName.x}
                y={locationName.y}
                dx={locationName.dx + 'em'}
                dy={locationName.dy + 'em'}
                key={locationName.label}
                textAnchor={locationName.textAnchor}>
                {locationName.label}
              </text>
            ))}
          </g>

          <g
            className="legendWrapper"
            // transformOrigin="right"
            transform={"translate(" + (this.state.dimensions.width - legendWidth / 1.25) + "," + (this.state.dimensions.height * 0.9) + ")"}>
            <rect
              className="legendRect"
              x={-legendWidth/2}
              y="0"
              rx="4"
              width={legendWidth}
              height="8"
              fill="url(#aqhi-legend)"/>
            <text
              className="legendTitle"
              x="0"
              y="-10"
              textAnchor="middle">
              Air Quality Health Index (AQHI)
            </text>
            <g className="legendAxis"
              transform="translate(0, 4)"
              ref={node => d3Select(node).call(legendAxis)} />
          </g>
        </svg>
      </figure>
    );
  }
}
export default Intro;