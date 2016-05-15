import React, { Component } from 'react';

import { fetchData, fetchTimeSeries } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Timeline from '../components/Timeline';

import * as constants from '../constants';

/* Populated by react-webpack-redux:reducer */
class App extends Component {
  componentDidMount() {
    const { fetchData, fetchTimeSeries } = this.props.actions;
    fetchData(constants.MAP_URL, 'map');
    fetchTimeSeries();
  }
  render() {
    return (
      <div className="content">
        <header className="header">
          <div className='Grid Grid--center'>
            <Header {...this.props}/>
          </div>
          <div className='Grid Grid--center'>
            <div className="Grid-cell">
              <Navigation {...this.props}/>
            </div>
          </div>
        </header>
        <div className="Grid Grid--center Grid--visualizations">
          <div className="Grid-cell Grid-cell--visualizations">
            {this.props.left}
          </div>
          <div className="Grid-cell Grid-cell--visualizations">
            {this.props.right}
          </div>
        </div>
        <Timeline {...this.props}/>
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
