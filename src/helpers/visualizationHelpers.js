import React from 'react';
import numbro from 'numbro';
import d3 from 'd3';
import { map } from 'lodash';

export const d3treemap = (tree, country, product, action, onHover) => {

  return tree.map((node, i) => {
    let t =`translate(${node.x},${node.y})`;

    let pStyle = {
      maxWidth: `${node.dx}px`,
      maxHeight: `${node.dy}px`,
      padding: 5,
      margin: 0,
      fontSize: 19,
      overflow: 'hidden'
    };

    let fill = null;

    if(product&& product=== node.key) {
      fill = 1;
    } else if(product) {
      fill = 0.2;
    } else {
      fill = 0.5;
    }

    let rectStyle = {
      fillOpacity: fill
    }

    return(
      <g key={`${node.key}-${i}`} transform={t} onClick={() => { action(node.key);}} onMouseOver={() => onHover(node.key)}>
        <rect className="treemap--rect" style={rectStyle} width={node.dx} height={node.dy} vector-effect="non-scaling-stroke"/>
        <foreignObject width={node.dx} height={node.dy}>
         <p style={pStyle}> {node.key} </p>
        </foreignObject>
      </g>
    );
  });
}

export const africa = (data, country, product, year, onClick, onHover) => {
  let side = 31;
  let className = country ? 'map-country__deselected' : 'map-country';
  return data.map((d) => {
    let countryClass = d.name === country ? 'map-country__selected ' : className;
    return (
      <g key={`${d.name}-${year}`} transform={`translate(${d.x*side},${d.y*side})`} onClick={() => { onClick(d.name);}}>
        <rect width={side-1} height={side-1} y="1" x="1" className={countryClass} fill={d.color} onMouseOver= {()=> { onHover(d.name)}} vector-effect="non-scaling-stroke"/>
        <text x="3" y="20" className="map-country-text">{d['3digit']}</text>
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
  var projection = d3.geo.mercator().scale(250).center([90,-15]);
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
