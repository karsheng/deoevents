import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { fetchEvent } from '../actions/events';
import { registerEvent } from '../actions/user'; 
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class RegisterEvent extends Component {
  renderField(field) {
    const { meta: { touched, error } } = field;
    
    return(
			<TextField hintText={field.label}
		    floatingLabelText={field.label}
		    type={field.type}
		    errorText={touched && error}
		    {...field.input}
		  />
    );    
  }

  handleFormSubmit(formProps) {
  	formProps.eventId = this.props.match.params.id;
  	this.props.registerEvent(formProps, () => {
  		this.props.history.push('/');
  	});
  }

	componentDidMount() {
		const { id } = this.props.match.params;
		this.props.fetchEvent(id);
	}	

	render() {
		const { event, user, handleSubmit, pristine, reset, submitting } = this.props;

		if (!event) {
			return(
				<div>Loading...</div>
			);
		}

		return(
			<form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
				<h3>{event.name}</h3>
				<Field 
					label="First Name"
					name="firstName"
					type="text"
					component={this.renderField}
				/>
				<Field 
					label="Last Name"
					name="lastName"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Email"
					name="email"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Address Line 1:"
					name="address1"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Address Line 2:"
					name="address2"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Address Line 3:"
					name="address3"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Postcode:"
					name="postcode"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Category:"
					name="category"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<Field 
					label="Phone Number:"
					name="phone"
					type="text"
					component={this.renderField}
				/>
				<br/>
				<br/>
				<br/>
				<RaisedButton type="submit" label="Proceed to Payment" className="button-submit" disabled={pristine || submitting} secondary={true}></RaisedButton>
      </form>
		);
	}
}

function validate(formProps) {
  const errors = {};

  if (!formProps.firstName) {
    errors.firstName = 'Please enter your first name';
  }

  if (!formProps.lastName) {
    errors.lastName = 'Please enter your last name';
  }

  if (!formProps.email) {
    errors.email = 'Please enter your email';
  }

  if (!formProps.address1) {
    errors.address1 = 'Please enter your address';
  }

  if (!formProps.postcode) {
    errors.postcode = 'Please enter your postcode';
  }

  if (!formProps.category) {
    errors.category = 'Please select a category';
  }

  if (!formProps.phone) {
    errors.phone = 'Please enter your phone number';
  }
  // TODO: more validation

  return errors;
}

function mapStateToProps(state, ownProps) {
	return { 
		event: state.events[ownProps.match.params.id],
		user_events: state.user_events,
		user: state.user.user_info
	};
}

export default reduxForm({
	validate,
	form: 'registerEvent'
})(
	connect(mapStateToProps, { fetchEvent, registerEvent })(RegisterEvent)
);
