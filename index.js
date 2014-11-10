// Globally polyfill es6 promise
require('es6-promise').polyfill();

var _    = require('lodash');
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
var parser    = require('./lib/story/parser.js');
var htmlGenerator = require('./lib/generator.js');

// Grab arguments
var argv = require('minimist')(process.argv.slice(2));

// Set target to specified path or current path
var target = path.resolve(argv._[0] || '.');

parser.storyObjectFromDir(target)
	.then(function(storyObject) {
		console.log(JSON.stringify(storyObject));
		// console.log(storyObject);
		return htmlGenerator.generate('default', storyObject);
	}).then(function(html) {
		fs.writeFile(path.resolve(__dirname, './dist/index.html'), html, function (err) {
			if (err) throw err;
			console.log('It\'s saved!');
		});
	}).catch(function(err) {
		console.log(err.stack);
	});;
