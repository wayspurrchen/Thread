// Globally polyfill es6 promise
require('es6-promise').polyfill();

var _    = require('lodash');
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
// Grab arguments
var argv = require('minimist')(process.argv.slice(2));

function generateRegex(tag) {
	return new RegExp('(<' + tag + '>([\\s\\S]+?)</' + tag + '>)+', 'g');
}

function getTagContent(tag, string) {
	var regex = generateRegex(tag);
	var captures = [];
	var capture = regex.exec(string);
	while (capture != null) {
		captures.push(capture[2]);
		capture = regex.exec(string);
	}
	return captures.join('');
}

module.exports = {
	regex: generateRegex,
	getTagContent: getTagContent
};