require('normalize.css');
require('styles/App.css');

import React from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dataFilter, createTreeData, createTreeMap  } from '../helpers/dataHelpers';
import { d3treemap } from '../helpers/visualizationHelpers';

class TreeMap extends React.Component {
  onMouseOver(product) {
    let { country, variable, year } = this.props;
    let currentPath = this.props.location.pathname;
    hashHistory.replace({ pathname: currentPath, query: { variable, country, product, year }});
  }
  onMouseOut(country) {
    let { variable, year } = this.props;
    let currentPath = this.props.location.pathname;
    hashHistory.replace({ pathname: currentPath, query: { variable, country, year }});
  }
  render() {
    let {
      hasData,
      data,
      country
    } = this.props;

    if(hasData) {
      return (
        <svg className="treemap" width={375} height={400} onMouseOut={() => { this.onMouseOut.call(this, country) }}>
          {d3treemap(data, country, this.onMouseOver.bind(this))}
        </svg>
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
    year
  }
}

export default connect(mapStateToProps)(TreeMap);
