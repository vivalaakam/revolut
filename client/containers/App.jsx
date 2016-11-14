import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppWidget from '../components/App';
import * as userActions from '../reducers/user';
import * as formActions from '../reducers/form';

const actionsDispatch = dispatch => ({
  actions: bindActionCreators({ ...userActions, ...formActions }, dispatch)
});

function App({ user, error, form, actions }) {
  return (
    <AppWidget {...{ user, error, form, actions }} />
  );
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(state => state, actionsDispatch)(App);
