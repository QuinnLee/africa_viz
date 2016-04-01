
var initalState = {
  map: {}
};

export default function(state = initalState, action) {
  switch(action.type) {
    case 'FETCH_MAP':
      var newState = Object.assign({}, state)
      newState.map = action.map;
      return newState;
    default:
      return state;
  }
}
