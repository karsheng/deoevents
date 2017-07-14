import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import paypal from 'paypal-checkout';
import { ROOT_URL } from '../../constants';

class PayPalButton extends Component {
	render() {
		const Btn = paypal.Button.driver('react', {React, ReactDOM});
		const CREATE_PAYMENT_URL = `${ROOT_URL}/paypal/create-payment/${this.props.regId}`;
		const EXECUTE_PAYMENT_URL = `${ROOT_URL}/paypal/execute-payment/${this.props.regId}`;
		const token = localStorage.getItem('deotoken');

		let client = {
			sandbox: 'AVpMtwuRHrJQcuSEJeDSBANhLCZ7BvYXdMo5He0Xz8dlTiMjbzlQXRDMUkR5gMYdA9De0q8X6hYoJ2L5'
		};

		let payment = () => {
      return paypal.request({
      	method: 'post',
      	url: CREATE_PAYMENT_URL,
      	headers: {
      		authorization: token
      	}
      })
      .then(function(data) {
          return data.id;
      });
		};

		let onAuthorize = (data) => {
      return paypal.request({
      	method: 'post',
      	url: EXECUTE_PAYMENT_URL,
      	headers: {
      		authorization: token
      	},
      	json: {
					paymentID: data.paymentID,
          payerID:   data.payerID
      	} 
      }).then(function() {
          // The payment is complete!
          // You can now show a confirmation message to the customer
          console.log('done');
      });
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