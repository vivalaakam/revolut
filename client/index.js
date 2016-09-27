import React from 'react';
import ReactDOM from 'react-dom';

import style from  './styles/main.scss';
import 'normalize.css';
import {configureStore} from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

const root = document.getElementById('root')

root.classList.add(style.root);

ReactDOM.render(
    <Root store={store}/>,
    root
);
