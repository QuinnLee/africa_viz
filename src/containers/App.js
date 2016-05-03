import React, {
  Component,
  PropTypes
} from 'react';

import { fetchData } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';
import AfricaMap from './AfricaMap';
import TreeMap from './TreeMap';
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
      <main>
        <Navigation {...this.props}/>
        <AfricaMap {...this.props}/>
        <TreeMap {...this.props}/>
      </main>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  map: PropTypes.array
};


function mapStateToProps(state){
  return {
    map: state.dataReducer.map
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { fetchData };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
