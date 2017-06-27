import axios from 'axios';
import { FETCH_EVENTS, FETCH_EVENT } from './types';

const ROOT_URL = 'http://localhost:3090';

const lorem = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';
const fillerImg = "http://maknafoundersrun.org/wp-content/uploads/2014/10/RaceKitCollectionPost_v1.jpg";

export const events = [
	{id: 1, name: 'Event 1', venue: 'Kuala Lumpur', date: 1483200000000, description: lorem, open: false, poster_small: 'http://3.bp.blogspot.com/-yg1VDmgiXOE/UKuTFQmjxpI/AAAAAAAAC1Y/9GzFhs0bLr4/s400/Poster.jpg', main_img: fillerImg, lat: 3.139003, lng: 101.686855},
	{id: 2, name: 'Event 2', venue: 'Kota Kinabalu', date: 1485964800000, description: lorem, open: false, poster_small: 'https://pbs.twimg.com/profile_images/626384126388621312/YXZ7hXzd.jpg', main_img: fillerImg, lat: 5.980408, lng: 116.073457},
	{id: 3, name: 'Event 3', venue: 'Johor Bharu', date: 1488470400000, description: lorem, open: false, poster_small: 'https://pbs.twimg.com/profile_images/626384126388621312/YXZ7hXzd.jpg', main_img: fillerImg, lat: 1.492659, lng: 103.741359},
	{id: 4, name: 'Event 4', venue: 'Ipoh', date: 1491235200000, description: lorem, open: false, poster_small: 'https://pbs.twimg.com/profile_images/626384126388621312/YXZ7hXzd.jpg', main_img: fillerImg, lat: 4.597479, lng: 101.090106},
	{id: 5, name: 'Event 5', venue: 'Kota Kemuning', date: 1493913600000, description: lorem, open: true, poster_small: 'http://4.bp.blogspot.com/-OaVBubfWtWw/TqW6QbmeT6I/AAAAAAAAIdY/JXCE0cB3a2Y/s1600/smartmarathontraining.jpg', main_img: fillerImg, lat: 2.992505, lng: 101.541460},
	{id: 6, name: 'Event 6', venue: 'Ara Damansara', date: 1496678400000, description: lorem, open: true, poster_small: 'http://www.bradfordonavon.co.uk/images/events/1345_030517193133_Scarecrow-Poster-201796990-small.png', main_img: fillerImg, lat: 3.124443, lng: 101.583075},
	{id: 7, name: 'Event 7', venue: 'Wangsa Maju', date: 1499356800000, description: lorem, open: true, poster_small: 'http://sporthub.me/images/events/32684864b899f3e646d70cfa02fcff38.jpg', main_img: fillerImg, lat: 3.203764, lng: 101.736735},
	{id: 8, name: 'Event 8', venue: 'Taman Melawati', date: 1502121600000, description: lorem, open: true, poster_small: 'https://images-na.ssl-images-amazon.com/images/I/41mnURlQFLL._SY300_.jpg', main_img: fillerImg, lat: 3.209652, lng: 101.751839},
	{id: 9, name: 'Event 9', venue: 'Chow Kit', date: 1504886400000, description: lorem, open: true, poster_small: 'https://s-media-cache-ak0.pinimg.com/736x/76/d8/9c/76d89c05d1194f770ef0c18e23d28527.jpg', main_img: fillerImg, lat: 3.159971, lng: 101.696953},
	{id: 10, name: 'Event 10', venue: 'Genting Kelang', date: 1507564800000, description: lorem, open: true, poster_small: 'https://render.fineartamerica.com/images/rendered/search/poster/images-medium-5/running-runner13-joe-hamilton.jpg', main_img: fillerImg, lat: 3.068525, lng: 101.405963},
	{id: 11, name: 'Event 11', venue: 'Bandar Utama', date: 1510329600000	, description: lorem, open: true, poster_small: 'https://s-media-cache-ak0.pinimg.com/736x/e5/3c/57/e53c5783f5ee8911aa44395122cf711c.jpg', main_img: fillerImg, lat: 3.146718, lng: 101.611907},
	{id: 12, name: 'Event 12', venue: 'KLCC', date: 1513008000000, description: lorem, open: true, poster_small: 'http://sporthub.me/images/events/bad1320ddbc25e83ae151075a7f5e7df.jpg', main_img: fillerImg, lat: 3.146642, lng: 101.695845}
];

export function fetchEvents() {
	const formattedEvents = events.map((event) => {
		event.formattedDate = formatDate(event.date);
		return event;
	});

	return (dispatch) => {
		dispatch({
			type: FETCH_EVENTS,
			payload: formattedEvents
		});
	}

}

export function fetchEvent(event_id) {
	event = events.find((event) => {
		return event.id == event_id;
	});
	return (dispatch) => {
		dispatch({
			type: FETCH_EVENT,
			payload: event
		});
	}	
}

function formatDate(timestamp) {
	const date = new Date(timestamp);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const formattedDate = day + '-' + month + '-' +  year;
	return formattedDate;
}