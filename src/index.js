import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { Router, Route, IndexRoute,  hashHistory } from 'react-router';
import configureStore from './stores';
import thunk from 'redux-thunk'

import App from './containers/App';
import AfricaMap from './containers/AfricaMap';
import TreeMap from './containers/TreeMap';
import LineChart from './containers/LineChart';

import numbro from 'numbro';

numbro.culture('us-vis', {
  delimiters: {
    thousands: ', ',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'K',
    million: 'M',
    billion: 'B'
  },
  currency: {
    symbol: '$',
    position: 'postfix'
  }
});

numbro.culture('us-vis');

const store = configureStore(
  applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute components={{left: TreeMap, right: AfricaMap, bottom: LineChart}}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);

