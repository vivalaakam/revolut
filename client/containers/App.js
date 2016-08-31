import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AppWidget from '../components/App';
import * as userActions from '../reducers/user';
@connect(
    state => ({
        user: state.user
    }),
    dispatch => ({
        actions: bindActionCreators(userActions, dispatch)
    })
)
export default class App extends Component {

    static propTypes = {};


    render() {
        const {user, actions, dispatch} = this.props;

        return (
            <AppWidget {...{user, actions, dispatch}} />
        );
    }
}
