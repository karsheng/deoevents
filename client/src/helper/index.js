import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

export const formatDate = (datetime) => {

	const date = new Date(datetime);
	 
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
};


export const renderMenuItem = (itemArray) => {
  return itemArray.map(itemValue => {
    return <MenuItem key={itemValue} value={itemValue} primaryText={itemValue} />
  });
};

export const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup
    {...input}
    {...rest}
    valueSelected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

export const renderSelectField = ({
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

export const renderDatePicker = ({ input, label, meta: { touched, error }, ...custom }) => {
  return (
    <DatePicker
      onChange={(e, val) => {return input.onChange(val)}}
      {...custom}
      value={(input.value) ? input.value : {}}
    />
  );
};

export const renderField = (field) => {
  const { meta: { touched, error } } = field;
  return(
    <TextField hintText={field.label}
      floatingLabelText={field.label}
      errorText={touched && error}
      type={field.type}
      {...field.input}
    />
  );
};
