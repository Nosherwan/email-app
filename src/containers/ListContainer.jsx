import { connect } from 'react-redux';
import List from '../components/List';

const mapStateToProps = state => {
	const {
		ui,
	} = state;

	const isLoading = ui.get('loading');
	const current = ui.get('current');

	return {
		isLoading,
		current
	};
};

const mapDispatchToProps = dispatch => {
	return {
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
