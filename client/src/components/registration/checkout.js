import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTotalPrice, createRegistration } from '../../actions/registration_actions';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';

class Checkout extends Component {
	handleCheckout() {
		const { 
			event, 
			selectedCategory, 
			selectedMeals
		} = this.props;
		
		const orders = _.values(selectedMeals);
		
		this.props.createRegistration(
			{ event, 
				category: selectedCategory,
				orders
			},
			(registration) => {
				this.props.history.push(`/registration/payment/${event._id}`);
			});
	}

	renderButton(component, buttonText) {
		return(
			<FlatButton 
				primary={true} 
				containerElement={component}
			>
				{buttonText}
			</FlatButton>
		);
	}

	renderTotalPrice() {
		const {
			selectedMeals,
			selectedCategory
		} = this.props;

		let totalPrice = selectedCategory.price;

		_.map(selectedMeals, selectedMeal => {
			totalPrice += selectedMeal.meal.price * selectedMeal.quantity;
		});

		this.props.setTotalPrice(totalPrice);

		return totalPrice;
	}

	renderMealNameAndPrice(selectedMeals) {
		return _.map(selectedMeals, selectedMeal => {
			return (
				<div key={selectedMeal.meal._id}>
					<div className="col-xs-9">
						{selectedMeal.meal.name + ' (RM '+ selectedMeal.meal.price + ') x ' + selectedMeal.quantity}
					</div>
					<div className="col-xs-3">
						{selectedMeal.meal.price * selectedMeal.quantity}
					</div>
				</div>
			);
		});
	}

	render() {
		const {
			event,
			selectedCategory,
			selectedMeals
		} = this.props;

		const backButtonLink = (event) => {
			return(
				<Link to={"/registration/meal/" + event._id}></Link>
			);
		};

		return(
			<div>
				<h2>{event.name}</h2>
				<h3>Step 3: Confirmation and Payment</h3>
				<div className="row">
					<div className="col-xs-9">
						Description
					</div>
					<div className="col-xs-3">
						Price (RM)
					</div>
				</div>
				<div className="row">
					<div className="col-xs-9">
						{selectedCategory.name}
					</div>
					<div className="col-xs-3">
						{selectedCategory.price}
					</div>
					{this.renderMealNameAndPrice(selectedMeals)}
				</div>
				<hr />
				<div className="row">
					<div className="col-xs-9">
						Total
					</div>
					<div className="col-xs-3">
						{this.renderTotalPrice()}
					</div>
				</div>
				{this.renderButton(
					backButtonLink(event),
					'Back'
				)}
				<br />
				<FlatButton
					primary={true}
					onTouchTap={this.handleCheckout.bind(this)}
				>
					Proceed to Payment
				</FlatButton>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		event: state.events[ownProps.match.params.event_id],
		selectedCategory: state.registration.selectedCategory,
		selectedMeals: state.registration.selectedMeals
	}
}

export default connect(mapStateToProps, { setTotalPrice, createRegistration })(Checkout);