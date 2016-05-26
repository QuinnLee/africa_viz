import React, { Component } from 'react';

import { fetchData, fetchTimeSeries } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';

import * as constants from '../constants';

/* Populated by react-webpack-redux:reducer */
class App extends Component {
  componentDidMount() {
    const { fetchData, fetchTimeSeries } = this.props.actions;
    fetchData(constants.MAP_URL, 'map');
    fetchData(constants.TOPO_URL, 'topoJson');
    fetchTimeSeries();
  }
  render() {
    let bottomVisualization = null;
    if(this.props.bottom) {
      bottomVisualization = (
        <div className="Grid Grid--center Grid--visualizations__timeline visualization--width">
          {this.props.bottom}
        </div>
      );
    }
    return (
      <div>
        <header className="header">
          <div className='Grid Grid--center'>
          <h1>
            Between 2010 - 2014, What was trade between China and Africa?
          </h1>
          </div>
        </header>
        <div className="Grid Grid--center Grid--visualizations visualization--width">
          <div className="Grid-cell Grid-cell--visualizations">
            {this.props.left}
          </div>
          <div className="Grid-cell Grid-cell--visualizations">
            {this.props.right}
          </div>
        </div>
        <div className='Grid Grid--center'>
          <Header {...this.props}/>
        </div>
        {bottomVisualization}
        <div className="Grid Grid--center">
          <p>
            Data from the <a href='http://atlas.cid.harvard.edu/' target='_blank'> Atlas of International Complexity </a>
          </p>
        </div>
        <div className="Grid Grid--center">
          <p>
            <a href='https://github.com/QuinnLee/africa_viz'> Github </a>
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(){
  return {};
}

function mapDispatchToProps(dispatch) {
  const actions = { fetchData, fetchTimeSeries };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
