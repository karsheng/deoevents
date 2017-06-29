import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import { Tabs, Tab } from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';


const style = {
  height: '100%',
  width: '100%',
  margin: '0 auto',
  textAlign: 'center',
  display: 'inline-block',
};


const tabStyles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class UserProfile extends Component {
	renderUserInterests(interests) {
		return interests.map((interest) => {
			return(
				<Chip style={{margin: '4px auto'}} key={interest.name}>{interest.name}</Chip>
			);
		});
	}

	renderUpcomingEvents(registrations) {
		return _.map(registrations, (reg) => {
			if (reg.event.open) {
				return(
      		<ListItem 
      			primaryText={reg.event.name} 
      			containerElement={<Link to={"/event/" + reg.event._id} />} 
      			key={reg.event._id}
      		/>
				);
			}
		});
	}

	renderClosedEvents(registrations) {
		return _.map(registrations, (reg) => {
			if (!reg.event.open) {
				return(
      		<ListItem 
      			primaryText={reg.event.name} 
      			containerElement={<Link to={"/event/" + reg.event._id} />} 
      			key={reg.event._id}
      		/>
				);
			}
		});
	}	

	render() {
		const { user } = this.props;
		if (!user) return <div>loading...</div>
		return(
			<div>
				<h2>Profile</h2>
    		<Paper style={style} zDepth={5} >
    			<br/>
					<h3>{user.name}</h3>
					<br/>
					<h4>Address</h4>
					<p>{user.address1}</p>
					<p>{user.address2}</p>
					<p>{user.address3}</p>
					<br/>
					<h4>Interest</h4>
					{this.renderUserInterests(user.interests)}
					<br/>
					<br/>
    		</Paper>
    		<br/>
    		<br/>
    		<h2>Events Joined</h2>
    		<Tabs>
    			<Tab label="Upcoming Events">
    				<Paper style={style}>
							<List>
								{this.renderUpcomingEvents(user.registrations)}	
							</List>
						</Paper>
    			</Tab>
    			<Tab label="Closed Events">
    				<Paper style={style}>
	    				<List>
								{this.renderClosedEvents(user.registrations)}	
							</List>
						</Paper>
    			</Tab>
    		</Tabs>
    		<br/>
    		<br/>
    		<br/>
    		<br/>
    		<br/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.auth.info
	};
}

export default connect(mapStateToProps)(UserProfile);