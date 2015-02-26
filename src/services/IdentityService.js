'use strict';

import Kefir from 'kefir';
import API_SETTINGS from '../apiSettings';
import Superagent from 'superagent';

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

const _identityStream = Kefir.emitter();

const IdentityService = {
	currentIdentity: null,

	restoreSession() {
		let n = localStorage.getItem('name');
		let c = localStorage.getItem('credentials');
		let i = localStorage.getItem('userId');

		if (n && c && i) {
			this.currentIdentity = new Identity(n, i, c);
			return this.currentIdentity;
		}
		return null;
	},

	setIdentity(name, id, credentials) {
		localStorage.setItem('name', name);
		localStorage.setItem('credentials', credentials);
		localStorage.setItem('userId', id);
		this.currentIdentity = new Identity(name, id, credentials);
		_identityStream.emit(this.currentIdentity);
	},

	clearIdentity() {
		localStorage.removeItem('name');
		localStorage.removeItem('credentials');
		localStorage.removeItem('userId');
		this.currentId = null;
		_identityStream.emit(null);
	},

	getIdentity() {
		return this.currentIdentity;
	},

	hasIdentity() {
		return !!this.currentIdentity;
	},

	queryAccessToken() {
		var accessToken = this.currentIdentity.credentials;
		return `?access_token=${accessToken}`;
	},

	authenticate(email) {
		Superagent.post(LOGIN_URL)
			.send({email})
			.end(
				res => {
					if (res.ok) this.setIdentity(
						email,
						res.body.userId,
						res.body.token
					);
					else window.alert('error: ' + res.error.message);
				});
	},

	POSTauthenticatedRequest(uri, args) {
		if (!this.credentials) throw new Error('Cannot make an authenticated request without a valid identity');

		Superagent
			.post(BASE_URL + uri)
			.set('Accept', 'application/json')
			.set('Authorization', this.authToken)
			.send(args)
			.end(
				response => {
					if (!response.ok) window.alert('create error', JSON.stringify(response.body));
				});
	},

	authenticatedStream(uri) {
		if (!this.currentIdentity) throw new Error('unable to create authenticated stream without a current session');

		return new window.EventSource(BASE_URL + uri + this.queryAccessToken());
	}
};

IdentityService.identity = _identityStream.toProperty(IdentityService.restoreSession());

IdentityService
	.identity
	.onValue(function(identity) {
		if (identity) IdentityService.authToken = 'Bearer ' + identity.credentials;
		else IdentityService.authToken = null;
	});

export default IdentityService;
