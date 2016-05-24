import React from 'react';
import numbro from 'numbro';
import d3 from 'd3';
import {
  chain,
  map
} from 'lodash';

export const d3treemap = (tree, country, onMouseOver) => {
  let maxArea = chain(tree)
    .first()
    .get('area')
    .value();

  return tree.map((node, i) => {
    let t =`translate(${node.x},${node.y})`;

    let pStyle = {
      maxWidth: `${node.dx}px`,
      maxHeight: `${node.dy}px`,
      padding: 5,
      margin: 0,
      fontSize: 20,
      textOverflow: 'ellipsis-word',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    };

    let p = maxArea/300 < node.area ? <p style={pStyle}> {node.key} </p> : null;

    return(
      <g key={`${node.key}-${i}`} transform={t} onMouseOver={() => { onMouseOver(node.key);}}>
        <rect className="treemap--rect" width={node.dx} height={node.dy} vector-effect="non-scaling-stroke"/>
        <foreignObject width={node.dx} height={node.dy}>
          {p}
        </foreignObject>
      </g>
    );
  });
}

export const africa = (data, country, product, year, onClick) => {
  let side = 35;
  let className = country ? 'map-country__deselected' : 'map-country';
  return data.map((d) => {
    let countryClass = d.name === country ? 'map-country__selected ' : className;
    return (
      <g key={`${d.name}-${year}`} transform={`translate(${d.x*side},${d.y*side})`} onClick={() => { onClick(d.name);}}>
        <rect width={side-2} height={side-2} y="1" x="1" className={countryClass} fill={d.color} vector-effect="non-scaling-stroke"/>
        <text x="18" y="22" className="map-country-text">{d['3digit']}</text>
      </g>
    );
  });
};

export const colorLegend = (scale) => {
  let values = scale.ticks(5);
  return map(values, (d) => {
    let style = {
      borderLeftColor: scale(d)
    }
    return (
      <li key={`${scale(d)}-${d}`} className='key Grid Grid-cell' style={style}>
        <p className='key-text'>
          {numbro(d).format('$ 0.0 a')}
        </p>
      </li>
     );
  });
}

export const topoMap = (topoJson, country, year, onClick) => {
  var projection = d3.geo.mercator().scale(280).center([80,-10]);
  let className = country ? 'topo-map__deselected' : 'topo-map';
  return topoJson.map((d,i) => {
    let name = d.properties.name;
    let countryClass = name === country ? 'topo-map__selected' : className;
    return (
      <path
        className={countryClass}
        key={i}
        onClick={() => onClick(name)}
        fill={d.color}
        d={d3.geo.path().projection(projection)(d)}
      />
    );
  })
}
