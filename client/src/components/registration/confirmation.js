import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRegistrationInfo } from '../../actions/registration_actions';


class ConfirmationPage extends Component {
	componentWillMount() {
		const { registration_id } = this.props.match.params;
		this.props.fetchRegistrationInfo(registration_id, registration => {
			// TODO: if no registration found, show default error page
			// if registration is not paid, redirect to payment
			if (!registration.paid) {
				this.props.history.push(`/registration/payment/${registration_id}`)
			} 
		});
	}

	render() {
		const { event, totalBill } = this.props.info;
		return(
			<div>
				<h2>Confirmation</h2>
				<h3>{event.name}</h3>
				<p>Total: RM {totalBill}</p>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		info: state.registration.info		
	};
}

export default connect(mapStateToProps, { fetchRegistrationInfo })(ConfirmationPage);