import axios from 'axios';
import * as constants from '../constants';

function requestData(dataType) {
  return {
    type: constants.REQUEST_DATA,
    dataType
  }
}

function receiveData(dataType, data) {
  return {
    type: constants.RECEIVE_DATA,
    dataType,
    data: data
  }
}

export function fetchData(url, dataType) {
  return function(dispatch) {
    dispatch(requestData(dataType));
    return axios({
      url: url,
      timeout: 20000,
      method: 'get',
      responseType: 'json'
    })
    .then(function(response) {
      dispatch(receiveData(dataType, response.data));
    })
  }
}
