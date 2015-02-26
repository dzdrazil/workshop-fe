'use strict';

export default function sortmap(predicate, map) {
	let entries = map.entries();
	let arr = [];
	let retmap = new Map();
	for (let [key, value] of entries) {
		arr.push([key, value]);
	}

	arr.sort(predicate)
		.forEach(([key, value]) => retmap.set(key, value));

	return retmap;
}
