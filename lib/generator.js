require('es6-promise').polyfill();

var recurseDir = require('recursive-readdir');
var util = require('./util.js');
var _    = require('lodash');
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
var cheerio = require('cheerio');

module.exports.prepare = function(templatePath) {

};
console.log(module.exports)
// Map of all the different templates' HTML
var templates = {};

// Promise array containing all the required files for the generator.
// We're doin' it async to keep it quick and sleek!
var requiredFilePromises = [];

var zeptoPath = path.resolve(__dirname, '../templates/vendor/zepto.min.js');
var appPath = path.resolve(__dirname, '../templates/lib/app.js');

var zeptoJS;
requiredFilePromises.push(util.readUTF8FileReturnPromise(zeptoPath));
requiredFilePromises.push(util.readUTF8FileReturnPromise(zeptoPath));

fs.readFile(zeptoPath, { encoding: 'UTF8' }, function(err, contents) {
	zeptoJS = contents;
});

var appJS;



// Load all .html file templates and wrap in a ready function so that we don't
// run stuff from this file until we're totally ready. This is complex when
// we mix node-style stuff with native A+/Chrome Promise style stuff.
var ready = new Promise(function(resolve, reject) {
	// We need a promise for the total recurseDir
	recurseDir(path.resolve(__dirname, '../templates'), ['!**/*.html', 'vendor'], function (err, filepaths) {
		var promises = [];

		for (var i = 0; i < filepaths.length; i++) {
			// We also need a promise for each individual readFile
			promises.push(new Promise(function(resolve, reject) {
				// Closure out i for async
				(function(i) {
					fs.readFile(filepaths[i], { encoding: 'UTF8' }, function(err, html) {
						if (err) {
							reject();
						} else {
							var filename = util.pathToFilename(filepaths[i]);;
							templates[filename] = html;
							resolve(filename);
						}
					});
				})(i);
			}));
		}

		Promise.all(promises).then(function(results) {
			resolve(results);
			// console.log('done:', promise);
		});
	});
});

function findCommentDirective($set, directiveString) {
	return $set.filter(function(i, el) {
		return this.data.trim() == directiveString;
	});
}

function linkPassageNodes() {

}

function generateHTML(templateKey, storyObject) {
	return ready.then(function(results) {
		var $ = cheerio.load(templates[templateKey]);
		// Get all comments so we can inject scripts / data / etc
		var $comments = $("body").contents().filter(function(i, el){
			return this.type == 'comment';
		});

		// Transcribe [[Link]] to <a> links
		for (var i in storyObject) {
			storyObject[i].body = linkPassageNodes(storyObject[i].body);
		}

		// Establish our injection point for vendor scripts
		var vendorInjectPoint = findCommentDirective($comments, 'inject:vendor');
		var passageDataInjectPoint = findCommentDirective($comments, 'inject:passage-data');
		var appInjectPoint = findCommentDirective($comments, 'inject:app');

		// Inject Zepto into page
		$(vendorInjectPoint).after('<script>' + zeptoJS + '</script>');
		// Inject passage data into page
		$(passageDataInjectPoint).after('<script> var passageData = ' + JSON.stringify(storyObject) + '</script>');

		// lazy sanity check
		// console.log($.html());
		// write that baby (needs to be moved to index.js)
		fs.writeFile(path.resolve(__dirname, '../dist/index.html'), $.html(), function (err) {
			if (err) throw err;
			console.log('It\'s saved!');
		});
	});
}

module.exports = {
	generate: generateHTML
};