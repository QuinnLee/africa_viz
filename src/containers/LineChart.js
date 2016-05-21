require('normalize.css');
require('styles/App.css');

import React from 'react';
import { connect } from 'react-redux';
import { get, sumBy, map, isFinite } from 'lodash';
import { dataFilter } from '../helpers/dataHelpers';
import { hashHistory } from 'react-router';
import Dimensions from 'react-dimensions'
import numbro from 'numbro';
import d3 from 'd3';

function translateY(scale0, scale1, d) {
  var y = scale0(d);
  return 'translate(0,' + (isFinite(y) ? y : scale1(d)) + ')';
}

function translateX(scale0, scale1, d, offset) {
  var x = scale0(d);
  if(offset) { return 'translate(' + (isFinite(x) ? x - offset/2 : scale1(d)) + ',0)';}
  return 'translate(' + (isFinite(x) ? x : scale1(d)) + ',0)';
}

let boxes = (scale, func) => {
  let ticks = scale.ticks(4);
  let width = scale(ticks[1]);
  return map(ticks, (d) => {
    return (
      <g onMouseOver={() => {func(d.getFullYear())}} key={`${d}-rect`} transform={translateX(scale, scale, d, width)}>
        <rect style={{fill: 'transparent'}} width={width} height={450}/>
      </g>
    );
  });
}

let xAxis = (scale , height, topMargin, bottomMargin) => {
  let ticks = scale.ticks(4);
  let range = scale.range();
  let range0 = range[0];
  let range1 = range[range.length-1];
  let format = scale.tickFormat()
  let markers = map(ticks, (d) => {
    return (
      <g key={d} style={{opacity: 1}}  className='tick' transform={translateX(scale, scale, d)}>
        <line x2='0' y2='0' style={{opacity: 1, stroke: 'black'}}/>
        <text dy='.71em' x='0' y='12' style={{textAnchor: 'middle'}}>
          {format(d)}
        </text>
      </g>
    );
  });
  return (
    <g className='x axis' transform={`translate(0, ${height - topMargin - bottomMargin})`}>
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
  let markers = map(ticks, (d) => {
    return (
      <g key={d} style={{opacity: 1}}  className='tick' transform={translateY(scale, scale, d)}>
        <line x2='6' y2='0' style={{opacity: 1, stroke: 'black'}}/>
        <text dy='.32em' x='-50' y='0' style={{textAnchor: 'middle'}}>
          {numbro(d).format('$ 0.0 a')}
        </text>
      </g>
    );
  });
  return (
    <g className='y axis' transform='translate(110,0)'>
      <path style={{ shapeRendering: 'crispEdges', stroke: 'black', fill: 'none'}}
        d={`M-6,${range0}H0V${range1}H-6`}/>
      {markers}
      <text transform='rotate(-90)' y='6' x='-80' dy='.71em' style={{textAnchor: 'middle'}}>
      </text>
    </g>
  );
}

let yearValue = (data, xScale, yScale) => {
  return map(data, (d, i) => {
    let x = xScale(new Date(d.year, 0));
    let y = yScale(d.value);
    let xText = i === 0 ? x + 50 : x;
    return (
      <g key={`${d.year}-circle`}>
        <circle className='dot' r='3.5' cy={y} cx={x} style={{fill: 'black'}}/>
        <text dy='-1em' dx='-2em' x={xText} y={y} style={{textAnchor: 'middle'}}>
          {numbro(d.value).format('$ 0.0 a')}
        </text>
      </g>
    );
  });
}

let vertialLine = (year, scale) => {
  if(!year) { return null }
  let x = scale(new Date(year, 0));
  return ( <line x1={x} x2={x} y1="-35" y2="370" strokeWidth="0.5" stroke="black"/>);
}

class LineChart extends React.Component {
  changeYear(newYear) {
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
    var {
      data,
      hasData,
      country,
      variable,
      product,
      year
    } = this.props;

    let width = this.props.containerWidth;
    let height = this.props.containerHeight;
    let leftMargin = 130;
    let rightMargin = 20;
    let topMargin = 30;
    let bottomMargin = 50;

    let [yMin, yMax] = d3.extent(data, (d) => d.value);

    let xScale = d3.time.scale()
      .range([0, width - leftMargin - rightMargin])
      .domain([new Date(2010, 0), new Date(2014, 0)])
      .clamp(true);

    let yScale = d3.scale.linear()
      .range([height - topMargin - bottomMargin, 0])
      .domain([yMin - 0.1,  yMax + 0.1])
      .clamp(true);

    var line = d3.svg.line()
      .interpolate('monotone')
      .x((d) => { return xScale(new Date(d.year, 0)); })
      .y((d) => { return yScale(d.value); });

    let className = 'time-line';
    let lines = ( <path className={className} d={line(data)}/>);
    let circles = yearValue(data, xScale, yScale);
    if(!hasData) { return (<h1> Loading </h1>)}
    return (
      <svg width={width} height={height}>
        {yAxis(yScale)}
        <g transform={`translate(${leftMargin}, ${topMargin})`}>
          {boxes(xScale, this.changeYear.bind(this))}
          {xAxis(xScale, height, topMargin, bottomMargin)}
          {lines}
          {circles}
          {vertialLine(year, xScale)}
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

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let data = dataFilter(country, product, null, tradeData);

  data = d3.nest()
    .key((d) => get(d, 'year'))
    .rollup((leaves) =>  sumBy(leaves, variable))
    .map(data);

  data = map(data, (datum, year, memo) => {
    let previousYear = parseInt(year) - 1;
    let currentValue = get(memo, year, 0);
    let previousValue = get(memo, previousYear, 0);

    let change = ((currentValue - previousValue) / previousValue );
    change = isFinite(change) ? change : 0;

    return { year, value: datum, label: change };
  });

  return {
    hasData,
    country,
    variable,
    product,
    year,
    data: data.slice(1),
  }
}
export default connect(mapStateToProps)(Dimensions()(LineChart));
