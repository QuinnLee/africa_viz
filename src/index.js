import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import configureStore from './stores';
import thunk from 'redux-thunk'

import App from './containers/App';
import Intro from './components/Intro';
import Main from './components/Main';

const store = configureStore(
  applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={Intro} />
        <Route path="/main" component={Main} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
