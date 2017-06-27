import React from 'react';

export default (props) => {
	return(
		<fieldset className="form-group">
			<label>{props.label}</label>
			<input className="form-control" {...props.fieldval} type={props.type} />
		</fieldset>
	);
}