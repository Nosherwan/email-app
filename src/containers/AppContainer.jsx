import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import history from '../navigation/history';
import PropTypes from 'prop-types';
import configureStore from '../store/configureStore';
// import Routes from '../navigation/routes';
import Api from '../api';
import Routes from '../navigation/routes';

class AppContainer extends PureComponent {

	static defaultProps = {
		options: {},
	}

	static propTypes = {
		options: PropTypes.object,
	}

	constructor(props) {
		super(props);
		const { options } = this.props;
		this.store = configureStore();
		Api.setStore(this.store);
	}

	render() {
		return (
			<Provider store={this.store}>
				<ConnectedRouter history={history}>
					<Routes />
				</ConnectedRouter>
			</Provider>
		);
	}
}

export default AppContainer;
