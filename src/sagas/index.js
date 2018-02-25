import {
	select,
	take,
	setContext,
	takeLatest
} from 'redux-saga/effects';
import { ActionTypes } from '../constants';
import {
	sendEmails,
} from './email';

/**
 * Use of take & select effects for a action pull style of programming
 * allows more granular control of async flow processing
 */
function* watchAndLog() {
	while (true) {
		const action = yield take('*');
		const state = yield select();

		console.log('action', action);
		console.log('state after', state);
	}
}

/*
	Starts fetch on each dispatched `DEFAULT_FETCH_REQUESTED` action.
	Allows concurrent fetches of portfolio.
*/
// function* mySaga() {
// 	yield* takeEvery('DEFAULT_FETCH_REQUESTED', fetchPortfolio);
// }

/*
	Alternatively you may use takeLatest.
	
	Does not allow concurrent fetches of data. If "DATA_FETCH_REQUESTED" gets
	dispatched while a fetch is already pending, that pending fetch is cancelled
	and only the latest one will be run.
*/

function* sendEmailsSaga() {
	yield takeLatest(ActionTypes.SEND_EMAILS, sendEmails);
}

const mobileRootSaga = history => {

	return function* rootSaga() {

		yield setContext({ history: history });

		yield [
			// loginFlow(),
			watchAndLog(),
			sendEmailsSaga(),
		];
	};
};

export default mobileRootSaga;
