import Api from '../api';
import { fromJS } from 'immutable';

export const loadState = (initialState = null) => {
	try {
		let serializedState = '';

		if (initialState) {
			serializedState = initialState;
		} else {
			serializedState = localStorage.getItem('state');
		}

		if (serializedState === null) {
			return undefined;
		}

		if (typeof serializedState !== 'object') {
			serializedState = JSON.parse(serializedState);
		}

		if (initialState) {
			serializedState.content.loaded = true;
			console.log('serialized state set for server and modified', serializedState);
		}

		if (serializedState && serializedState.tokens && serializedState.tokens.access_token)
			Api.setAccessToken(serializedState.tokens.access_token);
		if (serializedState && serializedState.tokens && serializedState.tokens.refresh_token)
			Api.setRefreshToken(serializedState.tokens.refresh_token);

		//	'loading' state shouldn't be saved to localStorage.
		//	this should stop saved state blocking refresh

		serializedState.ui.loading = false;

		Object.keys(serializedState).forEach(key => serializedState[key] = fromJS(serializedState[key]));

		return serializedState;
	} catch (err) {
		return undefined;
	}
};

export const saveState = state => {
	try {
		const deSerializedState = JSON.stringify(state);
		localStorage.setItem('state', deSerializedState);
	} catch (err) {
		console.log('Error while storing to local storage');
	}
};
