import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions/auth_actions';
import { connect } from 'react-redux';
import { RadioButton } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import { COUNTRIES, INTERESTS } from '../../constants';
import {
  renderMenuItem,
  renderRadioGroup,
  renderSelectField,
  renderDatePicker,
  renderField
} from '../../helper/';

class Signup extends Component {

  handleFormSubmit(formProps) {
    this.props.signupUser(formProps, () => {
      this.props.history.push('/');
    });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit, pristine, reset, submitting} = this.props;
    // javascript triocl
    // if (x && y && z) === true return z
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <h2>Sign Up</h2>
        <Field 
          label="Name:"
          type="text"
          name="name"
          component={renderField}
        />
        <br/>
        <Field 
          label="Email:"
          type="text"
          name="email"
          component={renderField}
        />
        <br/>
        <Field 
          label="Password:"
          type="password"
          name="password"
          component={renderField}
        />
        <br/>
        <Field 
          label="Confirm Password:"
          type="password"
          name="passwordConfirm"
          component={renderField}
        />
        <br/>
        <Field name="gender" component={renderRadioGroup}>
          <RadioButton value={true} label="male" />
          <RadioButton value={false} label="female" />
        </Field>
        <br/>
        <Field 
          label="Address 1:"
          type="text"
          name="address1"
          component={renderField}
        />
        <br/>
        <Field 
          label="Address 2:"
          type="text"
          name="address2"
          component={renderField}
        />
        <br/>
        <Field 
          label="Address 3:"
          type="text"
          name="address3"
          component={renderField}
        />
        <br/>
        <Field 
          label="City:"
          type="text"
          name="city"
          component={renderField}
        />
        <br/>
        <Field 
          label="Postcode:"
          type="text"
          name="postcode"
          component={renderField}
        />
        <br/>
        <Field
          name="country"
          component={renderSelectField}
          label="Country"
          multiple={false}
        >
          {renderMenuItem(COUNTRIES)}
        </Field>
        <br/>
        <Field
          name="interests"
          component={renderSelectField}
          label="I am interested in:"
          multiple={true}
        >
          {renderMenuItem(INTERESTS)}
        </Field>
        <br/>
        <Field 
          hintText="Date of Birth"
          name="dateOfBirth"
          component={renderDatePicker}
        />
        <br/>
        {this.renderAlert()}
        <br/>
        <br/>
        <RaisedButton type="submit" label="Sign Up" className="button-submit" disabled={pristine || submitting} primary={true}></RaisedButton>
      </form>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  // TODO: more validation

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  validate,
  form: 'signup'
})(
  connect(mapStateToProps, actions)(Signup)
);

