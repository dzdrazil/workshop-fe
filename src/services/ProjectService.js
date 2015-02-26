'use strict';

import Kefir from 'kefir';
import IdentityService from './IdentityService';

const CREATE_ROUTE = '/projects/';

export const CreateProjectSink = Kefir.emitter();

Kefir.sampledBy([IdentityService.identity], [CreateProjectSink])
.onValue(function([identity, {name, description}]) {
	if (!identity) throw new Error('Cannot create a project without authentication');

	IdentityService.POSTauthenticatedRequest(CREATE_ROUTE, {name, description});
});

export const ProjectsStream = IdentityService
	.identity
	.flatMapLatest(
		identity => Kefir.fromBinder(
			emitter => {
				let id = identity.id;
				let eventSource = IdentityService.authenticatedStream(`/projects/${id}/subscribe`);
				let projectStream = Kefir.fromEvent(eventSource, `workspace/${id}`)
					.map(
						e => JSON.parse(e.data))
					.scan(
						(projects, project) => {
							projects.set(project.id, project);
							return projects;
						}, new Map())
					.onValue(p => emitter.emit(p));

				return () => {
					eventSource.close();
					projectStream.end();
				};
			}));
