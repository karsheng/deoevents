import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
	}

	handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  renderMenuItems () {
  	if (this.props.authenticated) {
  		return([
				<MenuItem key={2} containerElement={<Link to="/profile" />}>Profile</MenuItem>,
				<MenuItem key={3} containerElement={<Link to="/signout" />}>Sign Out</MenuItem>
			]);
  	} else {
			return([
				<MenuItem key={2} containerElement={<Link to="/signin" />}>Sign In</MenuItem>,
				<MenuItem key={3} containerElement={<Link to="/signup" />}>Sign Up</MenuItem>
			]);  		
  	}
  }

	render() {
		return (
			<div>
			<AppBar 
				title="Runners App"
				onLeftIconButtonTouchTap={this.handleToggle}
			/>
      <Drawer
        docked={false}
        width={200}
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}
      >
				<MenuItem key={1} containerElement={<Link to="/" />}>Home</MenuItem>
				{this.renderMenuItems()}
      </Drawer>			
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(Header);