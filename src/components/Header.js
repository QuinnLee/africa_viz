require('normalize.css');
require('styles/App.css');

import React, {
  Component
} from 'react';

import { connect } from 'react-redux';
import { get, sumBy } from 'lodash';
import { dataFilter } from '../helpers/dataHelpers';
import { hashHistory } from 'react-router'
import numbro from 'numbro';


let verb = (verb, action) => {
  return (
    <u className="dotted" onClick={() => action()}>
      {verb}
    </u>
  );
};

let resetButton = (country, action) => {
  return (
    <u className="dotted" onClick={() => action()}>
      {country}
    </u>
  );
}

class Header extends Component {
  toggleVerb() {
    let {
      country,
      product,
      variable,
      year
    } = this.props.location.query;

    let currentPath = this.props.location.pathname;

    variable = variable === 'import_value' ? 'export_value': 'import_value';

    hashHistory.replace({
      pathname: currentPath,
      query: { product, country, year, variable }
    });

  }
  reset() {
    let {
      variable,
      year
    } = this.props.location.query;

    let currentPath = this.props.location.pathname;

    hashHistory.replace({
      pathname: currentPath,
      query: { year, variable }
    });
  }
  render() {
    let {
      country,
      product,
      variable,
      year,
      value
    } = this.props;

    let verbs = {
      'import_value': 'imported',
      'export_value': 'exported'
    }

    let destination = {
      'import_value': 'from',
      'export_value': 'to'
    }

    let verbText = get(verbs, variable);
    country = country ? resetButton(country, this.reset.bind(this)) : 'Africa';
    product =  product ? `of ${product} ${get(destination, variable)} China` : `${get(destination, variable)} China`;

   return (
     <h1 className='question'>
      In {year}, {country} {verb(verbText, this.toggleVerb.bind(this))} {numbro(value).format('$ 0.00 a')} {product}
     </h1>
    );
  }
}

function mapStateToProps(state, props){
  let {
    tradeData
  } = state.dataReducer

  let {
    country,
    product,
    variable,
    year
  } = props.location.query;

  let data = dataFilter(country, product, year, tradeData);

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';
  year =  year ? year: 2014 ;

  let value = sumBy(data, (d) => { return get(d, variable);});

  return {
    country,
    product,
    variable,
    year,
    value
  };
}

export default connect(mapStateToProps)(Header);
