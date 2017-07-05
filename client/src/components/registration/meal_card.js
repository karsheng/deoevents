import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
	selectMeal, 
	deselectMeal
} from '../../actions/registration_actions';
import {
	Card, CardActions, 
	CardHeader, CardMedia, 
	CardTitle, CardText
} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
	div: {
		marginBottom: 15
	},
  checkbox: {
    marginBottom: 15,
    width: 100
  },
  selectField: {
  	width: 60
  }
};

class MealCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 1
		}
	}

	handleValueChange = (e, index, value) => {
		const { meal, event } = this.props;

		this.setState({value});
		if (meal._id in this.props.selectedMeals) {
			this.props.selectMeal({ meal, quantity: value, event: event._id });
		}
	}

	handleCheck = (e, isInputChecked) => {
		const { meal, event } = this.props;

		if (isInputChecked) {
			this.props.selectMeal({ meal, quantity: this.state.value, event: event._id });
		} else {
			this.props.deselectMeal(meal._id);
		}
	}

	render() {
		const { meal } = this.props;
		return(
			<div className="col-xs-6 col-sm-4">
				<Card>
					<CardMedia>
						<img src={meal.imageUrl}/>
					</CardMedia>
					<CardTitle subtitle={meal.name + ' | RM ' + meal.price} />
					<CardActions>
						<SelectField
		          floatingLabelText="Quantity"
		          value={this.state.value}
		          onChange={this.handleValueChange}
		          style={styles.selectField}
		        >
		          <MenuItem value={1} primaryText="1" />
		          <MenuItem value={2} primaryText="2" />
		          <MenuItem value={3} primaryText="3" />
		          <MenuItem value={4} primaryText="4" />
		          <MenuItem value={5} primaryText="5" />
		          <MenuItem value={6} primaryText="6" />
		          <MenuItem value={7} primaryText="7" />
		          <MenuItem value={8} primaryText="8" />
		          <MenuItem value={9} primaryText="9" />
		          <MenuItem value={10} primaryText="10" />
		        </SelectField>
		        <Checkbox 
							style={styles.checkbox}
							onCheck={this.handleCheck}
						/>
					</CardActions>
				</Card>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		selectedMeals: state.registration.selectedMeals
	};
}

export default connect(mapStateToProps, { selectMeal, deselectMeal })(MealCard);