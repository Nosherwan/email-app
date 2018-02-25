import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// import jobs from './jobs';
// import tradies from './tradies';
import ui from './ui';

const appReducer = combineReducers({
	ui,
	router: routerReducer
});

const rootReducer = (state, action) => {
	if ((action.type === 'LOGOUT_REQUESTED') || (action.type === 'SOFT_RESET')) {
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
