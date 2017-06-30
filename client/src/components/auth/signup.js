import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions/auth_actions';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { COUNTRIES } from '../../constants';
import AutoComplete from 'material-ui/AutoComplete';

const renderMenuItem = (itemArray) => {
  return itemArray.map(itemValue => {
    return <MenuItem key={itemValue} value={itemValue} primaryText={itemValue} />
  });
};

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup
    {...input}
    {...rest}
    valueSelected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  multiple,
  ...custom
}) => (
  <SelectField
    multiple={multiple}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);

const renderDatePicker = ({ input, label, meta: { touched, error }, ...custom }) => {
  return (
    <DatePicker
      onChange={(e, val) => {return input.onChange(val)}}
      {...custom}
      value={(input.value) ? input.value : {}}
    />
  );
};

const renderField = (field) => {
  const { meta: { touched, error } } = field;
  return(
    <TextField hintText={field.label}
      floatingLabelText={field.label}
      errorText={touched && error}
      type={field.type}
      {...field.input}
    />
  );
}

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
          <MenuItem value="5km" primaryText="5km" />
          <MenuItem value="10km" primaryText="10km" />
          <MenuItem value="Half-marathon" primaryText="Half-marathon" />
          <MenuItem value="Full-marathon" primaryText="Full-marathon" />
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

