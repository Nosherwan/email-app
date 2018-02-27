import { ActionTypes } from '../../constants';
import { Map, List } from 'immutable';

export default function ui(state = Map({
	message: '',
	reload: false,
	loading: false,
	emails: List(),
}), action) {

	switch (action.type) {
		case ActionTypes.ADD_EMAIL:
			return state.withMutations(state => {
				state.update('emails', emails => emails.unshift(Map({ email: action.payLoad.email, type: action.payLoad.type })));
				state.set('message', '');
			});
		case ActionTypes.CLEAR_EMAILS:
			return state.withMutations(state => {
				state.set('emails', List());
				state.set('message', '');
			});
		case ActionTypes.SEND_EMAILS:
			return state.set('message', '');
		case ActionTypes.SEND_EMAILS_SUCCEEDED:
			return state.withMutations(state => {
				state.set('emails', List());
				state.set('message', 'Emails sent successfully');
			});
		case ActionTypes.SEND_EMAILS_FAILED:
			return state.set('message', 'Unable to deliver emails, please try again');
		default:
			return state;
	}
}

export function getStateUIEmails(state) {
	return state.ui.get('emails');
}
