require('normalize.css');
require('styles/App.css');

import React from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dataFilter, createTreeData, createTreeMap  } from '../helpers/dataHelpers';
import { d3treemap } from '../helpers/visualizationHelpers';

class TreeMap extends React.Component {
  onMouseOver(product) {
    let { country, variable } = this.props;
    let currentPath = this.props.location.pathname;
    hashHistory.replace({ pathname: currentPath, query: { variable, country, product }});
  }
  onMouseOut(country) {
    let { variable } = this.props;
    let currentPath = this.props.location.pathname;
    hashHistory.replace({ pathname: currentPath, query: { variable, country }});
  }
  render() {
    let {
      hasData,
      data,
      country
    } = this.props;

    if(hasData) {
      return (
        <div className='Grid Grid-cell-center__all'>
          <svg width={400} height={400} onMouseOut={() => { this.onMouseOut.call(this, country) }}>
            {d3treemap(data, country, this.onMouseOver.bind(this))}
          </svg>
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
    year,
    variable
  } = props.location.query;

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let filteredData = dataFilter(country, null, year, tradeData);

  let treeData = createTreeData(filteredData);

  return {
    hasData,
    variable,
    data: createTreeMap(variable, treeData),
    country
  }
}

export default connect(mapStateToProps)(TreeMap);
