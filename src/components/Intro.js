require('normalize.css');
require('styles/App.css');

import React, {
  Component
} from 'react';
import { connect } from 'react-redux';

class Intro extends Component {
  render() {
     return (
      <h1 className='intro'>
        THIS IS SPARTA
      </h1>
    )
  }
}

function mapStateToProps(state){
  return {
    map: state.dataReducer.map
  }
}

export default connect(mapStateToProps)(Intro);
