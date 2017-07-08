import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import paypal from 'paypal-checkout';
import { ROOT_URL } from '../../constants';

class PayPalButton extends Component {
	render() {
		const Btn = paypal.Button.driver('react', {React, ReactDOM});
		const CREATE_PAYMENT_URL = `${ROOT_URL}/paypal/create-payment`;
		const EXECUTE_PAYMENT_URL = `${ROOT_URL}/paypal/execute-payment`;

		let client = {
			sandbox: 'AVpMtwuRHrJQcuSEJeDSBANhLCZ7BvYXdMo5He0Xz8dlTiMjbzlQXRDMUkR5gMYdA9De0q8X6hYoJ2L5'
		};

		let payment = () => {

		};

		let onAuthorize = (data, actions) => {

		};

    return (
	  	<div>
        <Btn env={'sandbox'}
          client={client}
          payment={payment}
          commit={true}
          onAuthorize={onAuthorize}
        />
	  	</div>
    );
	}
}

export default PayPalButton;