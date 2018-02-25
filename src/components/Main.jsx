import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './main.css';
import _ from 'lodash';
import classnames from 'classnames';
import { List } from 'immutable';

class Main extends PureComponent {

	static defaultProps = {
		message: '',
		emails: List(),
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
			emailValid: false
		};
	}

	typeHandler = e => {
		const { target: { value } } = e;
		this.setState({
			typedEmail: value
		});
		this.handleChange(value);
	}

	_handleChange = text => {
		this.setState(() => ({
			emailValid: this.validateEmail(text)
		}));
	}

	addEmail = () => {
		if (this.state.emailValid)
			this.props.handleAddEmail(this.state.typedEmail, this.selectList.value);
	}

	clearEmailList = () => this.props.handleClearEmails();

	renderEmailList = () => {
		const { emails } = this.props;
		const list = [];
		if (emails.size > 0) {
			emails.map((item, i) => {
				list.push(<li key={i}>{item.get('type') + ': ' + item.get('email')}</li>);
			});
			return (
				<ul>
					{list}
				</ul>
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
		this.props.handleSendEmails(this.textarea.value);
	}

	render() {
		const { typeHandler, addEmail, clearEmailList, submitForm, state } = this;
		return (
			<div
				className={styles.layout}>
				<div>
					<Link to='/list'>About</Link>
				</div>
				<p>
					{'Please provide one or more email addresses to send email to:'}
				</p>
				<p>{this.props.message}</p>
				<div className={styles.group}>
					<select
						ref={ref => this.selectList = ref}
						name="text"
						className={classnames(styles.emailGroup)}>
						<option value="to">To</option>
						<option value="cc">CC</option>
						<option value="bcc">BCC</option>
					</select>
					<input
						className={classnames(styles.emailInput, styles.emailGroup)}
						type="text"
						name={'email-input'}
						placeholder={'Please type in email address'}
						onChange={typeHandler}
						defaultValue={state.typedEmail} />
				</div>
				{this.renderEmailList()}
				<div
					onClick={addEmail}
					className={classnames({
						[styles.button]: state.emailValid,
						[styles.disabled_button]: !state.emailValid
					})}
				>Add Email</div>
				<div
					onClick={clearEmailList}
					className={styles.button}
				>Clear Email List</div>
				<textarea
					ref={ref => this.textarea = ref}
					className={classnames(styles.emailGroup, styles.emailTextArea)}
					name={'text-input'}
					placeholder={'Please type in message.'}
				/>
				<span className={styles.button}>
					<button
						className={styles.submit_button}
						type='button'
						onClick={this.submitForm}
					>Send Emails</button>
				</span>
			</div>
		);
	}
}

export default Main;
