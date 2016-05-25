import axios from 'axios';
import { get } from 'lodash';
import * as constants from '../constants';


function receiveMap(dataType, data) {
  return {
    type: constants.RECEIVE_MAP,
    dataType,
    data: data
  }
}

function receiveTopoJson(dataType, data) {
  return {
    type: constants.RECIEVE_TOPO,
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

function receiveTimeseries(data) {
  return {
    type: 'RECEIVE_TIMESERIES',
    data
  }
}

export function fetchData(url, dataType) {
  return function(dispatch) {
    return axios.get(url)
    .then(function(response) {
      let data = response.data;
      if(dataType == 'data') {
        dispatch(receiveData(dataType, data));
      } else if (dataType === 'map') {
        dispatch(receiveMap(dataType, data));
      } else if (dataType === 'topoJson') {
        dispatch(receiveTopoJson(dataType, data));
      }
    })
  }
}

export function fetchTimeSeries() {
  let years = [2009, 2010, 2011, 2012, 2013, 2014];
  let calls = years.map((year) => {
    let url = get(constants, `DATA_URL_${year}`);
    return axios.get(url);
  });
  return function(dispatch) {
    return axios.all(calls).then((response) => {
      let data = response.map((d) => { return get(d, 'data') });
      dispatch(receiveTimeseries([data]))
    });
  }
}

export function toggleMap() {
  return {
    type: 'TOGGLE_MAP'
  }
}
