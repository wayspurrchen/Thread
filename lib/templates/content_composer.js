var recurseDir = require('recursive-readdir');
var util = require('../util.js');
var fs   = require('fs');
var path = require('path');

// Takes a directory, considers each of its top-level directories as an injection key,
// and then takes each of those directories and flattens the contents into an array
// that is the value of the keys on an object it returns.
module.exports.compose = function(dirPath) {
	return new Promise(function(resolve, reject) {
		util.getRecursiveDirectories(dirPath).then(function(directories) {
			var injectMap = {};
			var injectPromises = [];
			for (var i = 0; i < directories.length; i++) {
				// Get all files in directory
				var injectKeyPromise = util.readUTF8RecursiveDirectoryFilesReturnPromise(directories[i]);
				// Async, capture i in IIFE
				(function(i) {
					// Grab actual file contents
					injectKeyPromise.then(function(fileContents) {
						var base = path.basename(directories[i]);
						injectMap[base] = fileContents;
					});
				})(i);
				injectPromises.push(injectKeyPromise);
			}
			// Resolve injection map once complete
			Promise.all(injectPromises).then(function() {
				resolve(injectMap);
			}).catch(function(err) {
				console.log(err.stack);
			});
		});
	}).catch(function(err) {
		console.log(err.stack);
	});
}