import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/event_actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { GridList, GridTile } from 'material-ui/GridList';
import Slider from 'react-slick';
import Divider from 'material-ui/Divider';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false
};

class WelcomePage extends Component {
	componentWillMount() {
		this.props.fetchEvents();
	}
	renderEvents() {
		const events =  _.map(this.props.events, (event) => {
			if (event.open) {
				return(
					<GridTile
						key={event._id}
						titleStyle={styles.titleStyle}
						containerElement={<Link className="welcome-event-text" to={"/event/" + event._id}></Link>}
					>
						<img src={event.imageUrl} alt=""/>
							<p>{event.name}</p>
							<p>{event.formattedDate}</p>
							<p>{event.address}</p>
					</GridTile>
				);				
			}
		});

		return _.without(events, undefined);
	}
	render() {
		return(
			<div>
				<Slider {...settings}>
	        <div className="main-slider"><img src="http://www.buttonbox.ie/images/media/800/166.jpg" alt=""/></div>
	        <div className="main-slider"><img src="http://www.tetonparksandrec.org/images/uploads/bucket/Hillclimb_square_logo_white.jpg" alt=""/></div>
	        <div className="main-slider"><img src="https://www.runsociety.com/wp-content/themes/runsociety-4/images/default-event.jpg?x93482" alt=""/></div>
	        <div className="main-slider"><img src="https://event.howei.com/sites/default/files/events/2016/SPHalf2016/sp-half-banner.jpg" alt=""/></div>
	      </Slider>	
			<br/>
			<br/>
				<h2>Events</h2>
				<div style={styles.root}>
					<GridList style={styles.gridList} cols={1.1} cellHeight="auto">
					{this.renderEvents()}
					</GridList>	
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		events: state.events
	};
}

export default connect(mapStateToProps, actions)(WelcomePage);