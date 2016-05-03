require('normalize.css');
require('styles/App.css');

import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import _ from 'lodash';
import d3 from 'd3';

const { get } = _;

let africa = (data, country, product, onClick) => {
  let side = 50;
  let className = country ? 'map-country__deselected' : 'map-country';
  return data.map((d) => {
    let countryClass = d.name === country ? 'map-country__selected ' : className;
    return (
      <g key={d.name} transform={`translate(${d.x*side},${d.y*side})`} onClick={() => { onClick(d.name);}}>
        <rect width={side} height={side} className={countryClass} fill={d.color} vector-effect="non-scaling-stroke"/>
        <text x="25" y="30" className="map-country-text">{d['3digit']}</text>
      </g>
    );
  });
};

class AfricaMap extends React.Component {
  onClick(currentCountry) {
    let {
      country,
      variable,
      product
    } = this.props;

    if(country === currentCountry) {
      hashHistory.replace({ pathname: '/', query: { variable, product }});
    } else {
      hashHistory.replace({ pathname: '/', query: { country: currentCountry, variable, product }});
    }
  }
  render() {
    let {
      map,
      hasData,
      product,
      country,
      variable
    } = this.props;

    if(!hasData) { return (<div> loading </div>) }
    return (
      <svg width={512} height={600}>
        <g transform='translate(8,8)'>
          {africa(map, country, product, this.onClick.bind(this))}
        </g>
      </svg>
    );
  }
}

let filteredData = (product, data) => {
  let chain = _.chain(data);
  if(product) {
    chain = chain.filter((d) => {
      return get(d, 'product_name') === product;
    });
  }
  return chain.value();
}

let tradeValue = (data, variable) => {
  return  _.reduce(data, (memo, datum) => {
    let id = get(datum, '3digit');

    if(_.isUndefined(memo[id])) {
      memo[id] = get(datum, variable);
    } else {
      memo[id] += get(datum, variable);
    }

    return memo;
  }, {})
}

let colorScale = (data = []) => {
  let min = d3.min(data);
  let max = d3.max(data);
  let median = d3.median(data)

  return d3.scale.linear()
    .domain([min, median, max])
    .range(['#deebf7', '#6baed6', '#08519c']);
}

function mapStateToProps(state, props){
  let {
    tradeData,
    hasData,
    map
  } = state.dataReducer;

  let {
    country,
    variable,
    product
  } = props.location.query;

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  if(hasData) {
    let data = filteredData(product, tradeData);
    let trade = tradeValue(data, variable);
    let colors = colorScale(_.values(trade));
     map = _.map(map, (country) => {
      let id = get(country, '3digit');
      let value = get(trade, id) || 0;
      let color = colors(value);
      return Object.assign(country, { value, color });
    })
  }

  return {
    map,
    hasData,
    country,
    variable,
    product,
  }
}

export default connect(mapStateToProps)(AfricaMap);
