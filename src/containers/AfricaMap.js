require('normalize.css');
require('styles/App.css');

import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { get, values } from 'lodash';

import { dataFilter, colorScale, tradeValue } from '../helpers/dataHelpers';
import { africa } from '../helpers/visualizationHelpers';

import Legend from '../components/Legend';



class AfricaMap extends React.Component {
  onClick(currentCountry) {
    let {
      country,
      variable,
      product
    } = this.props;

    let currentPath = this.props.location.pathname;

    if(country === currentCountry) {
      hashHistory.replace({ pathname: currentPath, query: { variable, product }});
    } else {
      hashHistory.replace({ pathname: currentPath, query: { country: currentCountry, variable, product }});
    }
  }
  render() {
    let {
      map,
      hasData,
      product,
      country
    } = this.props;

    if(!hasData) { return (<div> loading </div>) }

    return (
      <div className="Grid Grid-cell-center__all">
        <Legend {...this.props}/>
        <svg width={400} height={500}>
          <g transform='translate(8,8)'>
            {africa(map, country, product, this.onClick.bind(this))}
          </g>
        </svg>
      </div>
    );
  }
}

function mapStateToProps(state, props){
  let {
    tradeData,
    hasData,
    map: jsonMap
  } = state.dataReducer;

  let {
    country,
    variable,
    product,
    year
  } = props.location.query;

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  if(hasData) {
    let data = dataFilter(null, product, year, tradeData);
    let trade = tradeValue(data, variable);
    let colors = colorScale(values(trade));
    jsonMap = jsonMap.map((country) => {
      let id = get(country, '3digit');
      let value = get(trade, id) || 0;
      let color = colors(value);
      return Object.assign(country, { value, color });
    })
  }

  return {
    map: jsonMap,
    hasData,
    country,
    variable,
    product
  }
}

export default connect(mapStateToProps)(AfricaMap);
