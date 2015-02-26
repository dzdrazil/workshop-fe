'use strict';

export default function mapmap(predicate, map) {
	let ret = [];
	for (let [key, value] of map.entries()) {
		ret.push(predicate(key, value));
	}
	return ret;
}
