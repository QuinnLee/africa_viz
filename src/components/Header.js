require('normalize.css');
require('styles/App.css');

import React, {
  Component
} from 'react';

import { connect } from 'react-redux';
import { get, chain } from 'lodash';
//

class Header extends Component {
  render() {
    let {
      country,
      product,
      variable,
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

    let header = 'In 2014, what was trade between Africa and China?'

    if(country && product) {
      header = `${country} ${get(verbs, variable)} ${value} of ${product} ${get(destination, variable)} China`;
    } else if(country && !product) {
      header = `${country} ${get(verbs, variable)} ${value} ${get(destination, variable)} China`;
    } else if(!country && product) {
      header = `Africa ${get(verbs, variable)} ${value} of ${product} ${get(destination, variable)} China`;
    }

   return (
     <div>
       <h1>
        {header}
       </h1>
     </div>
    );
  }
}

let dataFilter = (country, product,  data) => {
  let chainData = chain(data);
  if(country) {
    chainData = chainData.filter((d) => {
      return get(d, 'country_name') === country;
    });
  }
  if(product) {
    chainData = chainData.filter((d) => {
      return get(d, 'product_name') === product;
    });
  }
  return chainData.value();
}


function mapStateToProps(state, props){
  let {
    tradeData,
  } = state.dataReducer

  let {
    country,
    product,
    variable
  } = props.location.query;

  let data = dataFilter(country, product, tradeData);

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let value = _.sumBy(data, (d) => { return get(d, variable);});

  return {
    country,
    product,
    variable,
    value
  };
}

export default connect(mapStateToProps)(Header);
