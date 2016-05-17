require('normalize.css');

import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'

let timeline = (years, currentYear = 2014, onClick) => {
  return years.map((year) => {
    let isActive = year == currentYear ? 'active' : null;
    return (
      <li
        key={year}
        onClick={()=> {onClick(year)}}
        className={`Grid-cell Grid-cell--timeline btn ${isActive}`}
      >
        { year }
      </li>
    );
  });
}

class Timeline extends React.Component {
  onClick(newYear) {
    let {
      country,
      variable,
      product,
      year
    } = this.props;

    let currentPath = this.props.location.pathname;
    let query =  { country, variable, product, year };

    if(year !== newYear) {
      query.year = newYear;
    }

    hashHistory.replace({ pathname: currentPath, query });
  }
  render() {
    let {
      year,
      years,
      hasData
    } = this.props;

    if(!hasData) {
      return ( null);
    }

    return (
      <ul className="Grid">
        {timeline(years, year, this.onClick.bind(this))}
      </ul>
    )
  }
}

function mapStateToProps(state, props){
  let { hasData } = state.dataReducer;
  let {
    country,
    product,
    variable,
    year
  } = props.location.query;

  let years = [2009, 2010, 2011, 2012, 2013, 2014];

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';
  year =  year ? year: 2014 ;

  return {
    country,
    product,
    variable,
    year,
    years,
    hasData
  };
}
export default connect(mapStateToProps)(Timeline);
