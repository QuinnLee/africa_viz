import React, {
  Component
} from 'react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { fetchData } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';
import Navigation from '../components/Navigation';

import * as constants from '../constants';

/* Populated by react-webpack-redux:reducer */
class App extends Component {
  componentDidMount() {
    const { fetchData } = this.props.actions;
    fetchData(constants.MAP_URL, 'map');
    fetchData(constants.DATA_URL, 'data');
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
            <div className="Grid-cell--visualizations">
              <ReactCSSTransitionGroup component="div" transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={500} >
                {this.props.left}
              </ReactCSSTransitionGroup>
            </div>
            <div className="Grid-cell--visualizations">
              <ReactCSSTransitionGroup component="div" transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={500} >
                {this.props.right}
              </ReactCSSTransitionGroup>
            </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(){
  return {};
}

function mapDispatchToProps(dispatch) {
  const actions = { fetchData };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
