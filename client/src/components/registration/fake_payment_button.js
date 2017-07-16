// to be deleted after integration of payment system
import React, { Component } from 'react';
import { ROOT_URL } from '../../constants';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';

class FakePaymentButton extends Component {
	handleFakePayment() {
		const { regId } = this.props;
		const token = localStorage.getItem('deotoken');
	
		let config = {
	    headers: { authorization: token }
	  };

		axios.post(
			`${ROOT_URL}/fakepayment/${regId}`,
			null,
			config
		)
		.then(response => {
			console.log(response);
		})
		.catch(err => {
			console.log(err);
		});

	}

	render() {
		return(
			<div>
				<FlatButton 
					secondary={true}
					onTouchTap={this.handleFakePayment.bind(this)}
				>
				Fake Payment Button
				</FlatButton>
			</div>
		);
	}
}

export default FakePaymentButton;