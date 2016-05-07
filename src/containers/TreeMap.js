require('normalize.css');
require('styles/App.css');

import React from 'react';
import d3 from 'd3';
import { get, chain, sumBy } from 'lodash';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

let d3treemap = (tree, country, onMouseOver) => {
  let maxArea = chain(tree)
    .first()
    .get('area')
    .value();

  return tree.map((node, i) => {
    let t =`translate(${node.x},${node.y})`;

    let pStyle = {
      maxWidth: `${node.dx}px`,
      maxHeight: `${node.dy}px`,
      overflow: 'hidden'
    };

    let p = maxArea/100 < node.area ? <p style={pStyle}> {node.key} </p> : null;

    return(
      <g key={node.key} transform={t} onMouseOver={() => { onMouseOver(node.key);}}>
        <rect className="treemap--rect" width={node.dx} height={node.dy} vector-effect="non-scaling-stroke"/>
        <foreignObject width={node.dx} height={node.dy}>
          {p}
        </foreignObject>
      </g>
    );
  });
}

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
      country,
      variable,
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

let dataFilter = (country, data) => {
  let chain = _.chain(data);
  if(country) {
    chain = chain.filter((d) => {
      return get(d, 'country_name') === country;
    });
  }
  return chain.value();
}

function mapStateToProps(state, props){
  let {
    tradeData,
    hasData,
  } = state.dataReducer

  let {
    country,
    product,
    variable
  } = props.location.query;

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  let filteredData = dataFilter(country, tradeData);

  let treeData = d3.nest()
    .key((d) => { return get(d, 'product_name') })
    .rollup((leaves) => {
      return {
        import_value: sumBy(leaves, 'import_value'),
        export_value: sumBy(leaves, 'export_value'),
     };
    })
    .entries(filteredData);

  var treemap = d3.layout.treemap()
    .children((d) => d)
    .size([400, 400])
    .sticky(true)
    .sort((a,b) => {
      return get(a, `values.${variable}`) - get(b, `values.${variable}`);
    })
    .value((d) => { return get(d, `values.${variable}`); });

  return {
    hasData,
    variable,
    data: treemap(treeData),
    country
  }
}

export default connect(mapStateToProps)(TreeMap);
