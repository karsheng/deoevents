import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchEvent } from '../../actions/event_actions';
import { selectCategory } from '../../actions/registration_actions';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const style = {
  height: 200,
  width: 200,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class CategorySelection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zDepths: [],
			isDisabled: true
		}
	}

	selectCategory = (category, i) => {
		this.props.selectCategory(category, () => {
			const newZDepths = this.state.zDepths.map(zDepth => {
				return 1;
			});
			newZDepths[i] = 5;
			this.setState({ 
				zDepths: newZDepths,
				isDisabled: false
			});
		});
	}

	renderButton(component, isDisabled, buttonText) {
		return(
			<FlatButton 
				disabled={isDisabled}
				primary={true} 
				containerElement={component}
			>
				{buttonText}
			</FlatButton>
		);
	}

	componentDidMount() {
    const { event_id } = this.props.match.params;
		this.props.fetchEvent(event_id, () => {
			const { categories } = this.props.event;
			const zDepths = categories.map(category => {
				return 1;
			});
			this.setState({ zDepths });
		});
	}

	renderCategoryForm(categories) {
		return categories.map((category, i) => {
			const { zDepths } = this.state;
			return(
				<Paper key={category._id} style={style} zDepth={zDepths[i]}>
					<div style={{margin: 10}}>
						<h4>{category.name}</h4>
						<h5>RM {category.price}</h5>
						<FlatButton 
							primary={true}
							onTouchTap={this.selectCategory.bind(this, category, i)}
						>
							Select
						</FlatButton>
					</div>
				</Paper>
			);
		});
	}

	render() {
		const { event } = this.props;
		if (!event) {
			return(
				<CircularProgress />
			);
		}

		const backButtonLink = (event) => {
			return(
				<Link to={"/event/" + event._id}></Link>
			);
		};

		const nextButtonLink = (event) => {
			if (this.state.isDisabled) {
				return 'dummyString';
			} else {
				return(
					<Link to={"/"}></Link>
				);
			}
		};

		return(
			<div>
				<h2>{event.name}</h2>
				<h3>Step 1: Select Category</h3>
				{this.renderCategoryForm(event.categories)}
				<br />
				{this.renderButton(
					backButtonLink(event), 
					false,
					'Back'
				)}
				<br />
				{this.renderButton(
					nextButtonLink(event), 
					this.state.isDisabled,
					'Next'
				)}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		event: state.events[ownProps.match.params.event_id]
	}
}

export default connect(mapStateToProps, { fetchEvent, selectCategory })(CategorySelection);