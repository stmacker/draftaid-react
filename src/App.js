import React, { Component } from 'react';

import DraftBoard from './DraftBoard'

class App extends Component {

  render() {
    return (
      <div id="main" className="container-fluid clear-top">
        <DraftBoard />
      </div>
    );
  }
}

export default App;
