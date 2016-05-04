require('normalize.css');

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { map, reduce, isUndefined, get } from 'lodash';
import numbro from 'numbro';
import d3 from 'd3';


let colorLegend = (scale) => {
  let values = scale.ticks(6).slice(0,5);
  return map(values, (d) => {
    let style = {
      borderLeftColor: scale(d)
    }
    return (
      <li key={`${scale(d)}-${d}`} className='key Grid-cell' style={style}>
        <p className='key-text'>
          {numbro(d).format('$ 0 a')}
        </p>
      </li>
     );
  });
}

class Legend extends React.Component {
  render() {
    let {
      colors
    } = this.props;

    let legend = colorLegend(colors);

    return (
      <ul className='Grid legend'>
        {legend}
      </ul>
    );
  }
}


let dataFilter = (product, data) => {
  let chain = _.chain(data);
  if(product) {
    chain = chain.filter((d) => {
      return get(d, 'product_name') === product;
    });
  }
  return chain.value();
}

let colorScale = (data = []) => {
  let max = d3.max(data);
  let median = d3.median(data)

  return d3.scale.linear()
    .domain([0, median, max])
    .range(['#deebf7', '#6baed6', '#08519c']);
}

let tradeValue = (data, variable) => {
  return  reduce(data, (memo, datum) => {
    let id = get(datum, '3digit');
    if(isUndefined(memo[id])) {
      memo[id] = get(datum, variable);
    } else {
      memo[id] += get(datum, variable);
    }
    return memo;
  }, {})
}

function mapStateToProps(state, props){
  let {
    country,
    product,
    variable
  } = props.location.query;

  let { tradeData } = state.dataReducer;

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let data = dataFilter(product, tradeData);
  let trade = _.values(tradeValue(data, variable));
  let colors = colorScale(trade)

  return {
    colors
  };
}

export default connect(mapStateToProps)(Legend);
