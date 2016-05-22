import React, { Component } from 'react';

import { fetchData, fetchTimeSeries } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';

import Header from '../components/Header';

import * as constants from '../constants';

/* Populated by react-webpack-redux:reducer */
class App extends Component {
  componentDidMount() {
    const { fetchData, fetchTimeSeries } = this.props.actions;
    fetchData(constants.MAP_URL, 'map');
    fetchTimeSeries();
  }
  render() {
    let bottomVisualization = null;
    if(this.props.bottom) {
      bottomVisualization = (
        <div className="Grid Grid--center Grid--visualizations__timeline">
          {this.props.bottom}
        </div>
      );
    }
    return (
      <StickyContainer>
        <header className="header">
          <Sticky>
            <div className='Grid Grid--center'>
              <Header {...this.props}/>
            </div>
          </Sticky>
        </header>
        <div className="content">
          <div className="Grid Grid--center Grid--visualizations">
            <div className="Grid-cell Grid-cell--visualizations">
              {this.props.left}
            </div>
            <div className="Grid-cell Grid-cell--visualizations">
              {this.props.right}
            </div>
          </div>
          {bottomVisualization}
        </div>
      </StickyContainer>
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
