import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './list.css';

class List extends PureComponent {

	static defaultProps = {
		options: {},
	}

	static propTypes = {
		options: PropTypes.object,
	}

	constructor(props) {
		super(props);
	}

	display = () => {
		return 'this applicaiotn allows the user to send emails to multiple recepients. Please add some email addresses, as a second step add some text to send as email. There is no validation for the actul email message on the client hence the send will fail.';
	}

	render() {
		return (
			<div className={styles.layout}>
				<div>
					<Link to='/main'>Main</Link>
				</div>
				{this.display()}
			</div>
		);
	}
}

export default List;
