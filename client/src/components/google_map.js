import React, { Component } from 'react';

class GoogleMap extends Component {
	componentDidMount() {
		// this.refs.map --> usually use for third party APIs that doesn't really support React
		var latLng = { lat: this.props.lat, lng: this.props.lng };
		var map = new google.maps.Map(this.refs.map, {
			zoom: 14,
			center: {
				lat: latLng.lat,
				lng: latLng.lng
			}
		});
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });		
	}

	render() {
		return <div style={{width: 1080, height: 500}} ref="map" /> // ref refers to the HTML component created 
	}	
}

export default GoogleMap