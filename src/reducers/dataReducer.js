import * as constants from '../constants';
import { flattenDeep } from 'lodash';

var initalState = {
  map: [],
  topoJson: [],
  tradeData: [],
  groupByProduct: [],
  groupByCountry: [],
  hasData: false,
  hasTimeseries: false,
  displayMap: 'topo'
}

export default function(state = initalState, action) {
  switch(action.type) {
    case constants.RECEIVE_MAP:
      var newState = Object.assign({}, state)
      newState.map = action.data;
      return newState;
    case constants.RECIEVE_TOPO:
      var newState = Object.assign({}, state)
      newState.topoJson = action.data;
      return newState;
    case 'RECEIVE_TIMESERIES':
      var newState = Object.assign({}, state)
      newState.hasData = true;
      newState.tradeData = state
        .tradeData
        .concat(flattenDeep(action.data));
      return newState;
    case 'TOGGLE_MAP':
      var newState = Object.assign({}, state)
      let displayMap = state.displayMap;
      let newMap = displayMap === 'topo' ? 'block' : 'topo';
      newState.displayMap = newMap;
      return newState;
    default:
      return state;
  }
}
