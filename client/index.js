import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.scss';
import 'normalize.css';
import {configureStore} from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

ReactDOM.render(
    <Root store={store}/>,
    document.getElementById('root')
);
