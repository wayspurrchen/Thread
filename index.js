// Globally polyfill es6 promise
require('es6-promise').polyfill();

var _    = require('lodash');
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
var util = require('./lib/util.js');
var tagExtractor = require('./lib/tag_extract.js');
var htmlGenerator = require('./lib/generator.js');
// Grab arguments
var argv = require('minimist')(process.argv.slice(2));

var marked     = require('marked');
var recurseDir = require('recursive-readdir');

// Set target to specified path or current path
var target = path.resolve(argv._[0] || '.');

function generateStoryObject() {
	// Grab all files
	var object = {
		passages: {}
	};
	var promise = new Promise(function(resolve, reject) {
		recurseDir(target, ['node_modules', '!**/*.md'], function (err, filepaths) {
			if (err) {
				reject(err);
			} else {
				var storyObject = {};
				var htmlPromises = [];
				_.each(filepaths, function(filepath) {
					htmlPromises.push(mdFileToHTML(filepath));
				});
				Promise.all(htmlPromises).then(function(results) {
					for (var i = 0; i < results.length; i++) {
						storyObject[results[i].attributes.title] = results[i];
					}
					resolve(storyObject);
				});
			}
		});
	});
	return promise;
}

// Takes an object and a key, and then grabs the content of all
// matching HTML-style tags within that object's key's value, while
// also removing the content and tags from the object's key's value.
// 
// I use this for taking out custom-defined script tags and appending
// them to metadata from an .md file.
function extendWithCutTagContent(object, key, tags) {
	for (var i = 0; i < tags.length; i++) {
		object[tags[i]] = tagExtractor.getTagContent(tags[i], object[key]);
		object[key] = object[key].replace(tagExtractor.regex(tags[i]), '');
	}
}

function mdFileToHTML(filepath) {
	var promise = new Promise(function(resolve, reject) {
		fs.readFile(filepath, { encoding: 'UTF8' }, function(err, contents) {
			// Get extension-less filename
			var filename = util.pathToFilename(filepath);
			if (err) {
				reject(err);
			} else {
				// Format into object with front-matter and body
				var md = fm(contents);
				// Set title to filename if title hasn't been specified in front matter
				if (!md.attributes.title) md.attributes.title = filename;
				// Take out scripts and attach as metadata
				extendWithCutTagContent(md, 'body', ['postscript', 'prescript'])

				// Convert body to markdown
				md.body = marked(md.body);
				resolve(md);
			}
		});
	});
	return promise;
}

function generateStoryLinks(storyObject) {
	for (var i in storyObject) {
		var links = parseDoubleSquareBrackets(storyObject[i].body);
		storyObject[i].linkKeys = links;
	}
	console.log(storyObject);
	return storyObject;
}

function parseDoubleSquareBrackets(string) {
	var regex = /\[\[(.+?)\]\]/g;
	var captures = [];
	var capture = regex.exec(string);
	while (capture != null) {
		captures.push(capture[1]);
		capture = regex.exec(string);
	}
	return captures;
}

function parseDoubleCurlyBrackets(string) {
	var regex = /\{\{(.+?)\}\}/g;
	var captures = [];
	var capture = regex.exec(string);
	while (capture != null) {
		captures.push(capture[1]);
		capture = regex.exec(string);
	}
	return captures;
}

generateStoryObject().then(generateStoryLinks)
	.then(function(storyObject) {
		return htmlGenerator.generate('default', storyObject);
	}).catch(function(err) {
		console.log(err.stack);
	});;
