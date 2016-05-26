import {
  chain,
  reduce,
  isUndefined,
  sumBy,
  get
} from 'lodash';

import d3 from 'd3';

export const dataFilter = (country, product, year, data=[]) => {
  let chainData = chain(data);
  year = parseInt(year);

  if(country) {
    chainData = chainData.filter((d) => {
      return get(d, 'country_name') === country;
    });
  }
  if(product) {
    chainData = chainData.filter((d) => {
      return get(d, 'product_name') === product;
    });
  }
  if(year) {
    chainData = chainData.filter((d) => {
      return get(d, 'year') === year;
    });
  }
  return chainData.value();
}

export const colorScale = (data = []) => {
  let max = d3.max(data);

  return d3.scale.linear()
    .domain([0, max])
    .range(['#6baed6', '#08519c']);
}

export const tradeValue = (data, variable) => {
  return  reduce(data, (memo, datum) => {
    let id = get(datum, 'country_name');

    if(isUndefined(memo[id])) {
      memo[id] = get(datum, variable);
    } else {
      memo[id] += get(datum, variable);
    }

    return memo;
  }, {})
}

export const createTreeData = (filteredData) => {
  return d3.nest()
    .key((d) => { return get(d, 'product_name') })
    .rollup((leaves) => {
      return {
        'import_value': sumBy(leaves, 'import_value'),
        'export_value': sumBy(leaves, 'export_value')
      };
    })
    .entries(filteredData);
}

export const createTreeMap = (variable, treeData) => {
  return  d3.layout.treemap()
    .children((d) => d)
    .size([375, 350])
    .sticky(true)
    .sort((a,b) => {
      return get(a, `values.${variable}`) - get(b, `values.${variable}`);
    })
    .value((d) => { return get(d, `values.${variable}`); })(treeData);
}

