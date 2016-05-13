require('normalize.css');

import React from 'react';
import { connect } from 'react-redux';
import { values } from 'lodash';

import { dataFilter, tradeValue, colorScale } from '../helpers/dataHelpers';
import { colorLegend } from '../helpers/visualizationHelpers';

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

function mapStateToProps(state, props){
  let {
    product,
    variable,
    year
  } = props.location.query;

  let { tradeData } = state.dataReducer;

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let data = dataFilter(null, product, year, tradeData);
  let trade = values(tradeValue(data, variable));
  let colors = colorScale(trade)

  return {
    colors
  };
}

export default connect(mapStateToProps)(Legend);
