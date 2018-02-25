import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';

const render = Component => {
	ReactDOM.render(
		<AppContainer options={{}}>
			<Component />
		</AppContainer>,
		document.getElementById('app'));
}

render(AppContainer);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/AppContainer', () => {
    render(AppContainer)
  })
}
