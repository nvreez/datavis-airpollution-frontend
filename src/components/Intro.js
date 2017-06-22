import React, { Component } from 'react';
import './Intro.css';

class Intro extends Component {
  render() {
    return (
      <div className="intro">
        <h1>Hong Kong air polution records</h1>

        <p>
          We collected and analysed Hong Kong's pollution data over the past years to search for patterns and to see if it is getting better. Hong Kong uses its own index called the AQHI and collects data from many parts across the region. The AQHI ranges from 1 to 10 and is calculated based on the cumulative health risk attributable to the 3-hour moving average concentrations of four air pollutants namely, ozone (O3), nitrogen dioxide (NO2), sulphur dioxide (SO2) and particulate matter (PM2.5/ PM10). The risk factors of each pollutant were obtained from local health studies.
        </p>
      </div>
    );
  }
}
export default Intro;