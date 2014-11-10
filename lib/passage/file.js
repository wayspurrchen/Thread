require('es6-promise').polyfill();
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
var util = require('../util.js');

// Just load a file. Probably should leave this to a util.
module.exports.loadFile = function(filepath) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filepath, { encoding: 'UTF8' }, function(err, contents) {
			// Get extension-less filename
			var filename = util.pathToFilename(filepath);
			if (err) {
				reject(err);
			} else {
				// Format into object with front-matter and body
				resolve(contents);
			}
		});
	});
};

// Takes in a passage object and returns a file body.
module.exports.generateFile = function() {

};

module.exports.parseFrontMatter = function(contents) {
	var fmObject = fm(contents);
	return fmObject;
};