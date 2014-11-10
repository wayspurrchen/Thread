// Actually builds the HTML file out in its entirety.

var util = require('../util.js');
var _    = require('lodash');
var fs   = require('fs');
var fm   = require('front-matter');
var path = require('path');
var cheerio = require('cheerio');
var storyParser = require('../story/parser.js');

function findCommentDirective($set, directiveString) {
	return $set.filter(function(i, el) {
		return this.data.trim() == directiveString;
	});
}

var linkTemplateString = '<a href data-link="<%= link %>"><%= text %></a>';
function linkPassageNodes(body) {
	var links = storyParser.parseDoubleSquareBrackets(body, 'both');
	for (var i = 0; i < links.length; i++) {
		var link;
		var text;
		// Create custom text if passed before a pipe
		if (links[i].stripped.indexOf('|') !== -1) {
			var linkAndText = links[i].stripped.split('|');
			link = linkAndText[0];
			text = linkAndText[1];
		} else {
			link = links[i].stripped;
			text = links[i].stripped;
		}
		// Compiled template string
		var compiled = _.template(linkTemplateString, {
			link: link,
			text: text
		});
		// Replace [[link]] with template
		body = body.replace(links[i].full, compiled);
	}
	return body;
}

// Takes a series of 
module.exports.build = function(options) {
	var $ = cheerio.load(options.htmlString);
	// Get all comments so we can inject scripts / data / etc
	var $comments = $("body").contents().filter(function(i, el){
		return this.type == 'comment';
	});

	// // Transcribe [[Link]] to <a> links
	for (var i in options.storyObject) {
		options.storyObject[i].body = linkPassageNodes(options.storyObject[i].body);
	}

	// Establish our injection point for vendor scripts
	var vendorInjectPoint = findCommentDirective($comments, 'inject:vendor');
	var passageDataInjectPoint = findCommentDirective($comments, 'inject:passage-data');
	var appInjectPoint = findCommentDirective($comments, 'inject:app');

	// Inject contents
	for (var i = 0; i < options.injects.length; i++) {
		for (var j in options.injects[i]) {
			// Grab inject point by key
			var injectPoint = findCommentDirective($comments, 'inject:' + j);
			$(injectPoint).after('<script>' + options.injects[i][j] + '</script>');
		}
	}

	// Inject passage data into page
	$(passageDataInjectPoint).after('<script> var passageData = ' + JSON.stringify(options.storyObject) + '</script>');

	// lazy sanity check
	return $.html();
};