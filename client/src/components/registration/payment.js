import React, { Component } from 'react';
import { fetchRegistrationInfo } from '../../actions/registration_actions';
import { connect } from 'react-redux';
import PayPalButton from './paypal_button';

// To be deleted after integration of payment system
import FakePaymentButton from './fake_payment_button';


class Payment extends Component {
	componentWillMount() {
		const { event_id } = this.props.match.params;
		this.props.fetchRegistrationInfo(event_id);
	}

	render() {
		const { event, totalBill } = this.props.info;
		
		if (!event) {
			return(
				<div>
					Loading...
				</div>
			);
		} 
		return(
			<div>
				<h2>Payment</h2>
				<h3>{event.name}</h3>
				Total: {totalBill}
				<PayPalButton
					regId={this.props.info._id} 
				/>
				<FakePaymentButton
					regId={this.props.info._id}
				/>
			</div>
		);
	}	
}

function mapStateToProps(state) {
	return {
		info: state.registration.info
	};
}

export default connect(mapStateToProps, { fetchRegistrationInfo })(Payment);
