import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class ConfirmationPage extends Component {
	renderTotalPrice() {
		const {
			selectedMeals,
			selectedCategory
		} = this.props;

		let total = selectedCategory.price;

		_.map(selectedMeals, selectedMeal => {
			total += selectedMeal.meal.price * selectedMeal.quantity;
		});

		return total;
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

export default connect(mapStateToProps)(ConfirmationPage);