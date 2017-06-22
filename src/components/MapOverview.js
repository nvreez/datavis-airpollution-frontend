import React, { Component } from 'react';
import hkMap from './Hong_Kong-optimised.svg';

class Intro extends Component {
  render() {
    return (
      <div className="map">
        <img src={hkMap} alt="Map of Hong Kong"/>
      </div>
    );
  }
}
export default Intro;