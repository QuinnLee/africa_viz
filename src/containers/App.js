import React, {
  Component,
  PropTypes
} from 'react';

import { fetchMapData } from '../actions/data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';

/* Populated by react-webpack-redux:reducer */
class App extends Component {
  componentDidMount() {
    const { fetchMapData } = this.props.actions;
  }
  render() {
    let { children } = this.props;
    return (
      <main>
        <Navigation/>
        {children}
      </main>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state){
  return {
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {fetchMapData};
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
