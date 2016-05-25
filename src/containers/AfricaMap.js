require('normalize.css');
require('styles/App.css');

import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux';
import { get, values } from 'lodash';
import topojson from 'topojson';

import { toggleMap } from '../actions/data';
import { dataFilter, colorScale, tradeValue } from '../helpers/dataHelpers';
import { africa, topoMap } from '../helpers/visualizationHelpers';

import Legend from '../components/Legend';

class AfricaMap extends React.Component {
  onClick(currentCountry) {
    let {
      country,
      variable,
      product,
      year
    } = this.props;

    let currentPath = this.props.location.pathname;
    let query = { variable, product, year };

    if(country != currentCountry) {
      query.country = currentCountry;
    }

    hashHistory.replace({ pathname: currentPath, query: query });
  }
  render() {
    let {
      map,
      hasData,
      product,
      country,
      displayMap,
      year
    } = this.props;

    let {
      toggleMap
    } = this.props.actions;

    if(!hasData) { return (<div> loading </div>) }
    let mapSvg = null;

    if(displayMap === 'topo') {
      mapSvg = topoMap(map, country, year, this.onClick.bind(this));
    } else {
     mapSvg = (
       <g transform='translate(8,8)'>
         {africa(map, country, product, year, this.onClick.bind(this))}
       </g>
     );
    }

    return (
      <div className="Grid Grid-cell Grid-cell-center__all">
        <svg className="Grid-cell" width={400} height={350}>
          {mapSvg}
          <text transform='translate(320,325)' className='btn map-toggle' onClick={() => toggleMap() }> Toggle Map </text>
        </svg>
        <Legend {...this.props}/>
      </div>
    );
  }
}

function mapStateToProps(state, props){
  let {
    tradeData,
    hasData,
    topoJson,
    map: jsonMap,
    displayMap
  } = state.dataReducer;

  let {
    country,
    variable,
    product,
    year
  } = props.location.query;

  year =  year ? parseInt(year): 2014 ;
  variable =  variable === 'import_value' ? 'import_value' : 'export_value';
  var map = [];

  if(hasData) {
    let data = dataFilter(null, product, year, tradeData);
    let trade = tradeValue(data, variable);
    let colors = colorScale(values(trade));
    if(displayMap === 'topo') {
      map = topojson.feature(topoJson, topoJson.objects.africa)
      .features.map((d) => {
        let id = get(d, 'properties.name');
        let value = get(trade, id) || 0;
        let color = colors(value);
        return Object.assign(d, { value, color });
      });
    } else {
      map = jsonMap.map((country) => {
        let id = get(country, 'name');
        let value = get(trade, id) || 0;
        let color = colors(value);
        return Object.assign(country, { value, color });
      })
    }
  }

  return {
    map,
    hasData,
    country,
    variable,
    product,
    displayMap,
    year
  }
}

function mapDispatchToProps(dispatch) {
  const actions = { toggleMap };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(AfricaMap);
