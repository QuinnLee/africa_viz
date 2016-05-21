import React from 'react';
import numbro from 'numbro';

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
  let side = 34;
  let className = country ? 'map-country__deselected' : 'map-country';
  return data.map((d) => {
    let countryClass = d.name === country ? 'map-country__selected ' : className;
    return (
      <g key={`${d.name}-${year}`} transform={`translate(${d.x*side},${d.y*side})`} onClick={() => { onClick(d.name);}}>
        <rect width={side} height={side} className={countryClass} fill={d.color} vector-effect="non-scaling-stroke"/>
        <text x="16" y="22" className="map-country-text">{d['3digit']}</text>
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
          {numbro(d).format('$ 0 a')}
        </p>
      </li>
     );
  });
}
