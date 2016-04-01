require('normalize.css');
require('styles/App.css');

import React from 'react';
import { connect } from 'react-redux';

class Main extends React.Component {
  render() {
    return (
      <div>
        Welcome
      </div>
    );
  }
}

Main.defaultProps = {
};

function mapStateToProps(state){
  return {
    map: state.dataReducer.map
  }
}

export default connect(mapStateToProps)(Main);
