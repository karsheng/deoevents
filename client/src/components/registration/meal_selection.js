import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import MealCard from './meal_card';
import _ from 'lodash';
import { resetMealSelection } from '../../actions/registration_actions';

class MealSelection extends Component {

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

	componentWillMount() {
		const { selectedCategory, selectedMeals } = this.props;
		const { event_id } = this.props.match.params;

		if (!selectedCategory) return this.props.history.push(`/event/${event_id}`);
		if (selectedCategory.event !== event_id) return this.props.history.push(`/event/${event_id}`);
		// if selectedMeals' event is not equal to event_id
		// set selectedMeals to {} with resetMealSelection action
		if (!_.findKey(selectedMeals, {event: event_id})) this.props.resetMealSelection();
	}

	renderMealForm(event) {
		return event.meals.map((meal) => {
			return(
				<MealCard
					key={meal._id} 
					meal={meal}
					event={event}
				/>
			);
		});
	}

	render()	{
		const { event } = this.props;
		if (!event) {
			return(
				<CircularProgress />
			);
		}

		const backButtonLink = (event) => {
			return(
				<Link to={"/registration/category/" + event._id}></Link>
			);
		};
		
		const nextButtonLink = (event) => {
			return(
				<Link to={"/registration/checkout/" + event._id}></Link>
			);
		};

		return(
			<div>
				<h2>{event.name}</h2>
				<h3>Step 2: Select Meal</h3>
				<div className="row">
					{this.renderMealForm(event)}
				</div>
				<br />
				{this.renderButton(
					backButtonLink(event),
					'Back'
				)}
				<br />
				{this.renderButton(
					nextButtonLink(event),
					'Next'
				)}
			</div>
		);


	}
}

function mapStateToProps(state, ownProps) {
	return {
		event: state.events[ownProps.match.params.event_id],
		selectedCategory: state.registration.selectedCategory,
		selectedMeals: state.registration.selectedMeals
	};
}

export default connect(mapStateToProps, { resetMealSelection })(MealSelection);