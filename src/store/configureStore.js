/* global process: true */

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import rootReducer from './reducers';
import getRootSaga from '../sagas';
import { routerMiddleware } from 'react-router-redux';
import history from '../navigation/history';
import { loadState, saveState } from '../utilities/localStorage';
import throttle from 'lodash/throttle';
// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

/**
 * configures the store before creation and after creation
 * returns the same store every time
 * @export
 * @param {any} initialState: needs to be a serialized json object (should not have special data structure like immutable.js types)
 * @returns store: redux store object
 */
export default function configureStore(initialState) {
	//TODO: Once authentication is done need to comment out local storage
	const persistedState = loadState(initialState);
	// Build the middleware for intercepting and dispatching navigation actions
	const routMiddleware = routerMiddleware(history);
	const middleware = [
		routMiddleware,
		sagaMiddleware
	];

	const composeEnhancers = typeof window === 'object' &&
		process.env.NODE_ENV === 'development' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

	const enhancer = composeEnhancers(
		applyMiddleware(...middleware),
	);

	const store = createStore(
		rootReducer,
		// initialState,
		persistedState,
		enhancer
	);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextReducer = require('./reducers/index').default;
			store.replaceReducer(nextReducer);
		});
	}

	// //TODO: after authentication
	store.subscribe(throttle(() => {
		saveState(store.getState());
	}, 1000));

	sagaMiddleware.run(getRootSaga(history));
	store.close = () => store.dispatch(END);
	return store;
}
