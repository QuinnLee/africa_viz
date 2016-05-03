import _ from 'lodash';
import * as constants from '../constants';

var initalState = {
  map: [],
  tradeData: [],
  hasData: false,
  country: null,
  product: null
}

export default function(state = initalState, action) {
  switch(action.type) {
    case 'RECEIVE_MAP':
      var newState = Object.assign({}, state)
      newState.map = action.data;
      return newState;
    case 'RECEIVE_DATA':
      var newState = Object.assign({}, state)
      newState.hasData = true;
      newState.tradeData = action.data;
      return newState;
    case constants.HOVER_COUNTRY:
      var newState = Object.assign({}, state)
      newState.country = action.country
      newState.filteredTradeData = _.filter(state.tradeData, { 'country_name': action.country });
      return newState;
    case constants.HOVER_PRODUCT:
      return state;
    default:
      return state;
  }
}
