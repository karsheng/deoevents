import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class Signup extends Component {
  renderField(field) {
    const { meta: { touched, error } } = field;
    
    return(
      <TextField hintText={field.label}
        floatingLabelText={field.label}
        errorText={field.touched && field.error}
        type={field.type}
        {...field.input}
      />
    );    
  }

  handleFormSubmit(formProps) {
    // Call action creator to sign up the user!
    this.props.signupUser(formProps, () => {
      this.props.history.push('/feature');
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
          label="Email:"
          type="text"
          name="email"
          component={this.renderField}
        />
        <br/>
        <Field 
          label="Password:"
          type="password"
          name="password"
          component={this.renderField}
        />
        <br/>
        <Field 
          label="Confirm Password:"
          type="password"
          name="passwordConfirm"
          component={this.renderField}
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

