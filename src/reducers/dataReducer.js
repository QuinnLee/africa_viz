import * as constants from '../constants';
import { flattenDeep } from 'lodash';

var initalState = {
  map: [],
  tradeData: [],
  groupByProduct: [],
  groupByCountry: [],
  hasData: false,
  hasTimeseries: false
}

export default function(state = initalState, action) {
  switch(action.type) {
    case constants.RECEIVE_MAP:
      var newState = Object.assign({}, state)
      newState.map = action.data;
      return newState;
    case 'RECEIVE_TIMESERIES':
      var newState = Object.assign({}, state)
      newState.hasData = true;
      newState.tradeData = state
        .tradeData
        .concat(flattenDeep(action.data));

      return newState;
    default:
      return state;
  }
}
