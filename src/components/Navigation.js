require('normalize.css');

import React from 'react';
import { hashHistory } from 'react-router'

class Navigation extends React.Component {
  render() {
    let {
      country,
      product,
      variable
    } = this.props.location;

    let importLink = () => {
      hashHistory.replace({ pathname:'/', query: { product, country, variable: 'import_value'}});
    };

    let exportLink = () => {
      hashHistory.replace({ pathname:'/', query: { product, country, variable: 'export_value'}});
    };

    return (
      <div>
        <ul>
          <a onClick={() => hashHistory.replace('/') }>Clear</a>
        </ul>
        <ul>
          <a onClick={importLink }>Imports</a>
        </ul>
        <ul>
          <a onClick={exportLink }>Exports</a>
        </ul>
      </div>
    );
  }
}

Navigation.defaultProps = {
};

export default Navigation;
