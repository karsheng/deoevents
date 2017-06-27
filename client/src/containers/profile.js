import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserEvents } from '../actions/user';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
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
				<Chip style={{margin: '4px auto'}} key={interest}>{interest}</Chip>
			);
		});
	}

	renderUpcomingEvents() {
		const { user_events } = this.props;
		return _.map(user_events, (event) => {
			if (event.open) {
				return(
      		<ListItem 
      			primaryText={event.event_name} 
      			containerElement={<Link to={"/events/" + event.event_id} />} 
      			key={event.event_id}
      		/>
				);
			}
		});
	}

	renderClosedEvents() {
		const { user_events } = this.props;
		return _.map(user_events, (event) => {
			if (!event.open) {
				return(
      		<ListItem 
      			primaryText={event.event_name} 
      			containerElement={<Link to={"/events/" + event.event_id} />} 
      			key={event.event_id}
      		/>
				);
			}
		});
	}	

	render() {
		const { user } = this.props;
		return(
			<div>
				<h2>Profile</h2>
    		<Paper style={style} zDepth={5} >
    			<br/>
        	<Avatar
          	src="https://scontent-kut2-1.cdninstagram.com/t51.2885-19/s150x150/15275658_1838002483152296_2565393088411336704_a.jpg"
          	size={150}
          	style={{margin: 5}}
        	/>
					<h3>{user.firstName + " " + user.lastName}</h3>
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
								{this.renderUpcomingEvents()}	
							</List>
						</Paper>
    			</Tab>
    			<Tab label="Closed Events">
    				<Paper style={style}>
	    				<List>
								{this.renderClosedEvents()}	
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
		user: state.user.user_info,
		user_events: state.user_events
	};
}

export default connect(mapStateToProps, { fetchUserEvents })(UserProfile);