import { connect } from 'react-redux';
import Main from '../components/Main';
import {
	addEmail,
	clearEmails,
	sendEmails
} from '../actions';

const mapStateToProps = state => {
	const {
		ui,
	} = state;

	const isLoading = ui.get('loading');
	const message = ui.get('message');
	const emails = ui.get('emails');

	return {
		isLoading,
		emails,
		message
	};
};

const mapDispatchToProps = dispatch => {
	return {
		handleAddEmail: (email, type) => dispatch(addEmail(email, type)),
		handleClearEmails: () => dispatch(clearEmails()),
		handleSendEmails: message => dispatch(sendEmails(message))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
