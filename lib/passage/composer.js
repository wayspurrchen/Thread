require('es6-promise').polyfill();

var _    = require('lodash');
var fs   = require('fs');
var path = require('path');
var marked      = require('marked');
var recurseDir  = require('recursive-readdir');
var passageUtil = require('./util.js');

// The passage composer should:
// 
// 1. Strip out any predefined tags (<prescript>, <postscript>)
// and turn them into attributes on the passage object
// 2. Should detect links and generate an array of story links
// 3. Sets up ids between titles, filenames, etc.

// Returns an object containing an array of contents of a tag, and
// the altered body with the full tag contents stripped.
function sliceTagContent(tag, body) {
	var tagContents = passageUtil.getTagContents(tag, body);
	var stripped = [];
	for (var i = 0; i < tagContents.length; i++) {
		body = body.replace(tagContents[i].full, '');
		stripped.push(tagContents[i].stripped);
	}
	return {
		stripped: stripped,
		body: body
	};
}

// Generates a passage object. Takes in a body
// and set of attributes.
module.exports.generatePassageObject = function(body, attributes) {
	// console.log(body, attributes)
	var pObj = {
		attributes: attributes
	};

	var tags = ['prescript', 'postscript'];
	for (var i = 0; i < tags.length; i++) {
		var tagContent = sliceTagContent(tags[i], body);
		// console.log(tagContent)
		body = tagContent.body;
		pObj[tags[i]] = tagContent.stripped;
	}

	pObj.body = body;

	// console.log(pObj)

	return pObj;
};