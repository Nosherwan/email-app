import { ActionTypes } from '../constants';

export function addEmail(email, type) {
	return {
		type: ActionTypes.ADD_EMAIL,
		payLoad: { email: email, type: type }
	};
}

export function sendEmails(message) {
	return {
		type: ActionTypes.SEND_EMAILS,
		payLoad: { message: message }
	};
}

export function clearEmails() {
	return {
		type: ActionTypes.CLEAR_EMAILS,
		payLoad: true
	};
}

export function showSearch() {
	return {
		type: ActionTypes.SEARCH_SHOW,
		payLoad: true
	};
}