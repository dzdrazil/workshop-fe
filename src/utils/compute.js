'use strict';

import m from 'mithril';

export default function(fn, ...args) {
	m.startComputation();
	fn(...args);
	m.endComputation();
}
