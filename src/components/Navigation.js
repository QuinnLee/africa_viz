require('normalize.css');

import React from 'react';
import classNames from 'classnames';
import { Link, hashHistory } from 'react-router'

class Navigation extends React.Component {
  render() {
    let {
      country,
      product,
      variable,
      year
    } = this.props.location.query;

    let currentPath = this.props.location.pathname;
    let productQuery = Object.assign({}, this.props.location.query);
    delete productQuery.country;

    let importLink = () => {
      hashHistory.replace({ pathname:currentPath, query: { product, country, year, variable: 'import_value'}});
    };

    let exportLink = () => {
      hashHistory.replace({ pathname: currentPath, query: { product, country, year, variable: 'export_value'}});
    };

    let importClass = classNames('Grid-cell', { active: variable === 'import_value'});
    let exportClass = classNames('Grid-cell', { active: variable != 'import_value'});

    return (
      <ul className="Grid Grid--Nav">
        <li className={exportClass}>
          <a className='btn' onClick={exportLink.bind(this)}>Exports</a>
        </li>
        <li className={importClass}>
          <a className='btn' onClick={importLink.bind(this)}>Imports</a>
        </li>
        <li>
          <Link to={{pathname: '/', query: this.props.location.query}} className='btn'>
            Africa
          </Link>
        </li>
        <li>
          <Link to={{pathname: '/treemap', query: productQuery }} className='btn'>
            Products
          </Link>
        </li>
        <li>
          <Link to={{pathname: '/visualization', query: this.props.location.query}} className='btn'>
            Africa & Products
          </Link>
        </li>
      </ul>
    )
  }
}

Navigation.defaultProps = {
};

export default Navigation;
