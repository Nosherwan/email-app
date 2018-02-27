import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './list.css';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

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
				<Card className={styles.card}>
					<CardContent>
						<Typography variant="headline" component="h2">
							About:
						</Typography>
						<Typography component="p">
							* This App works along with the cabcharge-webapi app that is a separate repo on this github profile.
						</Typography>
						<Typography component="p">
							*  Both apps need to be running locally on the same machine at the same time to work.
						</Typography>
						<Typography component="p">
							* The webapi seemlessly swiches between two email provider services to push the email messages.
						</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default List;
