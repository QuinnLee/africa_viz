import React, {
  Component
} from 'react';

import { fetchData } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Legend from '../components/Legend';

import AfricaMap from './AfricaMap';
import TreeMap from './TreeMap';
import * as constants from '../constants';
import numbro from 'numbro';

numbro.language('us-vis', {
  delimiters: {
    thousands: ', ',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'Thousand',
    million: 'Million',
    billion: 'Billion',
  },
  currency: {
    symbol: '$',
    position: 'postfix'
  },
});

numbro.culture('us-vis');

/* Populated by react-webpack-redux:reducer */
class App extends Component {
  componentDidMount() {
    const { fetchData } = this.props.actions;
    fetchData(constants.MAP_URL, 'map');
    fetchData(constants.DATA_URL, 'data');
  }
  render() {
    return (
      <body className="content">
        <header className="header">
          <div className='Grid Grid--center'>
            <Header {...this.props}/>
          </div>
          <div className='Grid Grid--center'>
            <div className="Grid-cell">
              <Navigation {...this.props}/>
            </div>
          </div>
        </header>
        <main className="Grid Grid--center Grid--visualizations">
          <Legend {...this.props}/>
          <div className="Grid-cell--visualizations">
            <AfricaMap  {...this.props}/>
          </div>
          <div className="Grid-cell--visualizations">
            <TreeMap {...this.props}/>
          </div>
        </main>
      </body>
    );
  }
}

function mapStateToProps(){
  return {};
}

function mapDispatchToProps(dispatch) {
  const actions = { fetchData };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
