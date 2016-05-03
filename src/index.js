import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { Router, Route, hashHistory } from 'react-router';
import configureStore from './stores';
import thunk from 'redux-thunk'

import App from './containers/App';

const store = configureStore(
  applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
