'use strict';

import Kefir from 'kefir';
import API_SETTINGS from '../apiSettings';
import Superagent from 'superagent';

/*jshint -W079 */
let localStorage = window.localStorage;

class Identity{
	constructor(name, id, credentials) {
		this.name = name;
		this.credentials = credentials;
		this.id = id;
	}

	toJSON() {
		return {
			name: this.name,
			id: this.id,
			credentials: this.credentials
		};
	}
}
const BASE_URL = API_SETTINGS.baseUrl;
const LOGIN_URL = API_SETTINGS.baseUrl + '/login';


export const IdentityStream = Kefir.emitter();

function restoreSession() {
	let n = localStorage.getItem('name');
	let c = localStorage.getItem('credentials');
	let i = localStorage.getItem('userId');

	if (n && c && i) {
		return new Identity(n, i, c);
	}
	return null;
}

function setIdentity(name, id, credentials) {
	localStorage.setItem('name', name);
	localStorage.setItem('credentials', credentials);
	localStorage.setItem('userId', id);

	IdentityStream.emit(restoreSession());
}

export function clearIdentity() {
	localStorage.removeItem('name');
	localStorage.removeItem('credentials');
	localStorage.removeItem('userId');

	IdentityStream.emit(null);
}

export const CurrentIdentity = IdentityStream.toProperty(restoreSession());

export function authenticate(email) {
	return Superagent.post(LOGIN_URL)
		.send({email})
		.end(
			res => {
				if (res.ok) setIdentity(
					email,
					res.body.userId,
					res.body.token
				);
				else window.alert('error: ' + res.error.message);
			});
}

export function POSTauthenticatedRequest(uri, args) {
	CurrentIdentity
		.onValue(
			identity => {
				Superagent
					.post(BASE_URL + uri)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${identity.credentials}`)
					.send(args)
					.end(
						response => {
							if (!response.ok) window.alert('create error', JSON.stringify(response.body));
						});
			});
}

const QueryAccesssToken = CurrentIdentity
	.map(
		identity => `?access_token=${identity.credentials}`);


export function authenticatedEventSource(uri, eventName) {
	return QueryAccesssToken
		.flatMapLatest(
			queryString => {
				let eventSource = new window.EventSource(`${BASE_URL}${uri}${queryString}`);

				return Kefir.fromBinder(
					emitter => {
						let ess = Kefir.fromEvent(eventSource, eventName || 'message');

						ess.onValue(
							e => emitter.emit(JSON.parse(e.data)));

						return () => {
							eventSource.close();
						};
					});
			});
}

