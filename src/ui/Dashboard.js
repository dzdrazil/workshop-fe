'use strict';

import React from 'react';
import {CreateProjectSink, ProjectsStream} from '../services/ProjectService';
import mapmap from '../utils/mapmap';

export default React.createClass({
	getInitialState() {
		return {projects: new Map()};
	},

	onSubmitCreateProject(e) {
		e.preventDefault();
		let name = this.refs.newName.getDOMNode().value;
		let description = this.refs.newDesc.getDOMNode().value;

		CreateProjectSink
			.emit({name, description});

		this.refs.newName.getDOMNode().value = '';
		this.refs.newDesc.getDOMNode().value = '';
	},

	componentDidMount() {
		ProjectsStream.onValue(
				projects => this.setState({projects}));
	},

	componentWillUnmount() {

	},

	render: function() {
		return (
			<div>
				<h1>Projects!</h1>
				<form onSubmit={this.onSubmitCreateProject}>
					<fieldset>
						<legend>Create a new project</legend>
						<label htmlFor="new-project-name">Name</label><br/>
						<input name="name" ref="newName" id="new-project-name" />
						<hr/>
						<label htmlFor="new-project-description">Description</label><br/>
						<input name="description" ref="newDesc" id="new-project-description" />
						<hr/>
						<input type="submit" value="Submit"/>
					</fieldset>
				</form>
				<hr/>
				<section>
					<ul>
						{mapmap(
							(key, project) => <li key={key}>{project.name}</li>,
							this.state.projects)}
					</ul>
				</section>
			</div>
		);
	}
});
