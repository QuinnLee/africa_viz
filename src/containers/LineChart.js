require('normalize.css');
require('styles/App.css');

import React from 'react';
import { connect } from 'react-redux';
import { get, sumBy, map, isFinite } from 'lodash';
import d3 from 'd3';

function translateX(scale0, scale1, d) {
  var x = scale0(d);
  return 'translate(' + (isFinite(x) ? x : scale1(d)) + ',0)';
}

function translateY(scale0, scale1, d) {
  var y = scale0(d);
  return 'translate(0,' + (isFinite(y) ? y : scale1(d)) + ')';
}
let boxes = (scale) => {
  let ticks = scale.ticks(4);
  let width= scale(ticks[1]);
  return map(ticks, (d) => {
    return (
      <g key={`${d}-rect`} transform={translateX(scale, scale, d)}>
        <rect style={{fill: 'none'}} width={width} height={400}/>
      </g>
    );
  });
}

let xAxis = (scale) => {
  let ticks = scale.ticks(4);
  let range = scale.range();
  let range0 = range[0];
  let range1 = range[range.length-1];
  let format = scale.tickFormat()
  let markers = map(ticks, (d) => {
    return (
      <g key={d} style={{opacity: 1}}  className='tick' transform={translateX(scale, scale, d)}>
        <line x2='0' y2='6' style={{opacity: 1, stroke: 'black'}}/>
        <text dy='.71em' x='0' y='12' style={{textAnchor: 'middle'}}>
          {format(d)}
        </text>
      </g>
    );
  });
  return (
    <g className='x axis' transform='translate(0, 360)'>
      <path style={{ shapeRendering: 'crispEdges', stroke: 'black', fill: 'none'}}
        d={`M${range0},6V0H${range1}V6`} />
      {markers}
    </g>
  );
}

let yAxis = (scale) => {
  let ticks = scale.ticks(4);
  let range = scale.range();
  let range0 = range[0];
  let range1 = range[range.length-1];
  let format = d3.format('%');
  let markers = map(ticks, (d) => {
    return (
      <g key={d} style={{opacity: 1}}  className='tick' transform={translateY(scale, scale, d)}>
        <line x2='6' y2='0' style={{opacity: 1, stroke: 'black'}}/>
        <text dy='.32em' x='-30' y='0' style={{textAnchor: 'middle'}}>
          {format(d)}
        </text>
      </g>
    );
  });
  return (
    <g className='y axis'>
      <path style={{ shapeRendering: 'crispEdges', stroke: 'black', fill: 'none'}}
        d={`M-6,${range0}H0V${range1}H-6`}/>
      {markers}
      <text transform='rotate(-90)' y='6' x='-50' dy='.71em' style={{textAnchor: 'middle'}}>
        % Change
      </text>
    </g>
  );
}

class LineChart extends React.Component {
  render() {
    var {
      data,
      line,
      hasData,
      xScale,
      yScale
    } = this.props;

    let className = 'time-line';
    let lines = map(data, function(d) {
      return (
        <path key={d.group} className={className} d={line(d.series)}/>
      );
    })
   let mouseOver = this.onMouseOver.bind(this);
   if(!hasData) { return (<h1> Loading </h1>)}
   return (
     <svg width={500} height={400}>
      <g transform='translate(60, 10)'>
        {boxes(xScale, mouseOver)}
        {yAxis(yScale)}
        {xAxis(xScale)}
        {lines}
      </g>
     </svg>
    )
  }
}

function mapStateToProps(state, props){
  let {
    hasData,
    tradeData
  } = state.dataReducer;

  let {
    country,
    variable,
    product,
    year
  } = props.location.query;

  let { pathname } = props.location;

  let groupByVariable = pathname === '/' ? 'country_name' : 'product_name';
  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let data = d3.nest()
    .key((d) => get(d, groupByVariable))
    .key((d) => get(d, 'year'))
    .rollup((leaves) =>  sumBy(leaves, variable))
    .map(tradeData);

  var yMin =  Number.POSITIVE_INFINITY;
  var yMax =  Number.NEGATIVE_INFINITY;
  var years = [2010, 2011, 2012, 2013, 2014];

  data = map(data, (datum, group) => {
    let series = map(years, (year) => {
      let previousYear = parseInt(year) - 1;
      let currentValue = get(datum, year, 0);
      let previousValue = get(datum, previousYear, 0);
      let change = ((currentValue - previousValue) / previousValue );
      change = isFinite(change) ? change : 1;
      if(!product && !country) {
        yMin = change < yMin ? change : yMin;
        yMax = change > yMax ? change : yMax;
      }
      return { year: year, value: change };
    })
    if(group === product || group === country) {
      [yMin, yMax] = d3.extent(series, (d) => d.value);
    } else {
      if(country || product) { return { group, series: []} }
    }
    return { group, series };
  });

  let xScale = d3.time.scale()
    .range([0, 420])
    .domain([new Date(2010, 0), new Date(2014, 0)]);

  let yScale = d3.scale.linear()
    .range([350, 0])
    .domain([yMin - (yMin/10) ,  yMax + 0.1])
    .clamp(true);

  var line = d3.svg.line()
    .interpolate('basis')
    .x((d) => { return xScale(new Date(d.year, 0)); })
    .y((d) => { return yScale(d.value); });

  return {
    hasData,
    country,
    variable,
    product,
    year,
    groupByVariable,
    line,
    data,
    xScale,
    yScale
  }
}
export default connect(mapStateToProps)(LineChart);
