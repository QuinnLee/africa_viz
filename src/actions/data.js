import axios from 'axios';
import * as constants from '../constants';

function requestData(dataType) {
  return {
    type: constants.REQUEST_DATA,
    dataType
  }
}

function receiveMap(dataType, data) {
  return {
    type: constants.RECEIVE_MAP,
    dataType,
    data: data
  }
}

function receiveData(dataType, data) {
  return {
    type: constants.RECEIVE_DATA,
    dataType,
    data
  }
}

export function fetchData(url, dataType) {
  return function(dispatch) {
    dispatch(requestData(dataType));
    return axios.get(url)
    .then(function(response) {
      let data = response.data;
      if(dataType == 'data') {
        dispatch(receiveData(dataType, data));
      } else if (dataType === 'map') {
        dispatch(receiveMap(dataType, data));
      }
    })
  }
}
