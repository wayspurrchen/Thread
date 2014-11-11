// Returns an object containing the keys "stripped" and "full",
// which contain the inner contents of a regex match, and the
// full string including outer contents and inner contents of
// that match. Designed to capture text from inputs like
// [[content]], <tag>content</tag>, and {{content}}, while using
// arbitrary regex expressions.
function captureRegexContents(regex, both, string) {
	var captures = [];
	var capture = regex.exec(string);
	while (capture != null) {
		if (both) {
			// Push both things
			captures.push({
				stripped: capture[1],
				full: capture[0]
			});
		} else {
			// Push only stripped
			captures.push(capture[1]);
		}
		capture = regex.exec(string);
	}
	return captures;
}

// Utility regexes
var regexes = {
	doubleSquareBrackets: /\[\[(.+?)\]\]/g,
	doubleCurlyBraces: /\{\{(.+?)\}\}/g,
	// Create a regex for capturing the inside contents of a HTML-style tag (<tag></tag>)
	generateXMLTagWrap: function(tag) {
		return new RegExp('<' + tag + '>([\\s\\S]+?)</' + tag + '>+', 'g');
	}
};

// Get the contents between opening and closing tags
// inside a body of text, such as <tag>contents</tag>
function getTagContents(tag, string) {
	var regex = regexes.generateXMLTagWrap(tag);
	return captureRegexContents(regex, true, string);
}

module.exports.getTagContents = getTagContents;
module.exports.parseDoubleSquareBrackets = captureRegexContents.bind(
	undefined, regexes.doubleSquareBrackets, true
);
module.exports.parseDoubleCurlyBraces = captureRegexContents.bind(
	undefined, regexes.doubleCurlyBraces, true
);