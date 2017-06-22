import React, { Component } from 'react';
import Intro from './components/Intro';
import MapOverview from './components/MapOverview';

class App extends Component {
  render() {
    return (
      <div className="grid">
        <Intro />
        <MapOverview />
      </div>
    );
  }
}
export default App;