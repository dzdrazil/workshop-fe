'use strict';

var builder = require('systemjs-builder');

builder.buildSFX('main', 'web/main.js', {
	minify: false, sourceMaps: false,
	config: {
	  "paths": {
	    "*": "src/*.js",
	    "react": "bower_components/react/react-with-addons.js",
	    "react-router": "bower_components/react-router/dist/react-router.js",
	    "kefir": "bower_components/kefir/dist/kefir.js",
	    "superagent": "bower_components/superagent/superagent.js"
	  },
	  "transpiler": "6to5"
	}
})
.then(function() {
	console.log('Build complete');
	process.exit(0);
})
.catch(function(err) {
	console.log('Build error');
	console.error(err);
	process.exit(1);
});
