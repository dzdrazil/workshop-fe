'use strict';

import Kefir from 'kefir';
import {CurrentIdentity, POSTauthenticatedRequest, authenticatedEventSource } from './IdentityService';

const CREATE_ROUTE = '/projects/';

export const CreateProjectSink = Kefir.emitter();

Kefir.sampledBy([CurrentIdentity], [CreateProjectSink])
	.onValue(function([identity, {name, description}]) {
		if (!identity) throw new Error('Cannot create a project without authentication');
debugger;
		POSTauthenticatedRequest(CREATE_ROUTE, {name, description});
	});

export const ProjectsStream = CurrentIdentity
	.flatMapLatest(
		identity => {
			return authenticatedEventSource(`/projects/${identity.id}/subscribe`, `workspace/${identity.id}`)
					.scan(
						(projects, project) => {
							projects.set(project.id, project);
							return projects;
						}, new Map());
		});

