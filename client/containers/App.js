import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AppWidget from '../components/App';
import * as userActions from '../reducers/user';
import * as formActions from '../reducers/form';

@connect(
    state => ({
        user: state.user,
        error: state.error,
        form: state.form
    }),
    dispatch => ({
        actions: bindActionCreators({...userActions, ...formActions}, dispatch)
    })
)
export default class App extends Component {

    static propTypes = {};

    render() {
        const {user, error, form, actions, dispatch} = this.props;

        return (
            <AppWidget {...{user, error, form, actions, dispatch}} />
        );
    }
}
