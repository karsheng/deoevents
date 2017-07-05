import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import MealCard from './meal_card';

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

	componentDidMount() {
		const { selectedCategory } = this.props;
		const { event_id } = this.props.match.params;
		
		if (!selectedCategory) return this.props.history.push(`/event/${event_id}`);
		if (selectedCategory.event !== event_id) return this.props.history.push(`/event/${event_id}`);
		
	}

	renderMealForm(meals) {
		return meals.map((meal) => {
			return(
				<MealCard
					key={meal._id} 
					meal={meal}
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
				<Link to={"/registration/confirmation/" + event._id}></Link>
			);
		};

		return(
			<div>
				<h2>{event.name}</h2>
				<h3>Step 2: Select Meal</h3>
				<div className="row">
					{this.renderMealForm(event.meals)}
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

export default connect(mapStateToProps)(MealSelection);