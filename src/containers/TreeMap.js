require('normalize.css');
require('styles/App.css');

import React from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dataFilter, createTreeData, createTreeMap  } from '../helpers/dataHelpers';
import { d3treemap } from '../helpers/visualizationHelpers';
import ReactTooltip from 'react-tooltip';

class TreeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hoverProduct:  null};
  }
  onHover(product) {
    this.setState({ hoverProduct: product });
  }
  onClick(currentProduct) {
    let {
      country,
      variable,
      product,
      year
    } = this.props;

    let currentPath = this.props.location.pathname;
    let query = { variable, country, year };

    if(product != currentProduct) {
      query.product= currentProduct;
    }

    hashHistory.replace({ pathname: currentPath, query: query });
  }
  render() {
    let {
      hasData,
      data,
      product,
      country
    } = this.props;

    let tooltip = null;
    if(this.state.hoverProduct) {
      tooltip = (
        <ReactTooltip id='onProduct' type='error'>
          <span>{this.state.hoverProduct}</span>
        </ReactTooltip>
      );
    }

    if(hasData) {
      return (
        <div>
          <svg data-tip data-for='onProduct' className="treemap" width={375} height={350}>
            {d3treemap(data, country, product,  this.onClick.bind(this), this.onHover.bind(this))}
          </svg>
          {tooltip}
        </div>
       );
    } else  {
      return ( <div> loading </div>);
    }
  }
}

function mapStateToProps(state, props){
  let {
    tradeData,
    hasData
  } = state.dataReducer

  let {
    country,
    product,
    year,
    variable
  } = props.location.query;

  year =  year ? parseInt(year): 2014 ;
  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let filteredData = dataFilter(country, null, year, tradeData);
  let treeData = createTreeData(filteredData);

  return {
    hasData,
    variable,
    data: createTreeMap(variable, treeData),
    country,
    product,
    year
  }
}

export default connect(mapStateToProps)(TreeMap);
