import React from 'react';
import ReactDOM from 'react-dom/server';
import configureStore from './client/store/configureStore';
import Root from './client/containers/Root';
import Html from './html';

export default function (initialState = {}) {
  if (process.env.NODE_ENV === 'development') {
    webpackIsomorphicTools.refresh();
  }

  const store = configureStore(initialState);

  const component = (
    <Root store={store} />
  );

  const render = ReactDOM.renderToString(
    <Html
      assets={webpackIsomorphicTools.assets()}
      component={component}
      store={store}
    />
  );

  return (
    `<!doctype html>\n${render}`
  );
}
