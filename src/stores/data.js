import * as constants from '../constants';

var data = {
  map: []
};

export default function(state = data, action) {
  switch(action.type) {
    case constants.RECEIVE_DATA:
      var newState = Object.assign({}, state)
      newState.map = action.map;
      return newState;

    default:
      return state;

  }
};
