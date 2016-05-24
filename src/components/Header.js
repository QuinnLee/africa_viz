require('normalize.css');
require('styles/App.css');

import React, {
  Component
} from 'react';

import { connect } from 'react-redux';
import { get, sumBy } from 'lodash';
import { dataFilter } from '../helpers/dataHelpers';
import { hashHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';
import numbro from 'numbro';


let verb = (verb, action) => {
  return (
    <u className="dotted" data-tip data-for='resetVariable' onClick={() => action()}>
      {verb}
    </u>
  );
};

let resetButton = (country, action) => {
  return (
    <u className="dotted" data-tip data-for='resetCountry' onClick={() => action()}>
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

    let verbsCopy = {
      'export_value': 'import',
      'import_value': 'export'
    }

    let destination = {
      'import_value': 'from',
      'export_value': 'to'
    }

    let verbText = get(verbs, variable);
    country = country ? country : 'Africa';
    let countryButton = resetButton(country, this.reset.bind(this));
    product =  product ? `of ${product} ${get(destination, variable)} China` : `${get(destination, variable)} China`;

   return (
     <div>
       <h1 className='question'>
        In {year}, {countryButton} {verb(verbText, this.toggleVerb.bind(this))} {numbro(value).format('$ 0.00 a')} {product}
       </h1>
       <ReactTooltip id='resetVariable' place="bottom" type="light">
         <span>Click here to see {get(verbsCopy,variable)} data</span>
       </ReactTooltip>
       <ReactTooltip id='resetCountry' place="bottom" type="light">
         <span>Click here to see data for the continent</span>
       </ReactTooltip>
     </div>
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
