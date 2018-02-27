import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './main.css';
import _ from 'lodash';
import { List as _List } from 'immutable';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import DraftsIcon from 'material-ui-icons/Drafts';
import List from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

class Main extends PureComponent {

	static defaultProps = {
		message: '',
		emails: _List(),
		handleAddEmail: null,
		handleClearEmails: null,
		handleSendEmails: null
	}

	static propTypes = {
		message: PropTypes.string,
		emails: PropTypes.object,
		handleAddEmail: PropTypes.func,
		handleClearEmails: PropTypes.func,
		handleSendEmails: PropTypes.func,
	}

	constructor(props) {
		super(props);
		this.handleChange = _.debounce(this._handleChange, 200);
		this.state = {
			typedEmail: '',
			emailValid: false,
			type: 'to',
			typedText: '',
		};
	}

	typeHandler = e => {
		const { target: { value } } = e;
		this.setState(() => ({
			typedEmail: value
		}));
		this.handleChange(value);
	}

	handleTypedTextChange = e => {
		const { target: { value } } = e;
		this.setState(() => ({
			typedText: value
		}));
	}

	handleTypeChange = e => {
		const { target: { value } } = e;
		this.setState(() => ({
			type: value
		}));
	}

	_handleChange = text => {
		this.setState(() => ({
			emailValid: this.validateEmail(text)
		}));
	}

	addEmail = () => {
		if (this.state.emailValid && this.state.typedEmail)
			this.props.handleAddEmail(this.state.typedEmail, this.state.type);
		this.setState(() => ({
			typedEmail: '',
			emailValid: false
		}));
	}

	clearEmailList = () => this.props.handleClearEmails();

	renderEmailList = () => {
		const { emails } = this.props;
		const list = [];
		if (emails.size > 0) {
			emails.map((item, i) =>
				list.push(
					<ListItem button key={i}>
						<ListItemIcon key={i}>
							<DraftsIcon key={i} />
						</ListItemIcon>
						<ListItemText primary={item.get('type') + ': ' + item.get('email')} />
					</ListItem>
				)
			);
			return (
				<List component="nav">
					{list}
				</List>
			);
		} else {
			return null;
		}
	}

	validateEmail = email => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	submitForm = () => {
		this.props.handleSendEmails(this.state.typedText);
	}

	render() {
		const {
			handleTypedTextChange,
			typeHandler,
			addEmail,
			clearEmailList,
			state } = this;
		return (
			<div
				className={styles.layout}>
				<div>
					<Link to='/list'>About</Link>
				</div>
				<Card className={styles.card}>
					<CardContent>
						<Typography variant="headline" component="h2">
							Send Text Emails
						</Typography>
						<Typography component="p">
							This App allows you to send a text email message to multiple recepients:
						</Typography>
						<Typography component="p">
							1. Please select a type from the dropdown below, and type an email address to add it to the list. Add as many as you like, but make sure there is at least one to: address added.
						</Typography>
						<Typography component="p">
							2. Then type the text in the multiline input that should be sent with the test message, and press the send Emails button.
						</Typography>
					</CardContent>
				</Card>
				<div className={styles.group}>
					<Select
						value={this.state.type}
						onChange={this.handleTypeChange}
						autoWidth={true}
					>
						<MenuItem value={'to'}>To</MenuItem>
						<MenuItem value={'cc'}>CC</MenuItem>
						<MenuItem value={'bcc'}>BCC</MenuItem>
					</Select>
					<Input
						fullWidth={true}
						error={!state.emailValid}
						placeholder={'Please type in email address'}
						onChange={typeHandler}
						value={state.typedEmail}
					/>
				</div>
				<Button
					onClick={addEmail}
					disabled={!state.emailValid}
					variant="raised" color="primary">
					Add Email
				</Button>
				{this.renderEmailList()}
				<Button
					onClick={clearEmailList}
					variant="raised" color="primary">
					Clear Email List
				</Button>
				<Input
					multiline={true}
					className={styles.emailTextArea}
					placeholder={'Please type in message to be sent...'}
					onChange={handleTypedTextChange}
					value={state.typedText}
				/>
				<span className={styles.button}>
					<Button
						variant="raised" color="primary"
						onClick={this.submitForm}
					>Send Emails</Button>
				</span>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={this.props.message}
					autoHideDuration={6000}
					SnackbarContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={<span id="message-id">{this.props.message}</span>}
				/>
			</div>
		);
	}
}

export default Main;
