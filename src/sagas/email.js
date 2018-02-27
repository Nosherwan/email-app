import {
	select,
	// take,
	call,
	put,
	// getContext
} from 'redux-saga/effects';
import { ActionTypes } from '../constants';
import Api from '../api';
import { getStateUIEmails } from '../store/reducers/ui';

export function* sendEmails(action) {
	try {
		const emails = [];
		const stateEmails = yield select(getStateUIEmails);
		stateEmails.map(item => {
			emails.push({ email: item.get('email'), type: item.get('type') });
		});

		const result = yield call(Api.postJSON,
			'api/email', {
				data: {
					emails: emails,
					message: action.payLoad.message
				},
				authorization: true
			});
		if (result && result.status === 200) {
			yield put({
				type: ActionTypes.SEND_EMAILS_SUCCEEDED,
				payLoad: { message: 'success' }
			});
		} else {
			yield put({
				type: ActionTypes.SEND_EMAILS_FAILED,
				payLoad: { message: 'failed' }
			});
		}
	} catch (error) {
		yield put({
			type: ActionTypes.SEND_EMAILS_FAILED,
			error
		});
	}
}
