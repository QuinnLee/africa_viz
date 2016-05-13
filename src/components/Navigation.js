require('normalize.css');

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router'

class Navigation extends React.Component {
  render() {
    let {
      country,
      product,
      variable
    } = this.props;

    let importLink = () => {
      let currentPath = this.props.location.pathname;
      hashHistory.replace({ pathname:currentPath, query: { product, country, variable: 'import_value'}});
    };

    let exportLink = () => {
      let currentPath = this.props.location.pathname;
      hashHistory.replace({ pathname: currentPath, query: { product, country, variable: 'export_value'}});
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
          <Link to='/' className='btn'> Index </Link>
        </li>
        <li>
          <Link to='/treemap' className='btn'> Treemap </Link>
        </li>
        <li>
          <Link to='/visualization' className='btn'>All</Link>
        </li>
      </ul>
    )
  }
}

Navigation.defaultProps = {
};

function mapStateToProps(state, props){
  let {
    country,
    product,
    variable
  } = props.location.query;

  return {
    country,
    product,
    variable
  };
}

export default connect(mapStateToProps)(Navigation);
