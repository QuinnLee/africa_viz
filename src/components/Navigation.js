require('normalize.css');

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { get } from 'lodash';

class Navigation extends React.Component {
  render() {
    let {
      country,
      product,
      variable
    } = this.props;

    let importLink = () => {
      hashHistory.replace({ pathname:'/', query: { product, country, variable: 'import_value'}});
    };

    let exportLink = () => {
      hashHistory.replace({ pathname:'/', query: { product, country, variable: 'export_value'}});
    };

    let importClass = classNames('Grid-cell', { active: variable === 'import_value'});
    let exportClass = classNames('Grid-cell', { active: variable != 'import_value'});

    return (
      <ul className="Grid">
        <li className={exportClass}>
          <a className='btn' onClick={exportLink}>Exports</a>
        </li>
        <li className={importClass}>
          <a className='btn' onClick={importLink}>Imports</a>
        </li>
        <li>
          <a className='btn' onClick={() => hashHistory.replace('/') }>Clear</a>
        </li>
      </ul>
    )
  }
}

Navigation.defaultProps = {
};

let dataFilter = (country,product,  data) => {
  let chain = _.chain(data);
  if(country) {
    chain = chain.filter((d) => {
      return get(d, 'country_name') === country;
    });
  }
  if(product) {
    chain = chain.filter((d) => {
      return get(d, 'product_name') === product;
    });
  }
  return chain.value();
}

function mapStateToProps(state, props){
  let {
    country,
    product,
    variable
  } = props.location.query;

  let { tradeData } = state.dataReducer;

  let data = dataFilter(country, product,  tradeData);

  return {
    data,
    country,
    product,
    variable
  };
}

export default connect(mapStateToProps)(Navigation);
