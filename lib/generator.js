require('es6-promise').polyfill();

var composeContentMap = require('./templates/content_composer.js').compose;
var buildHTML = require('./templates/builder.js').build;
var recurseDir = require('recursive-readdir');
var util = require('./util.js');
var _    = require('lodash');
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
var cheerio = require('cheerio');

var coreInjectDir = path.resolve(__dirname, '../inject');
var defaultTemplateDir = path.resolve(__dirname, '../templates');

// These can float as locals because node nicely caches local
// variables when requiring modules multiple times
var defaultTemplates;
var coreInjects;

function getDefaultTemplateStrings() {
	return util.getDirectories(defaultTemplateDir);
}

function getHTMLContents(pathDir) {
	var pathDir = path.resolve(pathDir, 'index.html');
	return util.readUTF8FileReturnPromise(path.resolve(pathDir));
}

// 1) Get default, core injection files. We'll wrap all other entry-point methods
//    with this ready promise so our generator doesn't run until we have the core
//    stuff to inject.
// 2) In addition, we'll also grab the default templates in existence.
var ready = new Promise(function(resolve, reject) {
	Promise.all([
		composeContentMap(coreInjectDir),
		getDefaultTemplateStrings()
	]).then(function(results) {
		// Assign core inject map and default templates to local
		// module variable
		coreInjects = results[0];
		defaultTemplates = _.map(results[1], function(p) {
			return path.basename(p);
		});
		resolve();
	});
}).catch(function(err) {
	console.log(err.stack);
});

// Take in a template string and actually build out our HTML.
module.exports.generate = function(templateString, storyObject) {
	var templatePath;
	// When ready...
	return ready.then(function() {
		// Grab a template content map
		if (_.contains(defaultTemplates, templateString)) {
			// Found a default template
			templatePath = path.resolve(__dirname, '../templates/' + templateString);
			return composeContentMap(templatePath);
		} else {
			// Didn't find a default, so we swapped to one
			templatePath = path.resolve(__dirname, templateString);
			return composeContentMap(templatePath);
		}
	}).then(function(templateInjects) {
		// Grab HTML string
		return getHTMLContents(templatePath).then(function(htmlString) {
			// Return built HTML
			return buildHTML({
				htmlString: htmlString,
				injects: [coreInjects, templateInjects],
				storyObject: storyObject
			});
		});
	}).catch(function(err) {
		console.log(err.stack);
	});
};

module.exports.generate('default');